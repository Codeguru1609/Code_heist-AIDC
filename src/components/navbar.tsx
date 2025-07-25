import { Link, useLocation } from "react-router-dom"
import { Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface NavbarProps {
  userPlan?: "free" | "premium"
  onLogout?: () => void
}

export function Navbar({ userPlan, onLogout }: NavbarProps) {
  const location = useLocation()

  const navItems = [
    { label: "Dashboard", href: "/dashboard", enabled: true },
    { label: "Family", href: "/family", enabled: userPlan === "premium" },
    { label: "Profile", href: "/profile", enabled: true },
    { label: "AI Reports", href: "/reports", enabled: true },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground heart-pulse" />
            </div>
            <span className="text-xl font-bold text-primary">HeartClutch</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                  !item.enabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => !item.enabled && e.preventDefault()}
              >
                {item.label}
                {!item.enabled && (
                  <span className="ml-1 text-xs text-destructive">🔒</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  )
}