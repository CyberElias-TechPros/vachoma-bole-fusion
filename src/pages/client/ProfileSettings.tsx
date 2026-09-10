import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

/**
 * Customer profile settings, persisted for real:
 * - Personal details → `profiles` (+ `customers.address`)
 * - Measurements & style notes → `customers.measurements` / `customers.preferences`
 * - Food preferences → `customers.preferences`
 * - Password → Supabase Auth (current password re-verified first)
 */
const ProfileSettings = () => {
  const { toast } = useToast();
  const { user, profile, updateProfile, uploadAvatar } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [personal, setPersonal] = useState({ fullName: "", phone: "", address: "" });
  const [measurements, setMeasurements] = useState({ bust: "", waist: "", hip: "", inseam: "", shoulder: "" });
  const [styleNotes, setStyleNotes] = useState("");
  const [food, setFood] = useState({ allergies: "", spiceLevel: "", preferredItems: "", dietaryRestrictions: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("customers")
          .select("address, measurements, preferences")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (error) throw error;

        const m = (data?.measurements as Record<string, string> | null) ?? {};
        const p = (data?.preferences as Record<string, string> | null) ?? {};
        setMeasurements({
          bust: m.bust ?? "",
          waist: m.waist ?? "",
          hip: m.hip ?? "",
          inseam: m.inseam ?? "",
          shoulder: m.shoulder ?? "",
        });
        setStyleNotes(p.style_notes ?? "");
        setFood({
          allergies: p.allergies ?? "",
          spiceLevel: p.spice_level ?? "",
          preferredItems: p.preferred_items ?? "",
          dietaryRestrictions: p.dietary_restrictions ?? "",
        });
        setPersonal({
          fullName: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          address: data?.address ?? "",
        });
      } catch (err) {
        console.error("Error loading profile settings:", err);
        toast({ title: "Couldn't load your settings", description: "Please refresh and try again.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  /** Insert or update the customer's `customers` row keyed by profile_id. */
  const upsertCustomer = async (patch: Record<string, unknown>) => {
    if (!user) throw new Error("Not signed in");
    const { data: existing, error: lookupError } = await supabase
      .from("customers")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();
    if (lookupError) throw lookupError;

    if (existing) {
      const { error } = await supabase.from("customers").update(patch).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("customers").insert({
        profile_id: user.id,
        full_name: profile?.full_name ?? user.email ?? "Customer",
        email: profile?.email ?? user.email,
        type: "individual",
        fashion_customer: true,
        food_customer: true,
        ...patch,
      });
      if (error) throw error;
    }
  };

  const savePersonal = async () => {
    if (!personal.fullName.trim()) {
      toast({ title: "Full name is required", variant: "destructive" });
      return;
    }
    setSavingSection("personal");
    try {
      const { success, error } = await updateProfile({
        full_name: personal.fullName.trim(),
        phone: personal.phone.trim() || null,
      });
      if (!success) throw error ?? new Error("Profile update failed");
      await upsertCustomer({ address: personal.address.trim() || null });
      toast({ title: "Personal information saved" });
    } catch (err) {
      console.error("Error saving personal info:", err);
      toast({ title: "Save failed", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSavingSection(null);
    }
  };

  const saveFashion = async () => {
    setSavingSection("fashion");
    try {
      const { data } = await supabase
        .from("customers")
        .select("preferences")
        .eq("profile_id", user?.id ?? "")
        .maybeSingle();
      const prefs = ((data?.preferences as Record<string, string> | null) ?? {});
      await upsertCustomer({
        measurements,
        preferences: { ...prefs, style_notes: styleNotes },
        fashion_customer: true,
      });
      toast({ title: "Fashion preferences saved", description: "Your designer will see these on your next custom order." });
    } catch (err) {
      console.error("Error saving fashion preferences:", err);
      toast({ title: "Save failed", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSavingSection(null);
    }
  };

  const saveFood = async () => {
    setSavingSection("food");
    try {
      const { data } = await supabase
        .from("customers")
        .select("preferences")
        .eq("profile_id", user?.id ?? "")
        .maybeSingle();
      const prefs = ((data?.preferences as Record<string, string> | null) ?? {});
      await upsertCustomer({
        preferences: {
          ...prefs,
          allergies: food.allergies,
          spice_level: food.spiceLevel,
          preferred_items: food.preferredItems,
          dietary_restrictions: food.dietaryRestrictions,
        },
        food_customer: true,
      });
      toast({ title: "Food preferences saved" });
    } catch (err) {
      console.error("Error saving food preferences:", err);
      toast({ title: "Save failed", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSavingSection(null);
    }
  };

  const changePassword = async () => {
    if (passwords.newPassword.length < 8) {
      toast({ title: "New password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (!passwords.currentPassword) {
      toast({ title: "Enter your current password to confirm", variant: "destructive" });
      return;
    }
    setSavingSection("account");
    try {
      // Re-verify the current password before allowing the change.
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email ?? "",
        password: passwords.currentPassword,
      });
      if (verifyError) throw new Error("Current password is incorrect.");

      const { error: updateError } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (updateError) throw updateError;

      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Password changed successfully" });
    } catch (err) {
      console.error("Error changing password:", err);
      toast({ title: "Password change failed", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSavingSection(null);
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { success, error } = await uploadAvatar(file);
    setUploading(false);
    if (success) {
      toast({ title: "Profile photo updated" });
    } else {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
    e.target.value = "";
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="container mx-auto space-y-4 py-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </ClientLayout>
    );
  }

  const busy = (section: string) => savingSection === section;

  return (
    <ClientLayout>
      <Seo title="Profile Settings" description="Update your Vachoma Empire profile, measurements and preferences." path="/client/profile" indexable={false} />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Update your personal information and preferences</p>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="mb-6 flex h-auto flex-wrap">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="fashion">Fashion Preferences</TabsTrigger>
            <TabsTrigger value="food">Food Preferences</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "Profile"} />
                      <AvatarFallback className="text-lg">
                        {profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "ME"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="customer-avatar" className="cursor-pointer">
                        <span className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-secondary/80">
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change photo"}
                        </span>
                      </Label>
                      <input id="customer-avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={uploading} />
                      <p className="mt-1 text-xs text-muted-foreground">JPG or PNG, max 2MB.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={personal.fullName}
                        onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile?.email ?? user?.email ?? ""} disabled />
                      <p className="text-xs text-muted-foreground">Email changes require verification — contact support.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={personal.phone}
                      onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                      placeholder="+234 …"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={personal.address}
                      onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                      placeholder="Street, area, city"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePersonal} disabled={busy("personal")}>
                  {busy("personal") ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="fashion">
            <Card>
              <CardHeader>
                <CardTitle>Fashion Preferences</CardTitle>
                <CardDescription>Your measurements and style preferences for custom designs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Measurements (inches)</h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {(["bust", "waist", "hip", "inseam", "shoulder"] as const).map((key) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key} className="capitalize">{key === "bust" ? "Bust/Chest" : key}</Label>
                          <Input
                            id={key}
                            value={measurements[key]}
                            onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                            placeholder="e.g. 36"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="styleNotes">Style Notes</Label>
                    <Textarea
                      id="styleNotes"
                      value={styleNotes}
                      onChange={(e) => setStyleNotes(e.target.value)}
                      placeholder="Describe your style preferences, favorite colors, materials, etc."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveFashion} disabled={busy("fashion")}>
                  {busy("fashion") ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="food">
            <Card>
              <CardHeader>
                <CardTitle>Food Preferences</CardTitle>
                <CardDescription>Your Bole food preferences and dietary restrictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={food.allergies}
                      onChange={(e) => setFood({ ...food, allergies: e.target.value })}
                      placeholder="List any food allergies"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spiceLevel">Preferred Spice Level</Label>
                    <Input
                      id="spiceLevel"
                      value={food.spiceLevel}
                      onChange={(e) => setFood({ ...food, spiceLevel: e.target.value })}
                      placeholder="Mild, Medium, Hot, Extra hot…"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredItems">Preferred Menu Items</Label>
                    <Textarea
                      id="preferredItems"
                      value={food.preferredItems}
                      onChange={(e) => setFood({ ...food, preferredItems: e.target.value })}
                      placeholder="List your favorite menu items or special requests"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                    <Input
                      id="dietaryRestrictions"
                      value={food.dietaryRestrictions}
                      onChange={(e) => setFood({ ...food, dietaryRestrictions: e.target.value })}
                      placeholder="Vegetarian, vegan, etc."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveFood} disabled={busy("food")}>
                  {busy("food") ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={changePassword} disabled={busy("account")}>
                  {busy("account") ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing…</> : "Change Password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ProfileSettings;
