import { Home, BarChart3, User, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileSidebarProps {
  onLogout?: () => void;
  role?: "teacher" | "student";
  combinedSelection?: string;
  onCombinedChange?: (value: string) => void;
  combinedOptions?: Array<{ id: string; label: string }>;
  showClassSubjectSelector?: boolean;
}

const MobileSidebar = ({
  onLogout,
  role = "teacher",
  combinedSelection,
  onCombinedChange,
  combinedOptions,
  showClassSubjectSelector = false,
}: MobileSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Home", onClick: () => navigate("/chapters") },
    { icon: BarChart3, label: "Reports", onClick: () => navigate("/reports-coming-soon") },
    { icon: User, label: "Profile Settings", onClick: () => navigate("/profile-settings") },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-background">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-12 h-12">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" />
              <AvatarFallback className="bg-primary text-primary-foreground">TC</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">Ms. Sarah Johnson</p>
              <p className="text-xs text-muted-foreground">
                {role === "teacher" ? "Teacher" : "Class 6"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Class/Subject Selector */}
          {showClassSubjectSelector && combinedSelection && onCombinedChange && combinedOptions && (
            <div className="space-y-2 px-2">
              <label className="text-sm font-medium">Class & Subject</label>
              <Select value={combinedSelection} onValueChange={onCombinedChange}>
                <SelectTrigger className="w-full bg-white dark:bg-white dark:text-black">
                  <SelectValue placeholder="Select class and subject" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-white z-50">
                  {combinedOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="dark:text-black">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Navigation Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-11"
                onClick={item.onClick}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          <Separator />

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
