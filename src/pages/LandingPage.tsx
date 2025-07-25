import { Link } from "react-router-dom";
import { Heart, Shield, Activity, Users, Brain, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI Health Insights",
      description: "Advanced AI analyzes your heart data to provide personalized health recommendations and early warnings."
    },
    {
      icon: AlertTriangle,
      title: "SOS Emergency Alerts",
      description: "Instant alerts to your emergency contacts when critical heart patterns are detected."
    },
    {
      icon: Activity,
      title: "Trend Analysis",
      description: "Track your heart health progress with detailed 7-30 day trend analysis and reports."
    },
    {
      icon: Users,
      title: "Family Health Sharing",
      description: "Share health summaries with family members and monitor loved ones' wellbeing together."
    }
  ];

  const trustBadges = [
    "🛡️ HIPAA Compliant",
    "🧠 AI-Powered",
    "📱 Wearable Integration",
    "⚡ Real-time Monitoring"
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-6 w-6 text-primary-foreground heart-pulse" />
          </div>
          <span className="text-2xl font-bold text-primary">HeartClutch</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="outline" className="transition-smooth hover:bg-primary-soft">
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-primary hover:bg-primary/90 transition-smooth">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent-strong bg-clip-text text-transparent">
            Your heart. Understood.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Monitor your cardiac health with AI-powered insights, real-time alerts, and family sharing. 
            Peace of mind for adults aged 25-45.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 transition-bounce hover:scale-105"
              >
                Start Monitoring
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 transition-smooth hover:bg-primary-soft"
            >
              Learn More
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="px-4 py-2 bg-accent/20 rounded-full text-sm font-medium text-accent-foreground"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Comprehensive Heart Health Monitoring
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced features designed to keep your heart healthy and your mind at ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="health-card group hover:shadow-[var(--shadow-soft)] cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-xl bg-primary-soft group-hover:bg-primary transition-smooth">
                    <feature.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-smooth" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center gradient-accent rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-6 text-accent-foreground">
            Ready to take control of your heart health?
          </h2>
          <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands who trust HeartClutch for their cardiac wellness monitoring.
          </p>
          
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-12 py-6 transition-bounce hover:scale-105"
            >
              Start Free Trial
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">HeartClutch</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 HeartClutch. Caring for your heart, one beat at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}