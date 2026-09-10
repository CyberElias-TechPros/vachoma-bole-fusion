import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { siteConfig, formatNGN } from "@/lib/site";
import { Loader2 } from "lucide-react";

/**
 * Staff settings: manage the signed-in staff member's own account, and view
 * the business configuration (which lives in environment variables so it can
 * differ between preview and production without code changes).
 */
export default function Settings() {
  const { profile, updateProfile, uploadAvatar } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast({ title: "Full name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { success, error } = await updateProfile({ full_name: fullName.trim(), phone: phone.trim() || null });
    setSaving(false);
    if (success) {
      toast({ title: "Profile updated" });
    } else {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
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
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Your staff account and business configuration.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My account</CardTitle>
            <CardDescription>Profile details shown across the management system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "Staff"} />
                <AvatarFallback className="text-lg">
                  {profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "ST"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <span className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-secondary/80">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change photo"}
                  </span>
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatar}
                  disabled={uploading}
                />
                <p className="mt-1 text-xs text-muted-foreground">JPG or PNG, max 2MB.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-name">Full name</Label>
              <Input
                id="settings-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-phone">Phone</Label>
              <Input
                id="settings-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 …"
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Role:</span>
              <Badge>{profile?.role}</Badge>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business configuration</CardTitle>
            <CardDescription>
              These values come from environment variables — change them in the Vercel project
              settings (no code changes or redeploys of logic needed, just a redeploy).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Public site URL</dt>
                <dd className="font-medium">{siteConfig.siteUrl}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Contact email</dt>
                <dd className="font-medium">{siteConfig.contact.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">WhatsApp / phone</dt>
                <dd className="font-medium">
                  {siteConfig.contact.phoneDisplay || (
                    <span className="text-amber-500">
                      Not configured — set VITE_BUSINESS_PHONE to enable WhatsApp ordering CTAs.
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Address</dt>
                <dd className="font-medium">{siteConfig.contact.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Opening hours</dt>
                <dd className="font-medium">
                  {siteConfig.contact.hours.map((h) => (
                    <div key={h}>{h}</div>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Food delivery fee</dt>
                <dd className="font-medium">{formatNGN(siteConfig.food.deliveryFeeNGN)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
