import { useState, useEffect } from "react";
import { Heart, Activity, TrendingUp, AlertTriangle, MessageCircle, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Navbar } from "@/components/navbar";
import { authService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock heart rate data for the past 7 days
  const heartRateData = [
    { day: "Mon", heartRate: 72, time: "Day 1" },
    { day: "Tue", heartRate: 68, time: "Day 2" },
    { day: "Wed", heartRate: 75, time: "Day 3" },
    { day: "Thu", heartRate: 71, time: "Day 4" },
    { day: "Fri", heartRate: 69, time: "Day 5" },
    { day: "Sat", heartRate: 73, time: "Day 6" },
    { day: "Sun", heartRate: 70, time: "Day 7" },
  ];

  const chartConfig = {
    heartRate: {
      label: "Heart Rate",
      color: "hsl(var(--primary))"
    }
  };

  // Mock health data
  const vitals = [
    { 
      label: "Heart Rate", 
      value: "72 BPM", 
      status: "excellent" as const, 
      icon: Heart,
      description: "Resting heart rate"
    },
    { 
      label: "Blood Pressure", 
      value: "120/80", 
      status: "good" as const, 
      icon: Activity,
      description: "Normal range"
    },
    { 
      label: "Stress Level", 
      value: "Low", 
      status: "excellent" as const, 
      icon: TrendingUp,
      description: "Based on HRV analysis"
    }
  ];

  // Mock alert history
  const alerts = [
    { id: 1, type: "info", message: "Daily check-in completed", time: "2 hours ago" },
    { id: 2, type: "success", message: "Heart rate normalized after exercise", time: "1 day ago" },
    { id: 3, type: "warning", message: "Elevated heart rate detected during sleep", time: "2 days ago" },
  ];

  const handleLogout = () => {
    authService.signOut();
    toast({ title: "Signed out", description: "Come back soon!" });
    navigate("/");
    window.location.reload(); // Force refresh to update auth state
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-health-excellent";
      case "good": return "text-health-good";  
      case "warning": return "text-health-warning";
      case "danger": return "text-health-danger";
      default: return "text-muted-foreground";
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "success": return "default";
      case "warning": return "secondary";
      case "info": return "outline";
      default: return "outline";
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar userPlan={user.plan} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.name.split(' ')[0]}! 
              </h1>
              <p className="text-muted-foreground">
                Here's your heart health summary for today
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant={user.plan === "premium" ? "default" : "secondary"}
                className="px-3 py-1"
              >
                {user.plan === "premium" ? "💎 Premium" : "🆓 Free Plan"}
              </Badge>
              
              {user.plan === "free" && (
                <Button 
                  onClick={() => navigate("/plan")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Health Vitals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {vitals.map((vital, index) => (
            <Card key={index} className="health-card group hover:shadow-[var(--shadow-soft)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary-soft group-hover:bg-primary transition-smooth">
                    <vital.icon className={`h-6 w-6 text-primary group-hover:text-primary-foreground transition-smooth`} />
                  </div>
                  <Badge variant="outline" className={getStatusColor(vital.status)}>
                    {vital.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{vital.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{vital.value}</p>
                  <p className="text-xs text-muted-foreground">{vital.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Heart Rate Chart */}
          <Card className="health-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary heart-pulse" />
                <span>7-Day Heart Rate Trend</span>
              </CardTitle>
              <CardDescription>
                Your average resting heart rate over the past week
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heartRateData}>
                    <defs>
                      <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fill="url(#heartRateGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Average: <span className="font-semibold text-foreground">71 BPM</span> • 
                  Trend: <span className="text-health-good">Stable ↗️</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alert History */}
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest health alerts and notifications</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Badge variant={getAlertVariant(alert.type)} className="mt-1 flex-shrink-0">
                      {alert.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                  {alert.id !== alerts[alerts.length - 1].id && (
                    <div className="border-b border-border/50" />
                  )}
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="mr-2 h-4 w-4" />
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigate("/reports")}
            variant="outline" 
            className="h-20 flex-col space-y-2 hover:bg-primary-soft"
          >
            <Activity className="h-6 w-6" />
            <span>AI Reports</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/profile")}
            variant="outline" 
            className="h-20 flex-col space-y-2 hover:bg-primary-soft"
          >
            <Heart className="h-6 w-6" />
            <span>SOS Contacts</span>
          </Button>
          
          <Button 
            onClick={() => user.plan === "premium" ? navigate("/family") : navigate("/plan")}
            variant="outline" 
            className="h-20 flex-col space-y-2 hover:bg-primary-soft relative"
          >
            <Users className="h-6 w-6" />
            <span>Family Health</span>
            {user.plan === "free" && (
              <Badge className="absolute -top-2 -right-2 text-xs px-1">🔒</Badge>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 hover:bg-primary-soft"
          >
            <MessageCircle className="h-6 w-6" />
            <span>AI Chat</span>
          </Button>
        </div>
      </div>

      {/* Floating AI Chatbot */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="icon"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-bounce hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}