import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SubjectCard from "@/components/SubjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Video, FileText, Layers, Download, Calendar, Clock, ArrowLeft, Search } from "lucide-react";
import scienceImg from "@/assets/science-subject.png";
import mathImg from "@/assets/mathematics-subject.png";
import englishImg from "@/assets/english-subject.png";
import hindiImg from "@/assets/hindi-subject.png";
import comingSoonImg from "@/assets/coming-soon.png";

const subjects = [
  { id: "english", title: "English", image: englishImg, color: "bg-green-500" },
  { id: "mathematics", title: "Mathematics", image: mathImg, color: "bg-purple-500" },
  { id: "science", title: "Science", image: scienceImg, color: "bg-blue-500" },
  { id: "hindi", title: "Hindi", image: hindiImg, color: "bg-orange-500" },
];

const studentClasses = [
  { value: "grade1", label: "Grade 1" },
  { value: "grade2", label: "Grade 2" },
  { value: "grade3", label: "Grade 3" },
  { value: "grade4", label: "Grade 4" },
];

const studentSubjects = [
  { value: "english", label: "English" },
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "hindi", label: "Hindi" },
];

const studentChapters = [
  { value: "chapter1", label: "Fun with Words" },
  { value: "chapter2", label: "Jo Jo Laali (A jogula)" },
  { value: "chapter3", label: "Kamala's First Day at School" },
  { value: "chapter4", label: "Friends" },
  { value: "chapter5", label: "A Little Clock" },
  { value: "chapter6", label: "Let's Play Hide-and-Seek!" },
  { value: "chapter7", label: "Healthy Habits" },
  { value: "chapter8", label: "Four Seasons" },
];

const studentResources = [
  { id: "1", name: "Introduction to Numbers", type: "video", icon: Video },
  { id: "2", name: "Basic Arithmetic Worksheet", type: "pdf", icon: FileText },
  { id: "3", name: "Math Games", type: "interactive", icon: Layers },
  { id: "4", name: "Science Experiments", type: "video", icon: Video },
  { id: "5", name: "English Grammar Guide", type: "pdf", icon: FileText },
  { id: "6", name: "Language Practice", type: "interactive", icon: Layers },
];

const studentActivities = [
  { 
    id: "1", 
    name: "Math Quiz - Addition & Subtraction", 
    type: "Worksheet",
    assignedDate: "2025-10-05T09:00:00",
    dueDate: "2025-10-12T23:59:00"
  },
  { 
    id: "2", 
    name: "Science Lab Activity", 
    type: "Activity",
    assignedDate: "2025-10-06T10:30:00",
    dueDate: "2025-10-13T17:00:00"
  },
  { 
    id: "3", 
    name: "English Comprehension Test", 
    type: "Worksheet",
    assignedDate: "2025-10-04T08:00:00",
    dueDate: "2025-10-11T23:59:00"
  },
  { 
    id: "4", 
    name: "Creative Writing Exercise", 
    type: "Activity",
    assignedDate: "2025-10-07T11:00:00",
    dueDate: "2025-10-14T18:00:00"
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [resourceClass, setResourceClass] = useState("grade1");
  const [resourceSubject, setResourceSubject] = useState("english");
  const [resourceChapter, setResourceChapter] = useState("chapter1");
  const [assessmentSubject, setAssessmentSubject] = useState("english");
  const [assessmentTypeFilter, setAssessmentTypeFilter] = useState<string>("all");
  const [assessmentSearch, setAssessmentSearch] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [isParentView, setIsParentView] = useState(false);
  const [isParentOnlyView, setIsParentOnlyView] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const urlParams = new URLSearchParams(window.location.search);
    const parentParam = urlParams.get("parent");
    const parentOnlyParam = urlParams.get("parentOnly");
    const viewParam = urlParams.get("view");
    
    if (parentParam === "true") {
      setIsParentView(true);
      if (parentOnlyParam === "true") {
        setIsParentOnlyView(true);
      }
      if (viewParam) {
        setActiveMenu(viewParam === "ebook" ? "dashboard" : viewParam);
        if (viewParam === "ebook") {
          // For ebook, we'll show the dashboard with subjects
        }
      }
    } else if (userRole !== "student") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    if (isParentView) {
      localStorage.removeItem("parentViewingWard");
      localStorage.removeItem("parentViewingResource");
      localStorage.removeItem("parentSelectedSubject");
      navigate("/parent-dashboard");
    } else {
      localStorage.removeItem("userRole");
      navigate("/");
    }
  };

  const handleBackToParent = () => {
    // Keep the ward selected, only remove the resource
    localStorage.removeItem("parentViewingResource");
    localStorage.removeItem("parentSelectedSubject");
    navigate("/parent-dashboard");
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/book-reader?subject=${subjectId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {!isParentOnlyView && <Header onLogout={handleLogout} role="student" />}

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {/* Parent Back Navigation */}
          {isParentOnlyView && (
            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToParent}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Parent Dashboard
              </Button>
            </div>
          )}
          {activeMenu === "dashboard" && (
            <div className="p-8">
              {!isParentOnlyView && (
                <div className="mb-8">
                  <h2 className="text-[1.6rem] font-semibold text-foreground mb-2">
                    Welcome Back, Student
                  </h2>
                  <p className="text-muted-foreground">
                    Select a subject to start learning
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Your Subjects
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Select a subject to know more
                    </p>
                  </div>
                  <div className="search-container max-w-xs">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search subjects..."
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {subjects
                    .filter((subject) =>
                      subject.title.toLowerCase().includes(subjectSearch.toLowerCase())
                    )
                    .map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        title={subject.title}
                        image={subject.image}
                        color={subject.color}
                        onClick={() => handleSubjectClick(subject.id)}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeMenu === "reports" && (
            <div className="p-8">
              <div className="flex flex-col items-center justify-center min-h-[70vh]">
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
            </div>
          )}

          {activeMenu === "assessments" && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Assessments
              </h2>

              {/* Filters and Search */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Select value={assessmentSubject} onValueChange={setAssessmentSubject}>
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 z-50">
                      {studentSubjects.map((subj) => (
                        <SelectItem key={subj.value} value={subj.value}>
                          {subj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search Assessments
                  </label>
                  <div className="search-container">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search by name..."
                      value={assessmentSearch}
                      onChange={(e) => setAssessmentSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>

              {/* Count Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">8</p>
                        <p className="text-sm text-muted-foreground">Worksheets</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Layers className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">5</p>
                        <p className="text-sm text-muted-foreground">Activities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activities List */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle>Assigned Assessments</CardTitle>
                    <div className="w-full sm:w-48">
                      <Select value={assessmentTypeFilter} onValueChange={setAssessmentTypeFilter}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 z-50">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Worksheet">Worksheets</SelectItem>
                          <SelectItem value="Activity">Activities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentActivities
                      .filter((activity) => 
                        (assessmentTypeFilter === "all" || activity.type === assessmentTypeFilter) &&
                        activity.name.toLowerCase().includes(assessmentSearch.toLowerCase())
                      )
                      .map((activity) => (
                      <div
                        key={activity.id}
                        className="group flex flex-col gap-4 p-4 md:p-5 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 border border-border shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base block">
                                {activity.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {activity.type}
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="shadow-sm hover:shadow transition-shadow w-full sm:w-auto"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 text-xs">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground font-medium">Assigned</span>
                              <span className="text-foreground font-semibold">
                                {new Date(activity.assignedDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })}
                              </span>
                              <Clock className="w-3 h-3 text-muted-foreground ml-1" />
                              <span className="text-muted-foreground">
                                {new Date(activity.assignedDate).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground font-medium">Due</span>
                              <span className="text-foreground font-semibold">
                                {new Date(activity.dueDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })}
                              </span>
                              <Clock className="w-3 h-3 text-muted-foreground ml-1" />
                              <span className="text-muted-foreground">
                                {new Date(activity.dueDate).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {studentActivities.filter((activity) => 
                      assessmentTypeFilter === "all" || activity.type === assessmentTypeFilter
                    ).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No assessments found for the selected type.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeMenu === "learning-resources" && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Learning Resources
              </h2>

              {/* Filters and Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Select value={resourceSubject} onValueChange={setResourceSubject}>
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 z-50">
                      {studentSubjects.map((subj) => (
                        <SelectItem key={subj.value} value={subj.value}>
                          {subj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Chapter
                  </label>
                  <Select value={resourceChapter} onValueChange={setResourceChapter}>
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 z-50">
                      {studentChapters.map((chap) => (
                        <SelectItem key={chap.value} value={chap.value}>
                          {chap.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search Resources
                  </label>
                  <div className="search-container">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search by resource name..."
                      value={resourceSearch}
                      onChange={(e) => setResourceSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>

              {/* Count Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">12</p>
                        <p className="text-sm text-muted-foreground">Videos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">8</p>
                        <p className="text-sm text-muted-foreground">PDFs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Layers className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">6</p>
                        <p className="text-sm text-muted-foreground">Interactivities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Layers className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">26</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resources List */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Resources</CardTitle>
                </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                   {studentResources
                     .filter((resource) =>
                       resource.name.toLowerCase().includes(resourceSearch.toLowerCase())
                     )
                     .map((resource) => {
                     const IconComponent = resource.icon;
                     return (
                       <div
                         key={resource.id}
                         className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 border border-border shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
                       >
                         <div className="flex items-center gap-3">
                           <IconComponent className="h-5 w-5 text-primary" />
                           <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                             {resource.name}
                           </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="shadow-sm hover:shadow transition-shadow w-full sm:w-auto"
                        >
                          Preview
                        </Button>
                      </div>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
