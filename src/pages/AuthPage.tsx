import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, User, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { authService, type SOSContact } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    phone: ""
  });
  const [sosContacts, setSosContacts] = useState<SOSContact[]>([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSOSContact = () => {
    if (newContact.name && newContact.phone && sosContacts.length < 2) {
      setSosContacts(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        ...newContact
      }]);
      setNewContact({ name: "", phone: "" });
    }
  };

  const removeSOSContact = (id: string) => {
    setSosContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.signIn(formData.email, formData.password);
      toast({ title: "Welcome back!", description: "Successfully signed in." });
      navigate("/dashboard");
    } catch (error) {
      toast({ 
        title: "Sign in failed", 
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await authService.signInWithGoogle();
      toast({ title: "Welcome!", description: "Successfully signed in with Google." });
      navigate("/plan");
    } catch (error) {
      toast({ 
        title: "Google sign in failed", 
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.dateOfBirth && formData.height && formData.weight && formData.phone) {
      setStep(2);
    }
  };

  const handleSignUpComplete = async () => {
    setIsLoading(true);
    
    try {
      const user = await authService.signUp(formData);
      if (sosContacts.length > 0) {
        await authService.updateUser({ sosContacts });
      }
      
      toast({ title: "Account created!", description: "Welcome to HeartClutch." });
      navigate("/plan");
    } catch (error) {
      toast({ 
        title: "Sign up failed", 
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipSOSContacts = () => {
    handleSignUpComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground heart-pulse" />
            </div>
            <span className="text-2xl font-bold text-primary">HeartClutch</span>
          </Link>
        </div>

        <Card className="health-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === "signin" ? "Welcome Back" : 
               step === 1 ? "Create Account" : "Emergency Contacts"}
            </CardTitle>
            <CardDescription>
              {mode === "signin" ? "Sign in to your HeartClutch account" :
               step === 1 ? "Let's set up your health profile" : 
               "Add up to 2 emergency contacts (optional)"}
            </CardDescription>
            
            {mode === "signup" && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Step {step} of 2</span>
                  <span>{step === 1 ? "Basic Info" : "Emergency Contacts"}</span>
                </div>
                <Progress value={step * 50} className="h-2" />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {mode === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setMode("signup")}
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </form>
            ) : step === 1 ? (
              <form onSubmit={handleSignUpStep1} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setMode("signin")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4">
                  {sosContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
                      <User className="h-4 w-4 text-accent-strong" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSOSContact(contact.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {sosContacts.length < 2 && (
                    <div className="space-y-3 p-3 border border-dashed border-border rounded-lg">
                      <Input
                        placeholder="Contact name"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Phone number"
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSOSContact}
                        disabled={!newContact.name || !newContact.phone}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Contact
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={skipSOSContacts}
                    disabled={isLoading}
                  >
                    Skip for Now
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleSignUpComplete}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Complete"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}