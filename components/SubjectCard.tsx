import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

interface SubjectCardProps {
  title: string;
  image: string;
  color: string;
  onClick: () => void;
}

const SubjectCard = ({ title, image, color, onClick }: SubjectCardProps) => {
  return (
    <Card onClick={onClick} className="group subject-card relative overflow-hidden">
      {/* Corner Bookmark */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary/10 group-hover:border-t-primary/20 transition-all duration-300" />
      
      {/* Floating Accent Dots */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100" />
      <div className="absolute top-8 right-6 w-1.5 h-1.5 rounded-full bg-primary/15 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200" />
      
      {/* Sparkle Icon */}
      <Sparkles className="absolute top-3 left-3 w-4 h-4 text-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="subject-card-content relative">
        <div className={cn("subject-card-icon-wrapper", color)}>
          <img 
            src={image} 
            alt={title}
            className="subject-card-icon"
          />
        </div>
        
        <div className="flex flex-col items-center gap-2 w-full">
          <h3 className="subject-card-title">{title}</h3>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
            <span className="font-medium">Open</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
