import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText, Video, BookOpen, ZoomIn, ZoomOut, Search, X, Maximize, BookMarked, GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ResourceViewer from "./ResourceViewer";

// Add CSS styles for comic book layout
const comicStyles = `
  .comic-content-wrapper {
    font-family: 'Comic Sans MS', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    padding: 40px !important;
    border-radius: 15px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
    margin: 20px 0 !important;
    min-height: 126vh !important;
    height: 126vh !important;
    width: 100% !important;
  }
  
  .comic-container {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 30px !important;
    max-width: 1000px !important;
    margin: 0 auto !important;
  }
  
  .comic-panel {
    background: white !important;
    border: 4px solid #2c3e50 !important;
    border-radius: 10px !important;
    padding: 20px !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
    position: relative !important;
    transition: transform 0.3s ease !important;
    min-height: 400px !important;
  }
  
  .comic-panel:hover {
    transform: scale(1.02) !important;
  }
  
  .comic-panel h2 {
    text-align: center !important;
    color: #2c3e50 !important;
    margin-bottom: 15px !important;
    font-size: 1.5em !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
    font-weight: bold !important;
  }
  
  .comic-image {
    text-align: center !important;
    margin: 15px 0 !important;
  }
  
  .comic-image img {
    max-width: 100% !important;
    height: auto !important;
    border: 3px solid #34495e !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
    min-height: 200px !important;
    object-fit: cover !important;
  }
  
  .comic-caption {
    background: #f39c12 !important;
    padding: 10px !important;
    border-radius: 5px !important;
    margin: 10px 0 !important;
    font-weight: bold !important;
    text-align: center !important;
    border: 2px solid #e67e22 !important;
    color: #2c3e50 !important;
  }
  
  .comic-speech-bubble {
    position: relative !important;
    background: #ecf0f1 !important;
    border: 2px solid #34495e !important;
    border-radius: 15px !important;
    padding: 15px !important;
    margin: 15px 0 !important;
    font-style: italic !important;
    color: #2c3e50 !important;
    font-size: 14px !important;
  }
  
  .comic-speech-bubble.left {
    margin-left: 20px !important;
  }
  
  .comic-speech-bubble.right {
    margin-right: 20px !important;
  }
  
  .comic-speech-bubble.left:before {
    content: '' !important;
    position: absolute !important;
    left: -15px !important;
    top: 20px !important;
    border-width: 10px 15px 10px 0 !important;
    border-style: solid !important;
    border-color: transparent #34495e transparent transparent !important;
  }
  
  .comic-speech-bubble.right:before {
    content: '' !important;
    position: absolute !important;
    right: -15px !important;
    top: 20px !important;
    border-width: 10px 0 10px 15px !important;
    border-style: solid !important;
    border-color: transparent transparent transparent #34495e !important;
  }
  
  .comic-speech-bubble.left:after {
    content: '' !important;
    position: absolute !important;
    left: -10px !important;
    top: 22px !important;
    border-width: 8px 12px 8px 0 !important;
    border-style: solid !important;
    border-color: transparent #ecf0f1 transparent transparent !important;
  }
  
  .comic-speech-bubble.right:after {
    content: '' !important;
    position: absolute !important;
    right: -10px !important;
    top: 22px !important;
    border-width: 8px 0 8px 12px !important;
    border-style: solid !important;
    border-color: transparent transparent transparent #ecf0f1 !important;
  }
  
  @media (min-width: 768px) {
    .comic-container {
      grid-template-columns: 1fr 1fr !important;
    }
  }
  
  @media (min-width: 1200px) {
    .comic-container {
      grid-template-columns: 1fr 1fr 1fr !important;
    }
  }
`;

interface BookReaderProps {
  subject: string;
  onClose: () => void;
  selectedChapter: string;
  ebookPath: string;
}

const mockPages = [
  {
    id: 1,
    title: "The Adventure Begins",
    content: `<div class="comic-container">
      <div class="comic-panel">
        <h2>Panel 1: The Discovery</h2>
        <div class="comic-image">
          <img src="https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Comic+Panel+1" alt="Discovery Scene" />
        </div>
        <div class="comic-caption">
          <p><strong>SARAH:</strong> "What's this strange light coming from the old library?"</p>
        </div>
        <div class="comic-speech-bubble left">
          <p>The mysterious glow grew stronger as Sarah approached the ancient books...</p>
        </div>
      </div>
      
      <div class="comic-panel">
        <h2>Panel 2: The Magical Book</h2>
        <div class="comic-image">
          <img src="https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Comic+Panel+2" alt="Magical Book" />
        </div>
        <div class="comic-caption">
          <p><strong>NARRATOR:</strong> "The book seemed to pulse with an otherworldly energy..."</p>
        </div>
        <div class="comic-speech-bubble right">
          <p>As she opened the cover, pages began to turn by themselves!</p>
        </div>
      </div>
      
      <div class="comic-panel">
        <h2>Panel 3: The Transformation</h2>
        <div class="comic-image">
          <img src="https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Comic+Panel+3" alt="Transformation" />
        </div>
        <div class="comic-caption">
          <p><strong>SARAH:</strong> "Whoa! Everything's changing around me!"</p>
        </div>
        <div class="comic-speech-bubble left">
          <p>The room transformed into a magical realm filled with wonder...</p>
        </div>
      </div>
    </div>`,
    annotations: [
      { id: 'a1', type: 'video', title: 'Comic Introduction', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', position: 280 },
      { id: 'a2', type: 'pdf', title: 'Comic Reference Guide', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', position: 520 },
      { id: 'a3', type: 'video', title: 'Drawing Tutorial', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', position: 780 },
    ],
    resources: [
      { id: 1, type: "video", title: "Comic Creation Video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: 2, type: "pdf", title: "Comic Art Guide", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    ],
  },
  {
    id: 2,
    title: "Core Concepts",
    content: `Let's explore the fundamental concepts of this subject. Understanding the core principles is essential for mastering this field.

The foundation of knowledge begins with understanding basic terminology and concepts. Each concept builds upon the previous one, creating a comprehensive framework for learning.

As we delve deeper into the subject matter, you'll discover how these concepts interconnect and support one another. This interconnected web of knowledge forms the basis of expertise in this domain.

Practice and application are key to truly grasping these concepts. Theory alone is insufficient; you must engage with the material actively to develop true understanding and competence.`,
    annotations: [
      { id: 'a4', type: 'pdf', title: 'Core Concepts Guide', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', position: 180 },
      { id: 'a5', type: 'video', title: 'Visual Learning Aid', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', position: 360 },
    ],
    resources: [
      { id: 3, type: "video", title: "Core Concepts Explained", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
  },
  {
    id: 3,
    title: "Advanced Topics",
    content: `Dive deeper into advanced topics and applications. This chapter explores sophisticated concepts that build upon your foundational knowledge.

Advanced learners will find these topics particularly engaging as they push the boundaries of conventional understanding. The complexity increases, but so does the reward of mastery.

Real-world applications of these advanced concepts demonstrate their practical value. You'll see how theory translates into practice in professional settings.

Critical thinking and analysis become paramount at this level. You're encouraged to question, explore, and develop your own insights as you progress through this material.`,
    annotations: [
      { id: 'a6', type: 'video', title: 'Advanced Tutorial', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', position: 200 },
      { id: 'a7', type: 'pdf', title: 'Advanced Reading Material', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', position: 450 },
      { id: 'a8', type: 'video', title: 'Case Study Examples', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', position: 650 },
    ],
    resources: [
      { id: 4, type: "pdf", title: "Advanced Reading", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    ],
  },
];

const classes = [
  { id: "6", name: "Class 6" },
  { id: "7", name: "Class 7" },
  { id: "8", name: "Class 8" },
  { id: "9", name: "Class 9" },
  { id: "10", name: "Class 10" },
];

const chapters = [
  { id: 1, name: "Fun with Words" },
  { id: 2, name: "Jo Jo Laali (A jogula)" },
  { id: 3, name: "Kamala's First Day at School" },
  { id: 4, name: "Friends" },
  { id: 5, name: "A Little Clock" },
  { id: 6, name: "Let's Play Hide-and-Seek!" },
  { id: 7, name: "Healthy Habits" },
  { id: 8, name: "Four Seasons" },
];

const mockWorksheets = [
  { id: 1, title: "Worksheet 1", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
  { id: 2, title: "Worksheet 2", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
  { id: 3, title: "Worksheet 1", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 2 },
  { id: 4, title: "Worksheet 2", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 2 },
  { id: 5, title: "Worksheet 1", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 3 },
];

const mockAnswerKeys = [
  { id: 1, title: "Answer Key 1", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
  { id: 2, title: "Answer Key 2", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
  { id: 3, title: "Answer Key 1", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 2 },
  { id: 4, title: "Answer Key 2", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 2 },
  { id: 5, title: "Answer Key 1", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 3 },
];

const mockLessonPlans = [
  { id: 1, title: "Week 1 Lesson Plan", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
  { id: 2, title: "Week 2 Lesson Plan", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
  { id: 3, title: "Week 3 Lesson Plan", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 2 },
  { id: 4, title: "Week 4 Lesson Plan", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 3 },
];

const mockAssessments = [
  { id: 1, title: "Chapter 1 Quiz", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
  { id: 2, title: "Chapter 2 Quiz", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 2 },
  { id: 3, title: "Chapter 3 Quiz", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 3 },
  { id: 4, title: "Mid-term Assessment", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", chapterId: 1 },
];

const BookReader = ({ subject, onClose, selectedChapter, ebookPath }: BookReaderProps) => {
  console.log('BookReader - ebookPath:', ebookPath);
  
  // Inject comic styles
  useEffect(() => {
    const styleId = 'comic-book-styles';
    
    // Remove existing style if present
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create and inject new style
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = comicStyles;
    document.head.appendChild(styleElement);
    
    console.log('Comic styles injected successfully');
    
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);
  
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showResources, setShowResources] = useState(false);
  const [showAssessments, setShowAssessments] = useState(false);
  const [showLessonPlans, setShowLessonPlans] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("6");
  const [filterType, setFilterType] = useState<string>("all");
  const [worksheetSearch, setWorksheetSearch] = useState("");
  const [answerKeySearch, setAnswerKeySearch] = useState("");
  const [lessonPlanSearch, setLessonPlanSearch] = useState("");
  const [showEbookIframe, setShowEbookIframe] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [assessmentSearch, setAssessmentSearch] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isResourceFloaterOpen, setIsResourceFloaterOpen] = useState(false);


  // Get the page data, using modulo to cycle through mock pages safely
  const pageIndex = 0; // Simplified since we're not using pages anymore
  const page = mockPages[pageIndex] || mockPages[0];

  // Filter resources based on selected chapter
  const filteredResources = selectedChapter === "all" 
    ? (page?.resources || [])
    : (page?.resources || []).filter(r => r.id === parseInt(selectedChapter));

  // Filter lesson plans based on selected chapter
  const filteredLessonPlans = selectedChapter === "all"
    ? mockLessonPlans
    : mockLessonPlans.filter(plan => plan.chapterId === parseInt(selectedChapter));

  // Filter assessments based on selected chapter
  const filteredAssessments = selectedChapter === "all"
    ? mockAssessments
    : mockAssessments.filter(assessment => assessment.chapterId === parseInt(selectedChapter));

  // Function to render content with annotations
  const renderContentWithAnnotations = () => {
    const content = page.content;
    const annotations = page.annotations || [];
    
    console.log('Rendering content:', content.substring(0, 100) + '...');
    
    // Check if content contains HTML (for comic book layout)
    if (content.includes('<div class="comic-container">')) {
      console.log('Detected comic content, rendering with HTML');
      return (
        <div 
          className="comic-content-wrapper"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    
    if (annotations.length === 0) {
      return <div className="text-foreground leading-relaxed whitespace-pre-line text-justify">{content}</div>;
    }

    // Sort annotations by position
    const sortedAnnotations = [...annotations].sort((a, b) => a.position - b.position);
    
    const parts = [];
    let lastIndex = 0;

    sortedAnnotations.forEach((annotation, idx) => {
      // Add text before annotation
      parts.push(
        <span key={`text-${idx}`}>
          {content.substring(lastIndex, annotation.position)}
        </span>
      );

      // Add annotation icon
      parts.push(
        <button
          key={`annotation-${annotation.id}`}
          onClick={() => setSelectedResource(annotation)}
          className="inline-flex items-center justify-center w-6 h-6 mx-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors group relative"
          title={annotation.title}
        >
          {annotation.type === 'video' ? (
            <Video className="w-3.5 h-3.5 text-primary" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-secondary" />
          )}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
            {annotation.title}
          </span>
        </button>
      );

      lastIndex = annotation.position;
    });

    // Add remaining text
    parts.push(
      <span key="text-end">
        {content.substring(lastIndex)}
      </span>
    );

    return <div className="text-foreground leading-relaxed text-justify">{parts}</div>;
  };

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Body */}
      <div className="flex-1 flex overflow-visible">
        {/* Main Content - PDF View */}
        <div className="flex-1 flex flex-col overflow-visible bg-muted/30 relative">
          <div className="flex-1 flex flex-col items-start justify-start p-2 sm:p-4 overflow-visible min-h-[800px]">
            {/* PDF Document Container */}
            <div className="bg-card shadow-2xl rounded-lg border border-border w-full flex-1 flex items-start justify-start overflow-visible relative min-h-[800px]">
              {/* Fullscreen Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(true)}
                className="absolute top-2 right-2 z-10 bg-card/80 backdrop-blur-sm hover:bg-accent"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </Button>
              
              {/* Floating Resources Button */}
              <Popover open={isResourceFloaterOpen} onOpenChange={setIsResourceFloaterOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="lg"
                  className="fixed bottom-20 right-4 z-10 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
                  title="Teacher Tools"
                >
                  <GraduationCap className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
                <PopoverContent 
                  className="w-72 p-4 bg-card border-2 border-primary/20 shadow-xl" 
                  align="end"
                  side="left"
                  sideOffset={10}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-base text-foreground">Teacher Tools</h3>
                    </div>
                    
                    <Button
                      variant={showResources ? "default" : "outline"}
                      className="w-full justify-start gap-3 h-12 text-sm font-medium"
                      onClick={() => {
                        setShowResources(!showResources);
                        setShowAssessments(false);
                        setShowLessonPlans(false);
                        setIsResourceFloaterOpen(false);
                      }}
                    >
                      <Video className="w-5 h-5" />
                      <div className="text-left">
                        <div>Learning Resources</div>
                        <div className="text-xs opacity-70 font-normal">Videos & Materials</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant={showAssessments ? "default" : "outline"}
                      className="w-full justify-start gap-3 h-12 text-sm font-medium"
                      onClick={() => {
                        setShowAssessments(!showAssessments);
                        setShowResources(false);
                        setShowLessonPlans(false);
                        setIsResourceFloaterOpen(false);
                      }}
                    >
                      <FileText className="w-5 h-5" />
                      <div className="text-left">
                        <div>Assessments</div>
                        <div className="text-xs opacity-70 font-normal">Quizzes & Tests</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant={showLessonPlans ? "default" : "outline"}
                      className="w-full justify-start gap-3 h-12 text-sm font-medium"
                      onClick={() => {
                        setShowLessonPlans(!showLessonPlans);
                        setShowResources(false);
                        setShowAssessments(false);
                        setIsResourceFloaterOpen(false);
                      }}
                    >
                      <BookMarked className="w-5 h-5" />
                      <div className="text-left">
                        <div>Lesson Plan</div>
                        <div className="text-xs opacity-70 font-normal">Teaching Guide</div>
                      </div>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
          

              {/* Ebook Iframe */}
              {showEbookIframe && ebookPath && (
                <div className="absolute inset-2 bg-background rounded-lg border border-border shadow-2xl z-20">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-3 border-b border-border bg-gray-50">
                      <h3 className="font-semibold text-foreground">Ebook Viewer</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(ebookPath, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open in New Tab
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowEbookIframe(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 p-2 bg-white">
                      <iframe
                        src={ebookPath}
                        className="w-full h-full border-0 rounded"
                        title="Ebook Content"
                        onError={(e) => {
                          console.error('Failed to load overlay ebook:', ebookPath);
                        }}
                        onLoad={() => {
                          console.log('Overlay ebook loaded successfully:', ebookPath);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Ebook Viewer - Centered and Fitted */}
              <div className="w-full h-[80%] flex flex-col overflow-hidden p-2">
                <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">                     
                  {/* Enhanced PDF Viewer */}
                  <div className="flex-1 w-full p-2 bg-gray-50">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 h-full flex flex-col">
                      {/* PDF Content Area */}
                      <div className="flex-1 p-4 bg-white overflow-auto">
                        <div className="max-w-4xl mx-auto">
                          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2">
                            <iframe
                              src={`${ebookPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=${currentPage}`}
                              className="w-full border-0"
                              style={{ height: '150vh', minHeight: '600px' }}
                              title="PDF Viewer"
                              key={currentPage}
                              onError={(event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
                                console.error('Failed to load PDF page:', ebookPath);
                                const parent = event.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="text-center p-12 bg-red-50 rounded-lg">
                                      <div class="text-red-600 text-lg mb-4">Failed to load PDF Page ${currentPage}</div>
                                      <div class="text-gray-600 mb-4">Please check if the PDF is accessible</div>
                                      <a href="${ebookPath}" target="_blank" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Open PDF in New Tab</a>
                                    </div>
                                  `;
                                }
                              }}
                              onLoad={(event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
                                console.log(`PDF page ${currentPage} loaded successfully`);
                                setTotalPages(50);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Navigation Bar */}
                      <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage <= 1}
                          className="flex items-center gap-2 px-3 py-2 text-sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-base font-semibold text-gray-700">
                            Page {currentPage}
                          </span>
                          <span className="text-gray-500 text-sm">of {totalPages}</span>
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage >= totalPages}
                          className="flex items-center gap-2 px-3 py-2 text-sm"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>

        {/* Right Panel - Learning Resources */}
        {showResources && (
          <div className="fixed md:relative inset-0 md:inset-auto z-40 md:z-0 w-full md:w-96 bg-card md:border-l border-border overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Resources</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowResources(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-foreground mb-3">Filter by Type</h4>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full border-2 border-primary bg-background hover:bg-muted transition-colors">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="pdf">PDFs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {page?.resources
                    ?.filter((resource: any) => 
                      filterType === "all" || resource.type === filterType
                    )
                    .map((resource: any) => (
                      <div
                        key={resource.id}
                        onClick={() => setSelectedResource(resource)}
                        className="p-4 rounded-lg border border-border bg-card hover:bg-muted cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          {resource.type === "video" ? (
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Video className="w-5 h-5 text-primary" />
                            </div>
                          ) : (
                            <div className="p-2 bg-secondary/10 rounded-lg">
                              <FileText className="w-5 h-5 text-secondary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground mb-1">
                              {resource.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click to preview
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel - Assessments */}
        {showAssessments && (
          <div className="fixed md:relative inset-0 md:inset-auto z-40 md:z-0 w-full md:w-96 bg-card md:border-l border-border overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Assessments</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAssessments(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>


              <Tabs defaultValue="worksheets" className="mt-6">
                <TabsList className="grid w-full grid-cols-2 h-auto">
                  <TabsTrigger value="worksheets" className="text-xs sm:text-sm">Worksheets</TabsTrigger>
                  <TabsTrigger value="answer-keys" className="text-xs sm:text-sm">Answer Keys</TabsTrigger>
                </TabsList>

                <TabsContent value="worksheets" className="mt-4">
                  <div className="search-container mb-4">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search worksheets..."
                      value={worksheetSearch}
                      onChange={(e) => setWorksheetSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="space-y-2">
                    {mockWorksheets
                      .filter((w) => w.title.toLowerCase().includes(worksheetSearch.toLowerCase()))
                      .map((worksheet) => {
                        const chapter = chapters.find(ch => ch.id === worksheet.chapterId);
                        return (
                          <div
                            key={worksheet.id}
                            onClick={() =>
                              setSelectedResource({ ...worksheet, type: "pdf" })
                            }
                            className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <p className="text-sm text-foreground font-medium">
                                  {worksheet.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Ch{chapter?.id}: {chapter?.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="answer-keys" className="mt-4">
                  <div className="search-container mb-4">
                    <Search className="search-icon w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search answer keys..."
                      value={answerKeySearch}
                      onChange={(e) => setAnswerKeySearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="space-y-2">
                    {mockAnswerKeys
                      .filter((a) => a.title.toLowerCase().includes(answerKeySearch.toLowerCase()))
                      .map((answerKey) => {
                        const chapter = chapters.find(ch => ch.id === answerKey.chapterId);
                        return (
                          <div
                            key={answerKey.id}
                            onClick={() =>
                              setSelectedResource({ ...answerKey, type: "pdf" })
                            }
                            className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-secondary" />
                              <div className="flex-1">
                                <p className="text-sm text-foreground font-medium">
                                  {answerKey.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Ch{chapter?.id}: {chapter?.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Right Panel - Lesson Plans */}
        {showLessonPlans && (
          <div className="fixed md:relative inset-0 md:inset-auto z-40 md:z-0 w-full md:w-96 bg-card md:border-l border-border overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Lesson Plans</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLessonPlans(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="search-container mb-4">
                <Search className="search-icon w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search lesson plans..."
                  value={lessonPlanSearch}
                  onChange={(e) => setLessonPlanSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="space-y-2">
                {filteredLessonPlans
                  .filter((plan) => plan.title.toLowerCase().includes(lessonPlanSearch.toLowerCase()))
                  .map((plan) => {
                    const chapter = chapters.find(ch => ch.id === plan.chapterId);
                    return (
                      <div
                        key={plan.id}
                        onClick={() =>
                          setSelectedResource({ ...plan, type: "pdf" })
                        }
                        className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm text-foreground font-medium">
                              {plan.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ch{chapter?.id}: {chapter?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <ResourceViewer
              resource={selectedResource}
              onClose={() => setSelectedResource(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;
