
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Sample user data
  const [userData, setUserData] = useState({
    personalInfo: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 123 456 7890",
      address: "123 Main Street, Port Harcourt, Nigeria",
    },
    fashionPreferences: {
      measurements: {
        bust: "36",
        waist: "28",
        hip: "38",
        inseam: "32",
        shoulder: "16",
      },
      styleNotes: "I prefer modern and traditional fusion styles with bold colors."
    },
    foodPreferences: {
      allergies: "None",
      spiceLevel: "Medium",
      preferredItems: "Bole with fish, extra spicy sauce on the side.",
      dietaryRestrictions: "None"
    },
    accountSettings: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };
  
  const handleFashionPreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "styleNotes") {
      setUserData(prev => ({
        ...prev,
        fashionPreferences: {
          ...prev.fashionPreferences,
          styleNotes: value
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        fashionPreferences: {
          ...prev.fashionPreferences,
          measurements: {
            ...prev.fashionPreferences.measurements,
            [name]: value
          }
        }
      }));
    }
  };
  
  const handleFoodPreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      foodPreferences: {
        ...prev.foodPreferences,
        [name]: value
      }
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      accountSettings: {
        ...prev.accountSettings,
        [name]: value
      }
    }));
  };

  const handleSaveChanges = (section: string) => {
    setIsSaving(true);
    
    // Simulate saving changes
    setTimeout(() => {
      toast({
        title: "Changes Saved",
        description: `Your ${section} has been updated successfully.`,
      });
      setIsSaving(false);
      
      // Reset password fields after save
      if (section === "account settings") {
        setUserData(prev => ({
          ...prev,
          accountSettings: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          }
        }));
      }
    }, 1500);
  };

  return (
    <ClientLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Update your personal information and preferences</p>
        </div>
        
        <Tabs defaultValue="personal">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="fashion">Fashion Preferences</TabsTrigger>
            <TabsTrigger value="food">Food Preferences</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <FormLabel htmlFor="fullName">Full Name</FormLabel>
                      <Input 
                        id="fullName" 
                        name="fullName"
                        value={userData.personalInfo.fullName}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={userData.personalInfo.email}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="phone">Phone Number</FormLabel>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={userData.personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Textarea 
                      id="address" 
                      name="address"
                      value={userData.personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges("personal information")}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="fashion">
            <Card>
              <CardHeader>
                <CardTitle>Fashion Preferences</CardTitle>
                <CardDescription>
                  Update your measurements and style preferences for custom designs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Measurements</h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div className="space-y-2">
                        <FormLabel htmlFor="bust">Bust/Chest (inches)</FormLabel>
                        <Input 
                          id="bust" 
                          name="bust"
                          value={userData.fashionPreferences.measurements.bust}
                          onChange={handleFashionPreferencesChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="waist">Waist (inches)</FormLabel>
                        <Input 
                          id="waist" 
                          name="waist"
                          value={userData.fashionPreferences.measurements.waist}
                          onChange={handleFashionPreferencesChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="hip">Hip (inches)</FormLabel>
                        <Input 
                          id="hip" 
                          name="hip"
                          value={userData.fashionPreferences.measurements.hip}
                          onChange={handleFashionPreferencesChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="inseam">Inseam (inches)</FormLabel>
                        <Input 
                          id="inseam" 
                          name="inseam"
                          value={userData.fashionPreferences.measurements.inseam}
                          onChange={handleFashionPreferencesChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="shoulder">Shoulder (inches)</FormLabel>
                        <Input 
                          id="shoulder" 
                          name="shoulder"
                          value={userData.fashionPreferences.measurements.shoulder}
                          onChange={handleFashionPreferencesChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel htmlFor="styleNotes">Style Notes</FormLabel>
                    <Textarea 
                      id="styleNotes" 
                      name="styleNotes"
                      value={userData.fashionPreferences.styleNotes}
                      onChange={handleFashionPreferencesChange}
                      placeholder="Describe your style preferences, favorite colors, materials, etc."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges("fashion preferences")}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="food">
            <Card>
              <CardHeader>
                <CardTitle>Food Preferences</CardTitle>
                <CardDescription>
                  Update your Bole food preferences and dietary restrictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="allergies">Allergies</FormLabel>
                    <Input 
                      id="allergies" 
                      name="allergies"
                      value={userData.foodPreferences.allergies}
                      onChange={handleFoodPreferencesChange}
                      placeholder="List any food allergies"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="spiceLevel">Preferred Spice Level</FormLabel>
                    <Input 
                      id="spiceLevel" 
                      name="spiceLevel"
                      value={userData.foodPreferences.spiceLevel}
                      onChange={handleFoodPreferencesChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="preferredItems">Preferred Menu Items</FormLabel>
                    <Textarea 
                      id="preferredItems" 
                      name="preferredItems"
                      value={userData.foodPreferences.preferredItems}
                      onChange={handleFoodPreferencesChange}
                      placeholder="List your favorite menu items or special requests"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="dietaryRestrictions">Dietary Restrictions</FormLabel>
                    <Input 
                      id="dietaryRestrictions" 
                      name="dietaryRestrictions"
                      value={userData.foodPreferences.dietaryRestrictions}
                      onChange={handleFoodPreferencesChange}
                      placeholder="Vegetarian, vegan, etc."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges("food preferences")}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your password and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword"
                      type="password"
                      value={userData.accountSettings.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <Input 
                      id="newPassword" 
                      name="newPassword"
                      type="password"
                      value={userData.accountSettings.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password"
                      value={userData.accountSettings.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges("account settings")}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Change Password"}
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
