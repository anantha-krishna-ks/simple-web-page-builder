import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ParentLogin from "./pages/ParentLogin";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import BookReaderPage from "./pages/BookReaderPage";
import SplashScreen from "./pages/SplashScreen";
import LearnerLogin from "./pages/LearnerLogin";
import LearnerDashboard from "./pages/LearnerDashboard";
import ChaptersPage from "./pages/ChaptersPage";
import ReportsComingSoon from "./pages/ReportsComingSoon";
import NotFound from "./pages/NotFound";
import Prelogin from "./pages/Prelogin";
import PDFViewPage from "./pages/PDFViewPage";
import NavigationControls from "./pages/NavigationControls";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";

const queryClient = new QueryClient();

const VITE_BASE_URL = (import.meta.env.BASE_URL || "/");
// React Router expects basename without a trailing slash (except for root)
const ROUTER_BASENAME = VITE_BASE_URL === "/" ? "" : VITE_BASE_URL.replace(/\/$/, "");

const ensureBasePath = () => {
  // If the app is served under a sub-path (e.g. /oxfordignite/) but the user lands on `/`,
  // React Router won't match routes and the page can appear blank. Normalize the URL.
  if (VITE_BASE_URL !== "/" && !window.location.pathname.startsWith(VITE_BASE_URL)) {
    const nextUrl = `${VITE_BASE_URL}${window.location.search}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }
};

const App = () => {
  ensureBasePath();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={ROUTER_BASENAME}>
        <Routes>
          <Route path="/Navigation" element={<NavigationControls />} />
          <Route path="/" element={<Login />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/learner-login" element={<LearnerLogin />} />
          <Route path="/learner-dashboard" element={<LearnerDashboard />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/book-reader" element={<BookReaderPage />} />
          <Route path="/pdf-viewer" element={<PDFViewPage />} />
          <Route path="/reports-coming-soon" element={<ReportsComingSoon />} />
          <Route path="/prelogin" element={<Prelogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
