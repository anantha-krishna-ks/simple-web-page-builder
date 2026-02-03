import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SubjectCard from "@/components/SubjectCard";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Activity, Calculator, Eye, Video, FileIcon, Layers, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiBaseUrl } from '@/utils/config';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import scienceImg from "@/assets/science-subject.png";
import mathImg from "@/assets/mathematics-subject.png";
import englishImg from "@/assets/english-subject.png";
import hindiImg from "@/assets/hindi-subject.png";
import comingSoonImage from "@/assets/coming-soon.png";

const classes = [
  { id: "class-1", name: "Class 1" },
  { id: "class-2", name: "Class 2" },
  { id: "class-3", name: "Class 3" },
  { id: "class-4", name: "Class 4" },
];

const subjects = [
  { id: "english", title: "English", image: englishImg, color: "bg-green-500" },
  { id: "mathematics", title: "Mathematics", image: mathImg, color: "bg-purple-500" },
  { id: "science", title: "Science", image: scienceImg, color: "bg-blue-500" },
  { id: "hindi", title: "Hindi", image: hindiImg, color: "bg-orange-500" },
];

const assessmentClasses = [
  { id: "class-1", name: "Class 1" },
  { id: "class-2", name: "Class 2" },
  { id: "class-3", name: "Class 3" },
  { id: "class-4", name: "Class 4" },
];

const activities = [
  { id: 1, name: "Activity on Prepositions", type: "activity" },
  { id: 2, name: "Activity on Verbs", type: "activity" },
  { id: 3, name: "Activity on Adjectives", type: "activity" },
  { id: 4, name: "Activity on Nouns", type: "activity" },
  { id: 5, name: "Activity on Sentence Formation", type: "activity" },
  { id: 6, name: "Grammar Worksheet - Part A", type: "worksheet" },
  { id: 7, name: "Reading Comprehension Worksheet", type: "worksheet" },
  { id: 8, name: "Vocabulary Building Worksheet", type: "worksheet" },
  { id: 9, name: "Writing Practice Sheet", type: "worksheet" },
  { id: 10, name: "Spelling Assessment Worksheet", type: "worksheet" },
  { id: 11, name: "Phonics Worksheet - Level 1", type: "worksheet" },
  { id: 12, name: "Sentence Formation Worksheet", type: "worksheet" },
  { id: 13, name: "Grammar Rules Worksheet", type: "worksheet" },
  { id: 14, name: "Creative Writing Worksheet", type: "worksheet" },
  { id: 15, name: "Poetry Analysis Worksheet", type: "worksheet" },
  { id: 16, name: "Punctuation Practice Worksheet", type: "worksheet" },
  { id: 17, name: "Story Sequencing Worksheet", type: "worksheet" },
];

const chapters = [
  { id: "chapter-1", name: "Fun with Words" },
  { id: "chapter-2", name: "Jo Jo Laali (A jogula)" },
  { id: "chapter-3", name: "Kamala's First Day at School" },
  { id: "chapter-4", name: "Friends" },
  { id: "chapter-5", name: "A Little Clock" },
  { id: "chapter-6", name: "Let's Play Hide-and-Seek!" },
  { id: "chapter-7", name: "Healthy Habits" },
  { id: "chapter-8", name: "Four Seasons" },
];

const learningResources = [
  { id: 1, name: "Introduction to Alphabets", type: "video", icon: Video },
  { id: 2, name: "Grammar Basics PDF", type: "pdf", icon: FileIcon },
  { id: 3, name: "Phonics Interactive Exercise", type: "interactive", icon: Layers },
  { id: 4, name: "Reading Comprehension Video", type: "video", icon: Video },
  { id: 5, name: "Writing Practice Sheet", type: "pdf", icon: FileIcon },
  { id: 6, name: "Vocabulary Building Game", type: "interactive", icon: Layers },
  { id: 7, name: "Story Reading Session", type: "video", icon: Video },
  { id: 8, name: "Grammar Worksheets", type: "pdf", icon: FileIcon },
];

// Define resource interface
interface ChapterResource {
  resourceId: number;
  resourceName: string;
  resourceType: string;
  resourceUrl: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedClass, setSelectedClass] = useState("class-1");
  const [assessmentClass, setAssessmentClass] = useState("class-1");
  const [assessmentSubject, setAssessmentSubject] = useState("english");
  const [assessmentChapter, setAssessmentChapter] = useState("chapter-1");
  const [resourceClass, setResourceClass] = useState("class-1");
  const [resourceSubject, setResourceSubject] = useState("english");
  const [resourceChapter, setResourceChapter] = useState("chapter-1");
  const [lessonPlanClass, setLessonPlanClass] = useState("class-1");
  const [lessonPlanSubject, setLessonPlanSubject] = useState("english");
  const [lessonPlanChapter, setLessonPlanChapter] = useState("chapter-1");
  const [lessonPlanDialog, setLessonPlanDialog] = useState(false);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<{ subject: string; number: string } | null>(null);
  const [resourceSearch, setResourceSearch] = useState("");
  const [assessmentSearch, setAssessmentSearch] = useState("");
  const [lessonPlanSearch, setLessonPlanSearch] = useState("");
  const [assessmentFilter, setAssessmentFilter] = useState<"all" | "worksheet" | "activity">("all");
  const [chapterResources, setChapterResources] = useState<ChapterResource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "teacher") {
      navigate("/");
    }
  }, [navigate]);

  // Fetch chapter resources when component mounts or when learning resources is selected
  useEffect(() => {
    if (activeMenu === "learning-resources") {
      fetchCurrentChapterData();
    }
  }, [activeMenu]);

  const fetchCurrentChapterData = async () => {
    try {
      const userId = sessionStorage.getItem("userID");
      const planClassId = sessionStorage.getItem("planClassId") || "279";
      const token = sessionStorage.getItem("authToken");

      console.log("TeacherDashboard - Fetching current chapter data:", { userId, planClassId, hasToken: !!token });

      if (!userId || !token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      // First call the chapters API to get current chapter info
      const apiBaseUrl = await getApiBaseUrl();
      const chaptersResponse = await fetch(
        `${apiBaseUrl}/class-subjects/chapters?userId=${userId}&planClassId=${planClassId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!chaptersResponse.ok) {
        throw new Error("Failed to fetch chapter data");
      }

      const chaptersData = await chaptersResponse.json();
      console.log("TeacherDashboard - Chapters API Response:", chaptersData);

      // Get the chapters array
      let chaptersArray = [];
      if (Array.isArray(chaptersData)) {
        chaptersArray = chaptersData;
      } else if (chaptersData.chapters && Array.isArray(chaptersData.chapters)) {
        chaptersArray = chaptersData.chapters;
      }

      // Use the first chapter for TeacherDashboard (or implement logic to find current chapter)
      const currentChapter = chaptersArray[0];

      if (currentChapter && currentChapter.chapterID) {
        // Store the chapterID in session storage
        sessionStorage.setItem("chapterId", currentChapter.chapterID.toString());
        console.log("TeacherDashboard - Stored chapterID in session storage:", currentChapter.chapterID);
        
        // Now fetch resources with the correct chapterID
        fetchChapterResources();
      } else {
        console.error("TeacherDashboard - No valid chapter found in response");
        toast.error("No chapter data available");
        setChapterResources([]);
        setIsLoadingResources(false);
      }
    } catch (error) {
      console.error("TeacherDashboard - Error fetching chapter data:", error);
      toast.error("Failed to load chapter data. Please try again.");
      setChapterResources([]);
      setIsLoadingResources(false);
    }
  };

  // Fetch chapter resources when component mounts or when active menu changes
  useEffect(() => {
    if (activeMenu === "learning-resources" || activeMenu === "assessments" || activeMenu === "lesson-plans") {
      fetchChapterResources();
    }
  }, [activeMenu]);

  const fetchChapterResources = async () => {
    console.log("fetchChapterResources called - API should be triggered now");
    setIsLoadingResources(true);
    try {
      const userId = sessionStorage.getItem("userID");
      const planClassId = sessionStorage.getItem("planClassId") || "279";
      const chapterId = sessionStorage.getItem("chapterId") || "8557";
      const token = sessionStorage.getItem("authToken");

      console.log("API call parameters:", { userId, planClassId, chapterId, hasToken: !!token });

      if (!userId || !token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      // Determine type parameter based on active menu
      let typeParam = "1"; // Default to LR
      if (activeMenu === "assessments") {
        typeParam = "2";
      } else if (activeMenu === "lesson-plans") {
        typeParam = "3";
      }

      const responseApiBaseUrl = await getApiBaseUrl();
      const response = await fetch(
        `${responseApiBaseUrl}/class-subjects/chapter-resources?userId=${userId}&planClassId=${planClassId}&chapterId=${chapterId}&resourceType=${typeParam}&type=${typeParam}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chapter resources");
      }

      const data = await response.json();
      console.log("Chapter Resources API Response:", data);
      
      // Handle the response format - assuming it returns an array of resources
      if (Array.isArray(data)) {
        setChapterResources(data);
      } else if (data.resources && Array.isArray(data.resources)) {
        setChapterResources(data.resources);
      } else {
        setChapterResources([]);
      }
    } catch (error) {
      console.error("Error fetching chapter resources:", error);
      toast.error("Failed to load learning resources. Please try again.");
      setChapterResources([]);
    } finally {
      setIsLoadingResources(false);
    }
  };

  const handleResourceClick = (resource: ChapterResource) => {
    // Determine resource type from file extension if resourceType is empty
    let resourceType = resource.resourceType;
    if (!resourceType) {
      const extension = resource.resourceUrl.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'svg':
          resourceType = '1'; // Image
          break;
        case 'pdf':
          resourceType = '2'; // PDF
          break;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
        case 'flv':
          resourceType = '3'; // Video
          break;
        default:
          resourceType = '1'; // Default to image
      }
    }

    // Handle resource display based on resourceType
    switch (resourceType) {
      case '1': // Image
        // Open image in new tab or modal
        window.open(resource.resourceUrl, '_blank');
        break;
      case '2': // PDF
        // Navigate to PDF viewer
        window.open(`/pdf-viewer?path=${encodeURIComponent(resource.resourceUrl)}`, '_blank');
        break;
      case '3': // Video
        // Open video player
        window.open(resource.resourceUrl, '_blank');
        break;
      default:
        toast.error("Unknown resource type");
    }
  };

  const getResourceIcon = (resourceType: string) => {
    // If resourceType is empty, determine from file extension
    if (!resourceType) {
      return FileIcon; // Default icon
    }
    
    switch (resourceType) {
      case '1': // Image
        return FileIcon;
      case '2': // PDF
        return FileIcon;
      case '3': // Video
        return Video;
      default:
        return FileIcon;
    }
  };

  const getResourceTypeName = (resourceType: string) => {
    // If resourceType is empty, determine from file extension
    if (!resourceType) {
      return "Unknown";
    }
    
    switch (resourceType) {
      case '1': // Image
        return "Image";
      case '2': // PDF
        return "PDF";
      case '3': // Video
        return "Video";
      default:
        return "Unknown";
    }
  };

  const getResourceTypeFromUrl = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return '1'; // Image
      case 'pdf':
        return '2'; // PDF
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
        return '3'; // Video
      default:
        return '1'; // Default to image
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/chapters?subject=${subjectId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeMenu={activeMenu} 
          onMenuChange={setActiveMenu} 
          role="teacher" 
        />
        <main className="flex-1 overflow-y-auto">
          {activeMenu === "dashboard" && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-[1.6rem] font-semibold text-foreground mb-2">
                  Welcome Back, Teacher
                </h2>
                <p className="text-muted-foreground">
                  Select a class and subject to begin your teaching session
                </p>
              </div>

              <div className="mb-8 max-w-sm">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Subjects for {classes.find((c) => c.id === selectedClass)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {subjects.map((subject) => (
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

          {activeMenu === "learning-resources" && (
            <div className="p-4 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
                Learning Resources
              </h2>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Class
                  </label>
                  <Select value={resourceClass} onValueChange={setResourceClass}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Select value={resourceSubject} onValueChange={setResourceSubject}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Chapter
                  </label>
                  <Select value={resourceChapter} onValueChange={setResourceChapter}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search
                  </label>
                  <div className="search-container">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search resources..."
                      value={resourceSearch}
                      onChange={(e) => setResourceSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>

              {/* Count Widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Images</CardTitle>
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {chapterResources.filter(r => {
                        const resourceType = r.resourceType || getResourceTypeFromUrl(r.resourceUrl);
                        return resourceType === '1';
                      }).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Image resources</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">PDFs</CardTitle>
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {chapterResources.filter(r => {
                        const resourceType = r.resourceType || getResourceTypeFromUrl(r.resourceUrl);
                        return resourceType === '2';
                      }).length}
                    </div>
                    <p className="text-xs text-muted-foreground">PDF documents</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Videos</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {chapterResources.filter(r => {
                        const resourceType = r.resourceType || getResourceTypeFromUrl(r.resourceUrl);
                        return resourceType === '3';
                      }).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Video resources</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{chapterResources.length}</div>
                    <p className="text-xs text-muted-foreground">Total resources</p>
                  </CardContent>
                </Card>
              </div>

              {/* Resources List */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Resources</CardTitle>
                </CardHeader>
                 <CardContent>
                   {isLoadingResources ? (
                     <div className="flex items-center justify-center py-8">
                       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                       <span className="ml-2 text-muted-foreground">Loading resources...</span>
                     </div>
                   ) : chapterResources.length > 0 ? (
                     <div className="space-y-3">
                       {chapterResources
                         .filter((resource) =>
                           resource.resourceName.toLowerCase().includes(resourceSearch.toLowerCase())
                         )
                         .map((resource) => {
                         const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                         const Icon = getResourceIcon(resourceType);
                         return (
                           <div
                             key={resource.resourceId}
                             className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 border border-border shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
                           >
                             <div className="flex items-center gap-3">
                               <Icon className="h-5 w-5 text-primary" />
                               <div className="flex flex-col">
                                 <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                                   {resource.resourceName}
                                 </span>
                                 <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize mt-1 w-fit">
                                   {getResourceTypeName(resourceType)}
                                 </span>
                               </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="shadow-sm hover:shadow transition-shadow w-full sm:w-auto"
                              onClick={() => handleResourceClick(resource)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                        </div>
                      );
                    })}
                  </div>
                   ) : (
                     <div className="text-center py-8">
                       <p className="text-muted-foreground">
                         {resourceSearch ? "No resources found matching your search." : "No resources available for this chapter."}
                       </p>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="mt-4"
                         onClick={fetchChapterResources}
                       >
                         Refresh Resources
                       </Button>
                     </div>
                   )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeMenu === "reports" && (
            <div className="p-8 flex items-center justify-center min-h-[80vh]">
              <div className="max-w-2xl text-center">
                <img 
                  src={comingSoonImage} 
                  alt="Coming Soon - Reports feature launching soon" 
                  className="w-full h-auto mb-8 animate-fade-in"
                />
                <h2 className="text-3xl font-bold text-foreground mb-4">Reports Coming Soon</h2>
                <p className="text-muted-foreground text-lg">
                  We're working on powerful analytics and reporting features. Stay tuned for student performance insights and class analytics!
                </p>
              </div>
            </div>
          )}

          {activeMenu === "assessments" && (
            <div className="p-4 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
                Assessments
              </h2>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Class
                  </label>
                  <Select value={assessmentClass} onValueChange={setAssessmentClass}>
                    <SelectTrigger className="bg-white dark:bg-white text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-white">
                      {assessmentClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Select value={assessmentSubject} onValueChange={setAssessmentSubject}>
                    <SelectTrigger className="bg-white dark:bg-white text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-white">
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Chapter
                  </label>
                  <Select value={assessmentChapter} onValueChange={setAssessmentChapter}>
                    <SelectTrigger className="bg-white dark:bg-white text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-white">
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search
                  </label>
                  <div className="search-container">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search assessments..."
                      value={assessmentSearch}
                      onChange={(e) => setAssessmentSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>

              {/* Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg border-t-4",
                    assessmentFilter === "worksheet" 
                      ? "border-t-primary shadow-lg bg-primary/5" 
                      : "border-t-transparent hover:border-t-primary/30"
                  )}
                  onClick={() => setAssessmentFilter("worksheet")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Work Sheets</CardTitle>
                    <FileText className={cn(
                      "h-4 w-4 transition-colors",
                      assessmentFilter === "worksheet" ? "text-primary" : "text-muted-foreground"
                    )} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activities.filter(a => a.type === "worksheet").length}</div>
                    <p className="text-xs text-muted-foreground">
                      {assessmentFilter === "worksheet" ? "Showing worksheets" : "Click to filter"}
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg border-t-4",
                    assessmentFilter === "activity" 
                      ? "border-t-primary shadow-lg bg-primary/5" 
                      : "border-t-transparent hover:border-t-primary/30"
                  )}
                  onClick={() => setAssessmentFilter("activity")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Activities</CardTitle>
                    <Activity className={cn(
                      "h-4 w-4 transition-colors",
                      assessmentFilter === "activity" ? "text-primary" : "text-muted-foreground"
                    )} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activities.filter(a => a.type === "activity").length}</div>
                    <p className="text-xs text-muted-foreground">
                      {assessmentFilter === "activity" ? "Showing activities" : "Click to filter"}
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1 border-t-4",
                    assessmentFilter === "all" 
                      ? "border-t-primary shadow-lg bg-primary/5" 
                      : "border-t-transparent hover:border-t-primary/30"
                  )}
                  onClick={() => setAssessmentFilter("all")}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                    <Calculator className={cn(
                      "h-4 w-4 transition-colors",
                      assessmentFilter === "all" ? "text-primary" : "text-muted-foreground"
                    )} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activities.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {assessmentFilter === "all" ? "Showing all" : "Click to show all"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Activities List */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Activities</CardTitle>
                </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {activities
                       .filter((activity) => {
                         const matchesSearch = activity.name.toLowerCase().includes(assessmentSearch.toLowerCase());
                         const matchesFilter = assessmentFilter === "all" || activity.type === assessmentFilter;
                         return matchesSearch && matchesFilter;
                       })
                       .map((activity) => (
                       <div
                        key={activity.id}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 border border-border shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base">{activity.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                            {activity.type}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="shadow-sm hover:shadow transition-shadow w-full sm:w-auto">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeMenu === "lesson-plans" && (
            <div className="p-4 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
                Lesson Plans
              </h2>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Class
                  </label>
                  <Select value={lessonPlanClass} onValueChange={setLessonPlanClass}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Select value={lessonPlanSubject} onValueChange={setLessonPlanSubject}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-48">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Chapter
                  </label>
                  <Select value={lessonPlanChapter} onValueChange={setLessonPlanChapter}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search
                  </label>
                  <div className="search-container">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search lesson plans..."
                      value={lessonPlanSearch}
                      onChange={(e) => setLessonPlanSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
              </div>

              {/* Total Lesson Plans Widget */}
              <Card className="mb-6 md:mb-8 max-w-full sm:max-w-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Lesson Plans</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16</div>
                  <p className="text-xs text-muted-foreground">Available for {classes.find((c) => c.id === lessonPlanClass)?.name}</p>
                </CardContent>
              </Card>

              {/* Lesson Plans List */}
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Plans</CardTitle>
                </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {subjects
                       .filter((subject) => {
                         const lessonPlanName = `${subject.title} - Lesson Plan`;
                         return lessonPlanName.toLowerCase().includes(lessonPlanSearch.toLowerCase());
                       })
                       .map((subject) => (
                       <>
                         {[1, 2, 3, 4].map((num) => (
                          <div
                            key={`${subject.id}-${num}`}
                            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 border border-border shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
                          >
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                              {subject.title} - Lesson Plan 1.{num}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="shadow-sm hover:shadow transition-shadow w-full sm:w-auto"
                              onClick={() => {
                                setSelectedLessonPlan({ subject: subject.title, number: `1.${num}` });
                                setLessonPlanDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        ))}
                      </>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Lesson Plan Preview Dialog */}
      <Dialog open={lessonPlanDialog} onOpenChange={setLessonPlanDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedLessonPlan?.subject} - Lesson Plan {selectedLessonPlan?.number}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Objective</h3>
              <p className="text-muted-foreground">
                Students will be able to understand and apply key concepts related to {selectedLessonPlan?.subject}.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Duration</h3>
              <p className="text-muted-foreground">45 minutes</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Materials Needed</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Textbook</li>
                <li>Worksheets</li>
                <li>Whiteboard and markers</li>
                <li>Interactive activities</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Lesson Flow</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Introduction (10 minutes)</h4>
                  <p className="text-muted-foreground">
                    Begin with a warm-up activity to engage students and introduce the topic.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Main Activity (25 minutes)</h4>
                  <p className="text-muted-foreground">
                    Interactive lesson with examples, guided practice, and student participation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Conclusion (10 minutes)</h4>
                  <p className="text-muted-foreground">
                    Review key concepts, answer questions, and assign homework.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Assessment</h3>
              <p className="text-muted-foreground">
                Monitor student participation and understanding through questioning and observation.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
