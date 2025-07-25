import { useState } from "react";
import { Heart, User, Phone, Plus, Edit, Trash2, Camera, Save, X, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import { authService, type SOSContact } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    height: user?.height || "",
    weight: user?.weight || ""
  });
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [showAddContact, setShowAddContact] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    authService.signOut();
    toast({ title: "Signed out", description: "Come back soon!" });
    navigate("/");
    window.location.reload();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await authService.updateUser({
        height: editData.height,
        weight: editData.weight
      });
      setUser(updatedUser);
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update profile.",
        variant: "destructive"
      });
    }
  };

  const handleAddSOSContact = async () => {
    if (!user || !newContact.name || !newContact.phone) return;
    
    // Check if user is free and already has 2 contacts
    if (user.plan === "free" && user.sosContacts.length >= 2) {
      setShowUpgradeModal(true);
      return;
    }
    
    try {
      const newSOSContact: SOSContact = {
        id: Math.random().toString(36).substr(2, 9),
        name: newContact.name,
        phone: newContact.phone
      };
      
      const updatedContacts = [...user.sosContacts, newSOSContact];
      const updatedUser = await authService.updateUser({ sosContacts: updatedContacts });
      
      setUser(updatedUser);
      setNewContact({ name: "", phone: "" });
      setShowAddContact(false);
      toast({ title: "Contact added", description: "Emergency contact has been added successfully." });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to add contact.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveSOSContact = async (contactId: string) => {
    if (!user) return;
    
    try {
      const updatedContacts = user.sosContacts.filter(contact => contact.id !== contactId);
      const updatedUser = await authService.updateUser({ sosContacts: updatedContacts });
      
      setUser(updatedUser);
      toast({ title: "Contact removed", description: "Emergency contact has been removed." });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to remove contact.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  const canAddMoreContacts = user.plan === "premium" || user.sosContacts.length < 2;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar userPlan={user.plan} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <User className="mr-3 h-8 w-8 text-primary" />
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information and emergency contacts
            </p>
          </div>
          
          <Badge 
            variant={user.plan === "premium" ? "default" : "secondary"}
            className="px-3 py-1"
          >
            {user.plan === "premium" ? "💎 Premium" : "🆓 Free Plan"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <Card className="health-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>Your basic health profile details</CardDescription>
                  </div>
                  
                  <Button
                    variant={isEditing ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        setIsEditing(false);
                        setEditData({ height: user.height, weight: user.weight });
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <Button variant="outline" size="sm" className="mb-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={user.name} disabled className="mt-1" />
                  </div>
                  
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} disabled className="mt-1" />
                  </div>
                  
                  <div>
                    <Label>Date of Birth</Label>
                    <Input value={user.dateOfBirth} disabled className="mt-1" />
                  </div>
                  
                  <div>
                    <Label>Phone</Label>
                    <Input value={user.phone} disabled className="mt-1" />
                  </div>
                  
                  <div>
                    <Label>Height (cm)</Label>
                    <Input 
                      value={isEditing ? editData.height : user.height}
                      onChange={(e) => setEditData(prev => ({ ...prev, height: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input 
                      value={isEditing ? editData.weight : user.weight}
                      onChange={(e) => setEditData(prev => ({ ...prev, weight: e.target.value }))}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-3">
                    <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SOS Contacts Card */}
            <Card className="health-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>Emergency SOS Contacts</span>
                    </CardTitle>
                    <CardDescription>
                      {user.plan === "free" 
                        ? `Contacts that will be notified in emergencies (${user.sosContacts.length}/2 used)`
                        : "Contacts that will be notified in emergencies (Unlimited)"
                      }
                    </CardDescription>
                  </div>
                  
                  <Button
                    onClick={() => canAddMoreContacts ? setShowAddContact(true) : setShowUpgradeModal(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {user.sosContacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No emergency contacts added yet</p>
                    <p className="text-sm">Add contacts to receive emergency alerts</p>
                  </div>
                ) : (
                  user.sosContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSOSContact(contact.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}

                {user.plan === "free" && user.sosContacts.length >= 2 && (
                  <div className="bg-primary-soft/20 p-4 rounded-lg">
                    <p className="text-sm text-primary">
                      💡 <strong>Free plan limit reached!</strong> Upgrade to Premium to add unlimited emergency contacts.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Plan Information */}
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Your Plan</span>
              </CardTitle>
              <CardDescription>Current subscription and features</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge 
                  variant={user.plan === "premium" ? "default" : "secondary"}
                  className="px-4 py-2 text-lg"
                >
                  {user.plan === "premium" ? "💎 Premium Plan" : "🆓 Free Plan"}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Current Features:</h4>
                <ul className="text-sm space-y-2">
                  {user.plan === "premium" ? (
                    <>
                      <li className="flex items-center text-health-excellent">
                        <span className="mr-2">✓</span>
                        Unlimited AI Chatbot
                      </li>
                      <li className="flex items-center text-health-excellent">
                        <span className="mr-2">✓</span>
                        Unlimited SOS Contacts
                      </li>
                      <li className="flex items-center text-health-excellent">
                        <span className="mr-2">✓</span>
                        Family Health Section
                      </li>
                      <li className="flex items-center text-health-excellent">
                        <span className="mr-2">✓</span>
                        Weekly AI Reports
                      </li>
                      <li className="flex items-center text-health-excellent">
                        <span className="mr-2">✓</span>
                        30-Day Health Trends
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center text-health-good">
                        <span className="mr-2">✓</span>
                        Limited AI Chatbot
                      </li>
                      <li className="flex items-center text-health-good">
                        <span className="mr-2">✓</span>
                        Max 2 SOS Contacts
                      </li>
                      <li className="flex items-center text-health-good">
                        <span className="mr-2">✓</span>
                        7-Day Health Trends
                      </li>
                      <li className="flex items-center text-health-good">
                        <span className="mr-2">✓</span>
                        2 AI Reports/Month
                      </li>
                      <li className="flex items-center text-muted-foreground">
                        <span className="mr-2">✗</span>
                        Family Health Section
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {user.plan === "free" && (
                <Button 
                  onClick={() => navigate("/plan")}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Contact Dialog */}
        <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Add a trusted contact who will be notified during health emergencies.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="John Doe"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  placeholder="+1 (555) 123-4567"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddContact(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSOSContact}
                  disabled={!newContact.name || !newContact.phone}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Add Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upgrade Modal */}
        <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Crown className="mr-2 h-6 w-6 text-primary" />
                Upgrade to Premium
              </DialogTitle>
              <DialogDescription>
                You've reached the limit for emergency contacts on the free plan.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-primary-soft/20 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Premium Benefits:</h4>
                <ul className="text-sm space-y-1 text-primary/80">
                  <li>• Unlimited emergency contacts</li>
                  <li>• Family health sharing</li>
                  <li>• Weekly detailed AI reports</li>
                  <li>• 30-day health trends</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button 
                  onClick={() => navigate("/plan")}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}