import { useState } from "react";
import { Heart, Brain, Download, Calendar, TrendingUp, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { authService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    authService.signOut();
    toast({ title: "Signed out", description: "Come back soon!" });
    navigate("/");
    window.location.reload();
  };

  // Mock AI reports data
  const reports = [
    {
      id: 1,
      title: "Weekly Heart Health Summary",
      date: "2024-01-15",
      type: user?.plan === "premium" ? "detailed" : "summary",
      summary: "Great progress this week! Your heart rate shows excellent stability with a slight improvement in resting rate. Keep up the good work with your exercise routine! 💪",
      metrics: {
        avgHeartRate: "71 BPM",
        improvement: "+2%",
        exerciseDays: 5,
        stressLevel: "Low"
      },
      downloadable: true
    },
    {
      id: 2,
      title: "Bi-weekly Health Analysis", 
      date: "2024-01-01",
      type: user?.plan === "premium" ? "detailed" : "summary",
      summary: "Your heart health trends are looking positive! We noticed improved recovery times after exercise. Consider maintaining your current activity level for continued benefits. 🏃‍♂️",
      metrics: {
        avgHeartRate: "73 BPM",
        improvement: "+1%",
        exerciseDays: 4,
        stressLevel: "Moderate"
      },
      downloadable: true
    },
    {
      id: 3,
      title: "Monthly Health Overview",
      date: "2023-12-15", 
      type: "summary",
      summary: "December showed consistent heart health patterns. Your dedication to regular monitoring is paying off! Remember to stay hydrated and maintain regular sleep patterns. 😴",
      metrics: {
        avgHeartRate: "74 BPM",
        improvement: "0%",
        exerciseDays: 3,
        stressLevel: "Moderate"
      },
      downloadable: true
    },
    {
      id: 4,
      title: "Holiday Health Check",
      date: "2023-12-01",
      type: "summary", 
      summary: "Holiday season activity detected! Your heart rate shows some variation due to festivities. Consider balancing indulgence with light exercise. 🎄",
      metrics: {
        avgHeartRate: "76 BPM",
        improvement: "-1%",
        exerciseDays: 2,
        stressLevel: "Moderate"
      },
      downloadable: false
    }
  ];

  const getReportFrequency = () => {
    return user?.plan === "premium" 
      ? { frequency: "Weekly", detail: "Detailed 7-day analysis with actionable insights" }
      : { frequency: "Bi-weekly", detail: "General 14-day summary with basic trends" };
  };

  const getReportIcon = (type: string) => {
    return type === "detailed" ? "📊" : "📋";
  };

  const getImprovementColor = (improvement: string) => {
    if (improvement.startsWith('+')) return "text-health-excellent";
    if (improvement.startsWith('-')) return "text-health-warning";
    return "text-muted-foreground";
  };

  const handleDownloadReport = (reportId: number) => {
    toast({ 
      title: "Download started", 
      description: "Your PDF report is being prepared for download." 
    });
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  const reportConfig = getReportFrequency();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar userPlan={user.plan} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Brain className="mr-3 h-8 w-8 text-primary" />
              AI Health Reports
            </h1>
            <p className="text-muted-foreground">
              Personalized insights and recommendations based on your heart health data
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              variant={user.plan === "premium" ? "default" : "secondary"}
              className="px-3 py-1"
            >
              {user.plan === "premium" ? "💎 Premium" : "🆓 Free Plan"}
            </Badge>
          </div>
        </div>

        {/* Report Configuration */}
        <Card className="health-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {reportConfig.frequency} Reports
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reportConfig.detail}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next Report</p>
                <p className="font-semibold text-foreground">
                  {user.plan === "premium" ? "January 22, 2024" : "January 29, 2024"}
                </p>
              </div>
            </div>

            {user.plan === "free" && (
              <div className="mt-4 p-4 bg-primary-soft/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      💡 Want more detailed insights?
                    </p>
                    <p className="text-xs text-primary/80">
                      Upgrade to Premium for weekly detailed reports with personalized recommendations
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => navigate("/plan")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports Timeline */}
        <div className="space-y-6">
          {reports.map((report, index) => (
            <Card key={report.id} className="health-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getReportIcon(report.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(report.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <Badge variant={report.type === "detailed" ? "default" : "secondary"}>
                          {report.type === "detailed" ? "Detailed" : "Summary"}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                    disabled={!report.downloadable}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* AI Summary */}
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-accent-foreground mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-accent-foreground/80 leading-relaxed">
                    {report.summary}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="h-4 w-4 text-primary mr-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                    <p className="font-semibold text-foreground">{report.metrics.avgHeartRate}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-primary mr-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">Improvement</p>
                    <p className={`font-semibold ${getImprovementColor(report.metrics.improvement)}`}>
                      {report.metrics.improvement}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="h-4 w-4 text-primary mr-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">Exercise Days</p>
                    <p className="font-semibold text-foreground">{report.metrics.exerciseDays}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-primary mr-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">Stress Level</p>
                    <p className="font-semibold text-foreground">{report.metrics.stressLevel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for no reports */}
        {reports.length === 0 && (
          <Card className="health-card">
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Reports Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your first AI health report will be generated after {user.plan === "premium" ? "7" : "14"} days 
                of continuous heart monitoring. Keep wearing your device!
              </p>
              <Button onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary/90">
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}