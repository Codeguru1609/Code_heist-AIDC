import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { authService } from "@/lib/auth";
import { useState, useEffect } from "react";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PlanSelectionPage from "./pages/PlanSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import Dashboard from "./pages/Dashboard";
import FamilyPage from "./pages/FamilyPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = authService.getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

const App = () => {
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="heartclutch-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
              <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
              <Route path="/plan" element={<ProtectedRoute><PlanSelectionPage /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/family" element={<ProtectedRoute><FamilyPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
