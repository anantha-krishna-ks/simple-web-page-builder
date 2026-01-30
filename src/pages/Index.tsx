import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-serif font-medium text-foreground">
            Bloom
          </span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Button size="sm" className="rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6 opacity-0 animate-fade-up">
            Create something
            <span className="italic text-primary"> beautiful</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up animation-delay-200">
            A simple space to bring your ideas to life. Start building, 
            start creating, start blooming.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up animation-delay-400">
            <Button size="lg" className="rounded-full px-8 gap-2">
              Start Creating
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-foreground mb-16 opacity-0 animate-fade-up">
            Why you'll love it
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Simple & Clean"
              description="No clutter, no distractions. Just pure simplicity that lets your creativity shine."
              delay="animation-delay-200"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Fast & Light"
              description="Lightning-fast performance that keeps up with your ideas as they flow."
              delay="animation-delay-400"
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Made with Care"
              description="Every detail thoughtfully crafted to create a delightful experience."
              delay="animation-delay-600"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6 opacity-0 animate-fade-up">
            Built for dreamers
          </h2>
          <p className="text-lg text-muted-foreground mb-8 opacity-0 animate-fade-up animation-delay-200">
            Whether you're sketching your first idea or polishing your hundredth project, 
            we believe everyone deserves tools that feel effortless and inspiring.
          </p>
          <div className="opacity-0 animate-fade-up animation-delay-400">
            <Button variant="secondary" size="lg" className="rounded-full px-8">
              Join the Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-serif text-foreground">Bloom</span>
          <p className="text-sm text-muted-foreground">
            © 2025 Bloom. Made with love.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard = ({ icon, title, description, delay = "" }: FeatureCardProps) => (
  <div className={`p-6 rounded-2xl bg-background border border-border opacity-0 animate-fade-up ${delay}`}>
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-serif text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
