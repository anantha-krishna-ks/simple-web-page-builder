import { FileText, ClipboardList, BookOpen, LayoutDashboard, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  role?: "student" | "teacher";
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "learning-resources", label: "Learning Resources", icon: BookOpen },
  { id: "assessments", label: "Assessments", icon: ClipboardList },
  { id: "lesson-plans", label: "Lesson Plans", icon: BookMarked },
  { id: "reports", label: "Reports", icon: FileText },
];

const Sidebar = ({ activeMenu, onMenuChange, role = "student" }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isChaptersOrBookReader = currentPath === "/chapters" || currentPath === "/book-reader";
  
  const filteredMenuItems = role === "teacher" 
    ? menuItems 
    : menuItems.filter(item => item.id !== "lesson-plans");

  return (
    <aside className="app-sidebar hidden md:flex">
      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          // Don't show Learning Resources as active on /chapters or /book-reader pages
          const isActive = item.id === "learning-resources" && isChaptersOrBookReader 
            ? false 
            : activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={cn(
                "sidebar-item",
                isActive && "sidebar-item--active"
              )}
            >
              <Icon className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
