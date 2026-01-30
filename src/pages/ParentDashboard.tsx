import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, FileText, Layers, BarChart3, User, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock wards data
const wards = [
  { id: "1", name: "Rahul Kumar", class: "Grade 3", section: "A" },
  { id: "2", name: "Priya Kumar", class: "Grade 1", section: "B" },
];

// Resource tiles that link to student views
const resourceTiles = [
  { 
    id: "ebook", 
    label: "eBook", 
    icon: BookOpen, 
    color: "bg-gradient-to-br from-blue-500/10 to-blue-600/15 hover:from-blue-500/20 hover:to-blue-600/25 border-blue-500/30",
    iconColor: "text-blue-600"
  },
  { 
    id: "learning-resources", 
    label: "Learning Resources", 
    icon: Layers, 
    color: "bg-gradient-to-br from-green-500/10 to-green-600/15 hover:from-green-500/20 hover:to-green-600/25 border-green-500/30",
    iconColor: "text-green-600"
  },
  { 
    id: "assessments", 
    label: "Assessments", 
    icon: FileText, 
    color: "bg-gradient-to-br from-purple-500/10 to-purple-600/15 hover:from-purple-500/20 hover:to-purple-600/25 border-purple-500/30",
    iconColor: "text-purple-600"
  },
  { 
    id: "reports", 
    label: "Reports", 
    icon: BarChart3, 
    color: "bg-gradient-to-br from-orange-500/10 to-orange-600/15 hover:from-orange-500/20 hover:to-orange-600/25 border-orange-500/30",
    iconColor: "text-orange-600"
  },
];

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("english");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "parent") {
      navigate("/parent-login");
    }
    
    // Restore ward selection if coming back from resource view
    const storedWard = localStorage.getItem("parentViewingWard");
    if (storedWard) {
      const ward = JSON.parse(storedWard);
      setSelectedWard(ward.id);
    }
    
    // Restore subject selection if available
    const storedSubject = localStorage.getItem("parentSelectedSubject");
    if (storedSubject) {
      setSelectedSubject(storedSubject);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleResourceClick = (resourceId: string) => {
    // Store selected ward info for the student dashboard
    const ward = wards.find(w => w.id === selectedWard);
    if (ward) {
      localStorage.setItem("parentViewingWard", JSON.stringify(ward));
      localStorage.setItem("parentViewingResource", resourceId);
      localStorage.setItem("parentSelectedSubject", selectedSubject);
    }
    
    // Navigate to book reader page instead of student dashboard
    if (resourceId === "ebook") {
      navigate(`/book-reader?subject=${selectedSubject}`);
    } else {
      // Navigate to student dashboard with the resource pre-selected in parent-only mode
      navigate(`/student-dashboard?view=${resourceId}&parent=true&parentOnly=true`);
    }
  };

  const handleBackToWards = () => {
    setSelectedWard(null);
    localStorage.removeItem("parentViewingWard");
    localStorage.removeItem("parentViewingResource");
  };

  return (
    <div className="parent-dashboard-bg">
      <header className="parent-header">
        <div className="parent-header-container">
          <div className="parent-header-brand">
            <div className="parent-header-icon-wrapper">
              <User className="parent-header-icon" />
            </div>
            <div>
              <h1 className="parent-header-title">Parent Portal</h1>
              <p className="parent-header-subtitle">Monitor your ward's progress</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="parent-dashboard-main">
        {!selectedWard ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="parent-section-header">
              <h2 className="parent-section-title">Select Your Ward</h2>
              <p className="parent-section-description">
                Choose a student to view their academic information
              </p>
            </div>

            <div className="wards-grid">
              {wards.map((ward) => (
                <Card key={ward.id} className="ward-card" onClick={() => setSelectedWard(ward.id)}>
                  <CardContent className="ward-card-content">
                    <div className="ward-card-header">
                      <div className="ward-card-icon-wrapper">
                        <User className="ward-card-icon" />
                      </div>
                      <div className="ward-card-info">
                        <h3 className="ward-card-name">{ward.name}</h3>
                        <div className="ward-card-details">
                          <span className="ward-card-detail">{ward.class}</span>
                          <span className="ward-card-separator">•</span>
                          <span className="ward-card-detail">Section {ward.section}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ward-card-footer">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWard(ward.id);
                        }}
                      >
                        View Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="parent-back-button-wrapper">
              <Button variant="outline" size="sm" onClick={handleBackToWards} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Wards
              </Button>
            </div>

            <div className="text-center space-y-6">
              <Card className="ward-info-card">
                <CardContent className="ward-info-card-content">
                  <div className="ward-info-header">
                    <div className="ward-info-icon-wrapper">
                      <User className="ward-info-icon" />
                    </div>
                    <div>
                      <h2 className="ward-info-name">
                        {wards.find((w) => w.id === selectedWard)?.name}
                      </h2>
                      <div className="ward-info-details">
                        <span className="ward-info-detail">
                          {wards.find((w) => w.id === selectedWard)?.class}
                        </span>
                        <span className="ward-card-separator">•</span>
                        <span className="ward-info-detail">
                          Section {wards.find((w) => w.id === selectedWard)?.section}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ward-info-divider">
                    <div className="ward-info-subject-selector">
                      <label className="ward-info-subject-label">Subject:</label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="parent-subject-selector-wrapper">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="parent-resource-header">
              <p className="parent-resource-title">Select a Resource</p>
              <p className="parent-resource-description">
                Access your ward's learning materials and progress
              </p>
            </div>

            <div className="resources-tiles-grid">
              {resourceTiles.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card
                    key={resource.id}
                    className={cn("resource-tile-card", resource.color)}
                    onClick={() => handleResourceClick(resource.id)}
                  >
                    <CardContent className="resource-tile-content">
                      <div className="resource-tile-icon-wrapper">
                        <Icon className={cn("resource-tile-icon", resource.iconColor)} />
                      </div>
                      <h3 className="resource-tile-title">{resource.label}</h3>
                      <p className="resource-tile-description">
                        {resource.id === "ebook" && "Browse and read digital textbooks"}
                        {resource.id === "learning-resources" && "Access study materials and resources"}
                        {resource.id === "assessments" && "View assigned tests and worksheets"}
                        {resource.id === "reports" && "Track academic performance and progress"}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
