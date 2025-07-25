import { useState } from "react";
import { Heart, Users, Search, Plus, UserPlus, Clock, Lock, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import { authService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function FamilyPage() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock family members data
  const familyMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      relation: "Spouse",
      avatar: "SJ",
      status: "Good",
      lastUpdate: "2 hours ago",
      heartRate: "68 BPM",
      alerts: 0
    },
    {
      id: 2,
      name: "Michael Johnson",
      relation: "Son",
      avatar: "MJ",
      status: "Excellent",
      lastUpdate: "5 hours ago",
      heartRate: "75 BPM",
      alerts: 0
    },
    {
      id: 3,
      name: "Emma Johnson",
      relation: "Daughter",
      avatar: "EJ",
      status: "Good",
      lastUpdate: "1 day ago",
      heartRate: "72 BPM",
      alerts: 1
    }
  ];

  // Mock pending requests
  const pendingRequests = [
    {
      id: 1,
      name: "Robert Johnson",
      type: "incoming",
      avatar: "RJ",
      time: "2 hours ago"
    },
    {
      id: 2,
      name: "Lisa Smith",
      type: "outgoing",
      avatar: "LS",
      time: "1 day ago"
    }
  ];

  // Mock alert log
  const alertLog = [
    {
      id: 1,
      member: "Emma Johnson",
      type: "warning",
      message: "Elevated heart rate during study session",
      time: "3 hours ago"
    },
    {
      id: 2,
      member: "Sarah Johnson",
      type: "info",
      message: "Exercise session completed",
      time: "5 hours ago"
    },
    {
      id: 3,
      member: "Michael Johnson",
      type: "success",
      message: "Daily health check completed",
      time: "1 day ago"
    }
  ];

  const handleLogout = () => {
    authService.signOut();
    toast({ title: "Signed out", description: "Come back soon!" });
    navigate("/");
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent": return "text-health-excellent";
      case "good": return "text-health-good";  
      case "warning": return "text-health-warning";
      case "danger": return "text-health-danger";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent": return "default";
      case "good": return "secondary";
      case "warning": return "outline";
      default: return "outline";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return "⚠️";
      case "success": return "✅";
      case "info": return "ℹ️";
      default: return "📋";
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  // Check if user has premium access
  if (user.plan !== "premium") {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navbar userPlan={user.plan} onLogout={handleLogout} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="health-card relative overflow-hidden">
              {/* Blurred background */}
              <div className="absolute inset-0 bg-gradient-accent opacity-20 blur-sm"></div>
              
              <CardContent className="relative p-12 space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                    <Lock className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">
                    Family Health Section
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Connect with your loved ones and monitor their heart health together. 
                    Share summaries, receive alerts, and stay connected.
                  </p>
                </div>

                <div className="bg-primary-soft/30 p-6 rounded-lg space-y-3">
                  <h3 className="font-semibold text-primary flex items-center">
                    <Crown className="mr-2 h-5 w-5" />
                    Premium Features Include:
                  </h3>
                  <ul className="text-sm space-y-2 text-primary/80">
                    <li>• Add unlimited family members</li>
                    <li>• Real-time health status sharing</li>
                    <li>• Family-wide alert notifications</li>
                    <li>• Shared health reports and trends</li>
                    <li>• Emergency contact coordination</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => navigate("/plan")}
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 transition-bounce hover:scale-105"
                >
                  Upgrade to Premium
                  <Crown className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-sm text-muted-foreground">
                  Start your 3-month premium plan for just ₹1,499
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar userPlan={user.plan} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Users className="mr-3 h-8 w-8 text-primary" />
              Family Health
            </h1>
            <p className="text-muted-foreground">
              Monitor and stay connected with your loved ones' heart health
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="default" className="px-3 py-1">
              💎 Premium Feature
            </Badge>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Family
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Family Members */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <Card className="health-card">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search family members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Family Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {familyMembers.map((member) => (
                <Card key={member.id} className="health-card group hover:shadow-[var(--shadow-soft)]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center text-primary font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.relation}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(member.status)} className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        {member.alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {member.alerts}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Heart Rate:</span>
                        <span className="font-medium">{member.heartRate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Update:</span>
                        <span className="font-medium">{member.lastUpdate}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full mt-4 hover:bg-primary-soft"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pending Requests */}
            <Card className="health-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <span>Connection Requests</span>
                </CardTitle>
                <CardDescription>Manage incoming and outgoing family invitations</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {request.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.type === "incoming" ? "Wants to connect" : "Invitation sent"} • {request.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {request.type === "incoming" ? (
                        <>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">Accept</Button>
                          <Button size="sm" variant="outline">Decline</Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline">Cancel</Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Alert Log */}
          <Card className="health-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Family Alerts</span>
              </CardTitle>
              <CardDescription>Recent health notifications from family members</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {alertLog.map((alert) => (
                <div key={alert.id} className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.member}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                  {alert.id !== alertLog[alertLog.length - 1].id && (
                    <div className="border-b border-border/50" />
                  )}
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}