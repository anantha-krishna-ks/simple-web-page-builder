import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BookOpen, Eye, EyeOff, Users } from "lucide-react";
import { toast } from "sonner";

// Predefined parent credentials
const PARENT_CREDENTIALS = {
  username: "parent",
  password: "parent123",
};

const ParentLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (
        username === PARENT_CREDENTIALS.username &&
        password === PARENT_CREDENTIALS.password
      ) {
        localStorage.setItem("userRole", "parent");
        toast.success("Welcome, Parent!");
        navigate("/parent-dashboard");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Parent Portal</h1>
          <p className="text-muted-foreground">
            Sign in to monitor your ward's progress
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-center mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-medium">Parent:</span> parent / parent123
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Student/Teacher Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ParentLogin;
