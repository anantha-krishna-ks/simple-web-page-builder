import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import comingSoonImg from "@/assets/coming-soon.png";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useState, useEffect } from "react";

const ReportsComingSoon = () => {
  const navigate = useNavigate();
  const [isReloading, setIsReloading] = useState(false);
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      setIsReloading(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);
  return (
    <div className="min-h-screen w-full bg-muted/40 flex flex-col items-center justify-center p-4">
      <LoadingOverlay isLoading={isReloading} message="Reloading..." />
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/chapters")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-fade-in">
        {/* Image with floating animation */}
        <div className="relative">
          <img 
            src={comingSoonImg} 
            alt="Coming Soon" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain animate-scale-in"
            style={{ animation: "scale-in 0.6s ease-out, float 3s ease-in-out infinite" }}
          />
        </div>

        {/* Text content */}
        <div className="text-center space-y-4 max-w-lg px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Progress Reports
          </h2>
          <div className="space-y-2">
            <p className="text-xl md:text-2xl font-semibold text-primary animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Coming Soon
            </p>
            <p className="text-base md:text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
              Track your learning journey with detailed insights and personalized progress analytics
            </p>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2 mt-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  );
};

export default ReportsComingSoon;
