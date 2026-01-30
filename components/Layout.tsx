import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  role: "student" | "teacher" | "parent";
  isAgreeTermsAndCondition?: number;
  pageType?: "login" | "prelogin" | "default";
}

const Layout = ({ children, role, isAgreeTermsAndCondition, pageType = "default" }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active menu based on current route
  const getActiveMenu = () => {
    if (location.pathname.includes("profile")) return "profile";
    return "dashboard";
  };

  const handleMenuChange = (menu: string) => {
    if (menu === "profile") {
      navigate("/profile-settings");
    } else {
      // Navigate back to respective dashboard
      if (role === "teacher") navigate("/teacher-dashboard");
      else if (role === "student") navigate("/student-dashboard");
      else if (role === "parent") navigate("/parent-dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className={`dashboard-layout min-h-screen flex flex-col ${pageType === "prelogin" ? "overflow-y-auto" : ""}`}>
      <Header onLogout={handleLogout} isAgreeTermsAndCondition={isAgreeTermsAndCondition} pageType={pageType} />
      <div className={`dashboard-container flex-1 ${pageType === "prelogin" ? "" : "flex"}`}>
        <main className={`dashboard-main ${pageType === "prelogin" ? "" : "flex-1"}`}>
          {children}
        </main>
      </div>
      <Footer className={`mt-auto ${pageType === "prelogin" ? "" : "mt-auto"}`} />
    </div>
  );
};

export default Layout;
