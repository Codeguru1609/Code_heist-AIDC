import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Check, Lock, TrendingUp, Users, Brain, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function PlanSelectionPage() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePlanSelection = async (plan: "free" | "premium") => {
    setSelectedPlan(plan);
    
    if (plan === "free") {
      try {
        await authService.updateUser({ plan: "free" });
        toast({ 
          title: "Welcome to HeartClutch Free!", 
          description: "Your account has been set up successfully." 
        });
        navigate("/dashboard");
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "Failed to update plan. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      navigate("/payment");
    }
  };

  const freePlanFeatures = [
    { icon: Brain, text: "Limited AI Chatbot", included: true },
    { icon: Shield, text: "Max 2 SOS Contacts", included: true },
    { icon: TrendingUp, text: "7-Day Health Trends", included: true },
    { icon: Heart, text: "2 AI Reports/Month", included: true, note: "14-day generic summary" },
    { icon: Users, text: "Family Health Section", included: false },
    { icon: TrendingUp, text: "30-Day Trends", included: false },
    { icon: Heart, text: "Weekly Reports", included: false }
  ];

  const premiumPlanFeatures = [
    { icon: Brain, text: "Unlimited AI Chatbot", included: true },
    { icon: Shield, text: "Unlimited SOS Contacts", included: true },
    { icon: Users, text: "Family Health Section", included: true },
    { icon: TrendingUp, text: "30-Day Health Trends", included: true },
    { icon: Heart, text: "Weekly AI Reports", included: true, note: "7-day detailed summaries" },
    { icon: Shield, text: "Priority Support", included: true },
    { icon: Brain, text: "Advanced AI Insights", included: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-7 w-7 text-primary-foreground heart-pulse" />
            </div>
            <span className="text-3xl font-bold text-primary">HeartClutch</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Choose Your Heart Health Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with our free plan or unlock advanced features with Premium. 
            You can upgrade anytime.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="health-card relative border-2 border-border hover:border-primary/30 transition-smooth">
            <CardHeader className="text-center pb-4">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">Perfect for trying out</Badge>
              </div>
              <CardTitle className="text-2xl mb-2">Free Plan</CardTitle>
              <CardDescription>Essential heart monitoring features</CardDescription>
              <div className="text-4xl font-bold text-primary mt-4">
                ₹0
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-health-good mt-0.5 flex-shrink-0" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground line-through"}>
                        {feature.text}
                      </span>
                      {feature.note && (
                        <p className="text-xs text-muted-foreground mt-1">{feature.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={() => handlePlanSelection("free")}
                disabled={selectedPlan === "free"}
              >
                {selectedPlan === "free" ? "Setting up..." : "Start Free"}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="health-card relative border-2 border-primary shadow-[var(--shadow-soft)]">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4">
              <div className="mb-4 mt-2">
                <Badge variant="outline" className="mb-2 border-primary text-primary">
                  Complete heart care
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-2 text-primary">Premium Plan</CardTitle>
              <CardDescription>Comprehensive family heart health monitoring</CardDescription>
              <div className="text-4xl font-bold text-primary mt-4">
                ₹1,499
                <span className="text-lg font-normal text-muted-foreground">/3 months</span>
              </div>
              <p className="text-sm text-muted-foreground">₹500/month • Save 33%</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {premiumPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-health-excellent mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-foreground font-medium">{feature.text}</span>
                      {feature.note && (
                        <p className="text-xs text-muted-foreground mt-1">{feature.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-bounce hover:scale-105"
                onClick={() => handlePlanSelection("premium")}
                disabled={selectedPlan === "premium"}
              >
                {selectedPlan === "premium" ? "Redirecting..." : "Choose Premium"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            Why thousands choose HeartClutch
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-soft rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Advanced machine learning analyzes your heart patterns for early detection
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-soft rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Emergency Ready</h3>
              <p className="text-sm text-muted-foreground">
                Instant SOS alerts to family when critical patterns are detected
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-soft rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Family Connected</h3>
              <p className="text-sm text-muted-foreground">
                Share health summaries and stay connected with loved ones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}