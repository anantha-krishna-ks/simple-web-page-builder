import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, FileText, Video, BookOpen, ZoomIn, ZoomOut, Search, X, Maximize, BookMarked, GraduationCap, ExternalLink, Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import Header from "./Header";
import ResourceViewer from "./ResourceViewer";
import PDFViewer from "./PDFViewer";
import { getApiBaseUrl } from '@/utils/config';
import { useNavigate, useLocation } from 'react-router-dom';

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
  onFullscreenChange?: (isFullscreen: boolean) => void;
  selectedChapter: string;
  ebookPath: string;
  userRole?: string;
  combinedSelection?: string;
  onCombinedChange?: (value: string) => void;
  combinedOptions?: any[];
  chapterSelection?: string;
  onChapterChange?: (value: string) => void;
  chapterOptions?: any[];
  isFullscreen?: boolean;
  isHeaderVisible?: boolean;
  // Teacher Tools props
  showResources?: boolean;
  showAssessments?: boolean;
  showLessonPlans?: boolean;
  isResourceFloaterOpen?: boolean;
  onToggleResources?: () => void;
  onToggleAssessments?: () => void;
  onToggleLessonPlans?: () => void;
  onToggleResourceFloater?: () => void;
  onSetSelectedType?: (type: string) => void;
  selectedType?: string;
  resetResourceType?: boolean;
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

const BookReader = ({ 
  subject, 
  onClose, 
  selectedChapter, 
  ebookPath, 
  userRole,
  onFullscreenChange,
  combinedSelection,
  onCombinedChange,
  combinedOptions,
  chapterSelection,
  onChapterChange,
  chapterOptions,
  isFullscreen = false,
  isHeaderVisible = true,
  // Teacher Tools props
  showResources = false,
  showAssessments = false,
  showLessonPlans = false,
  isResourceFloaterOpen = false,
  onToggleResources,
  onToggleAssessments,
  onToggleLessonPlans,
  onToggleResourceFloater,
  onSetSelectedType,
  selectedType = "1",
  resetResourceType = false
}: BookReaderProps) => {
  console.log('BookReader - ebookPath:', ebookPath);
  
  // Reset internal resource type when trigger changes
  useEffect(() => {
    console.log("BookReader: resetResourceType changed to:", resetResourceType);
    if (resetResourceType) {
      console.log("BookReader: Resetting selectedResourceType to All, but keeping selectedType as:", selectedType);
      setSelectedResourceType("0"); // Keep filter at "All"
    }
  }, [resetResourceType]);

  // Handle custom refetch event from parent
  useEffect(() => {
const handleRefetchResources = (event: CustomEvent) => {
  console.log("BookReader: Received refetchResources event:", event.detail);
  if (event.detail && event.detail.chapterId) {
    const chapterId = event.detail.chapterId;
    console.log("BookReader: Updating resources for chapter:", chapterId);
    
    // Get the actual chapterID from the chapter data using the dropdown value
    const chaptersData = sessionStorage.getItem("chaptersForReader");
    let actualChapterId = chapterId; // fallback to dropdown value
    
    if (chaptersData) {
      try {
        const chapters = JSON.parse(chaptersData);
        console.log("BookReader: Looking for chapter with dropdown value:", chapterId);
        console.log("BookReader: Chapters data structure:", chapters);
        console.log("BookReader: Available chapters:", chapters.map((ch: any) => ({
          customID: ch.customID,
          chapterID: ch.chapterID,
          id: ch.id,
          chapterName: ch.chapterName,
          // Show all possible ID fields for debugging
          allFields: Object.keys(ch)
        })));
        
        // Convert dropdown value to array index (dropdown is 1-based, array is 0-based)
        const chapterIndex = parseInt(chapterId) - 1;
        const chapter = chapters[chapterIndex];
        
        if (chapter && chapter.chapterID) {
          actualChapterId = chapter.chapterID.toString();
          console.log("BookReader: Found actual chapterID:", actualChapterId, "for dropdown value:", chapterId, "chapter:", chapter.chapterName, "at index:", chapterIndex);
        } else {
          console.log("BookReader: Chapter not found for dropdown value:", chapterId, "at index:", chapterIndex);
          console.log("BookReader: Available chapters count:", chapters.length);
          console.log("BookReader: First few chapters:", chapters.slice(0, 5).map((ch: any, idx: number) => ({
            index: idx,
            customID: ch.customID,
            chapterID: ch.chapterID,
            chapterName: ch.chapterName
          })));
        }
      } catch (error) {
        console.error("BookReader: Error parsing chapters data:", error);
      }
    } else {
      console.log("BookReader: No chapters data found in session storage");
    }
    
    // Update the current chapter ID in state
    setCurrentChapterId(actualChapterId);
    
    // Store the actual chapterID in session storage
    sessionStorage.setItem('chapterId', actualChapterId);
    
    // Fetch resources for this specific chapter using the actual chapterID
    fetchChapterResources(actualChapterId);
  }
};

    window.addEventListener('refetchResources', handleRefetchResources as EventListener);
    
    return () => {
      window.removeEventListener('refetchResources', handleRefetchResources as EventListener);
    };
  }, []);

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
  const [selectedResourceType, setSelectedResourceType] = useState<string>(() => {
    return sessionStorage.getItem('selectedResourceType') || '0'; // Default to '0' (All)
  });
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  // const [selectedClass, setSelectedClass] = useState<string>("6");
    const [worksheetSearch, setWorksheetSearch] = useState("");
  const [answerKeySearch, setAnswerKeySearch] = useState("");
  const [lessonPlanSearch, setLessonPlanSearch] = useState("");
  const [showEbookIframe, setShowEbookIframe] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [assessmentSearch, setAssessmentSearch] = useState("");
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [chapterResources, setChapterResources] = useState<any[]>([]);
  const [currentPageBeforeFullscreen, setCurrentPageBeforeFullscreen] = useState(1);
  const [fullscreenEbookPath, setFullscreenEbookPath] = useState('');
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlChapterId = urlParams.get('chapterId');
  const storedChapterId = sessionStorage.getItem('chapterId');
  const initialChapterId = urlChapterId || storedChapterId;
  
  if (initialChapterId) {
    console.log("Setting initial chapter ID:", initialChapterId);
    setCurrentChapterId(initialChapterId);
    // Fetch resources for the initial chapter
    fetchChapterResources(initialChapterId);
  }
}, []);
useEffect(() => {
  const handleBackButton = (event: PopStateEvent) => {
    // Prevent default back navigation
    event.preventDefault();
    
    // Show loading state
    setIsNavigatingBack(true);
    
    // Simulate a delay (you can adjust this as needed)
    const timer = setTimeout(() => {
      setIsNavigatingBack(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  };

  // Add a new entry to the history stack
  window.history.pushState(null, '', window.location.href);
  
  // Add event listener
  window.addEventListener('popstate', handleBackButton);

  // Clean up
  return () => {
    window.removeEventListener('popstate', handleBackButton);
  };
}, []);
// Add this state initialization with other state declarations
const [internalSelectedType, setInternalSelectedType] = useState<string>(() => {
  return selectedType || sessionStorage.getItem('selectedAssessmentType') || '1';
});

// Add this effect with other effects, after the state declarations
useEffect(() => {
  if (selectedType && selectedType !== internalSelectedType) {
    setInternalSelectedType(selectedType);
  }
}, [selectedType]);
  // Helper function to get dynamic fallback path
  const getDynamicFallbackPath = (): string => {
    // Only try to get ebookPath from session storage
    const storedEbookPath = sessionStorage.getItem("currentEbookPath");
    if (storedEbookPath) {
      console.log("Using ebookPath from session storage:", storedEbookPath);
      return storedEbookPath;
    }
    
    // If no stored ebookPath, return empty string
    console.log("No ebookPath found in session storage");
    return "";
  };

  // Helper function to get the correct PDF path (prioritize ebookPath from server)
  const getPdfPath = (): string => {
    // If ebookPath prop is valid server URL, use it (this allows chapter changes in fullscreen)
    if (ebookPath && (ebookPath.startsWith('http') || ebookPath.startsWith('/'))) {
      console.log("Using ebookPath from props:", ebookPath);
      // Update fullscreen ebookPath when chapter changes in fullscreen
      if (isFullscreen && ebookPath !== fullscreenEbookPath) {
        setFullscreenEbookPath(ebookPath);
        console.log("Updated fullscreen ebookPath to new chapter:", ebookPath);
      }
      return ebookPath;
    }
    
    // If in fullscreen mode and no valid ebookPath prop, use the stored ebookPath
    if (isFullscreen && fullscreenEbookPath) {
      console.log("Using stored ebookPath for fullscreen:", fullscreenEbookPath);
      return fullscreenEbookPath;
    }
    
    // Otherwise, use dynamic fallback (which tries session storage first)
    const fallbackPath = getDynamicFallbackPath();
    console.log("Using fallback path:", fallbackPath);
    return fallbackPath;
  };
  
  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    
    if (!isFullscreen) {
      // Store current page and ebookPath before entering fullscreen
      setCurrentPageBeforeFullscreen(currentPage);
      setFullscreenEbookPath(getPdfPath());
      console.log("Storing current page before fullscreen:", currentPage);
      console.log("Storing current ebookPath before fullscreen:", getPdfPath());
    } else {
      // When exiting fullscreen, keep the current page (don't restore the old page)
      console.log("Exiting fullscreen, keeping current page:", currentPage);
      // Clear the stored ebookPath after a delay to allow effects to skip properly
      setTimeout(() => {
        setFullscreenEbookPath('');
        console.log("Cleared fullscreenEbookPath after delay");
      }, 1000);
    }
    
    setInternalIsFullscreen(newFullscreenState);
    console.log("BookReader: toggleFullscreen - changing state from", isFullscreen, "to", newFullscreenState);
    
    if (onFullscreenChange) {
      console.log("BookReader: Calling onFullscreenChange with:", newFullscreenState);
      onFullscreenChange(newFullscreenState);
    }
  };

  // Handle page changes from PDFViewer
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update stored page when in fullscreen to preserve current page when exiting
    if (internalIsFullscreen) {
      setCurrentPageBeforeFullscreen(page);
      console.log("Updated current page in fullscreen:", page);
    }
  };

  // Add ESC key listener to exit fullscreen
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && internalIsFullscreen) {
        console.log("ESC key pressed, exiting fullscreen");
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [internalIsFullscreen]);

  // Fetch chapter resources when showResources becomes true
  useEffect(() => {
    if (showResources) {
      sessionStorage.setItem('selectedAssessmentType', '1'); // Learning Resources
      fetchCurrentChapterData();
    }
  }, [showResources]);

  // Update type when showAssessments becomes true
  useEffect(() => {
    if (showAssessments) {
      sessionStorage.setItem('selectedAssessmentType', '2'); // Assessments
      fetchCurrentChapterData();
    }
  }, [showAssessments]);

  // Update type when showLessonPlans becomes true
  useEffect(() => {
    if (showLessonPlans) {
      sessionStorage.setItem('selectedAssessmentType', '3'); // Lesson Plans
      fetchCurrentChapterData();
    }
  }, [showLessonPlans]);

  const fetchCurrentChapterData = async () => {
    try {
      // Get the latest values right before making the API call
      const userId = sessionStorage.getItem("userID");
      const planClassId = sessionStorage.getItem("planClassId");
      const token = sessionStorage.getItem("authToken");
      // Use let to allow updating the chapterId if needed
      let currentChapterId = sessionStorage.getItem("chapterId");

      console.log("Fetching current chapter data:", { 
        userId, 
        planClassId, 
        currentChapterId,
        hasToken: !!token, 
        selectedChapter, 
        ebookPath 
      });

      if (!userId || !token) {
        toast.error("Authentication required. Please log in again.");
        setIsLoadingResources(false);
        return;
      }

      // First call the chapters API to get current chapter info
      if (!currentChapterId) {
        throw new Error("No chapter ID found in session storage");
      }
      
      const chaptersResponse = await fetch(
        `${await getApiBaseUrl()}/class-subjects/chapters?userId=${userId}&planClassId=${planClassId}&chapterId=${currentChapterId}`,
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
      console.log("Chapters API Response:", chaptersData);
      
      // Store the chapterId from the API response in sessionStorage
      if (chaptersData?.chapterID) {
        const apiChapterId = chaptersData.chapterID.toString();
        console.log("Storing chapterId from API response in sessionStorage:", apiChapterId);
        console.log("Previous chapterId in sessionStorage:", sessionStorage.getItem("chapterId"));
        
        // Store in sessionStorage
        sessionStorage.setItem("chapterId", apiChapterId);
        
        // Verify it was stored correctly
        const storedChapterId = sessionStorage.getItem("chapterId");
        console.log("Verified chapterId in sessionStorage after setting:", storedChapterId);
        
        // Update the local variable to ensure consistency
        currentChapterId = apiChapterId;
        
        // Log the function that will use this chapterId
        console.log("This chapterId will be used in fetchChapterResources");
      }

      // Store all chapters data in session storage for future use
      if (Array.isArray(chaptersData)) {
        sessionStorage.setItem("allChaptersData", JSON.stringify(chaptersData));
      } else if (chaptersData.chapters && Array.isArray(chaptersData.chapters)) {
        sessionStorage.setItem("allChaptersData", JSON.stringify(chaptersData.chapters));
      }

      // Get the chapters array
      let chaptersArray = [];
      if (Array.isArray(chaptersData)) {
        chaptersArray = chaptersData;
      } else if (chaptersData.chapters && Array.isArray(chaptersData.chapters)) {
        chaptersArray = chaptersData.chapters;
      }

      // Find the current chapter based on selectedChapter, URL params, or ebookPath
      let currentChapter = null;
      
      // First, try to get chapter name from session storage
      const sessionChapterName = sessionStorage.getItem('selectedChapter');
      const sessionEbookPath = sessionStorage.getItem('selectedEbookPath');
      
      console.log("Chapter matching debug:", {
        selectedChapter,
        sessionChapterName,
        sessionEbookPath,
        chaptersArrayLength: chaptersArray.length,
        availableChapters: chaptersArray.map(ch => ({ chapterName: ch.chapterName, chapterID: ch.chapterID }))
      });
      
      if (selectedChapter) {
        // Try to find by chapter name
        currentChapter = chaptersArray.find((chapter: any) => 
          chapter.chapterName === selectedChapter || 
          chapter.customID?.toString() === selectedChapter
        );
        console.log("Trying to find chapter by selectedChapter:", selectedChapter, "Found:", currentChapter?.chapterName);
      }
      
      // If not found and we have session chapter name, try to find by session chapter name
      if (!currentChapter && sessionChapterName) {
        currentChapter = chaptersArray.find((chapter: any) => 
          chapter.chapterName === sessionChapterName
        );
        console.log("Trying to find chapter by session chapter name:", sessionChapterName, "Found:", currentChapter?.chapterName);
      }
      
      if (!currentChapter && (sessionEbookPath || ebookPath)) {
        // Try to find by ebookPath (prefer session ebookPath)
        const targetEbookPath = sessionEbookPath || ebookPath;
        currentChapter = chaptersArray.find((chapter: any) => 
          chapter.ebookPath === targetEbookPath ||
          chapter.ebookPath?.includes(targetEbookPath) ||
          targetEbookPath.includes(chapter.ebookPath || '')
        );
        console.log("Trying to find chapter by ebookPath:", targetEbookPath, "Found:", currentChapter?.chapterName);
      }
      
      if (!currentChapter) {
        // Fallback to first chapter - but don't update session storage
        currentChapter = chaptersArray[0];
        console.log("Using first chapter as fallback - not updating session storage");
        
        // Don't update session storage when using fallback, just fetch resources
        fetchChapterResources();
        return;
      }

      if (currentChapter && currentChapter.chapterID) {
        // Only update session storage if data has actually changed
        const currentStoredChapterName = sessionStorage.getItem("currentChapterName");
        const currentStoredEbookPath = sessionStorage.getItem("currentEbookPath");
        
        if (currentStoredChapterName !== currentChapter.chapterName || 
            currentStoredEbookPath !== currentChapter.ebookPath) {
          
          // Store all chapter information in session storage
          sessionStorage.setItem("chapterId", currentChapter.chapterID.toString());
          sessionStorage.setItem("currentChapterName", currentChapter.chapterName);
          sessionStorage.setItem("currentEbookPath", currentChapter.ebookPath);
          sessionStorage.setItem("currentClassName", currentChapter.className);
          sessionStorage.setItem("currentSubjectName", currentChapter.subjectName);
          
          console.log("Updated chapter data in session storage:", {
            chapterID: currentChapter.chapterID,
            chapterName: currentChapter.chapterName,
            ebookPath: currentChapter.ebookPath,
            className: currentChapter.className,
            subjectName: currentChapter.subjectName
          });
        } else {
          console.log("Chapter data unchanged, skipping session storage update");
        }
        
        // Now fetch resources with the correct chapterID
        fetchChapterResources();
      } else {
        console.error("No valid chapter found in response");
        toast.error("No chapter data available");
        setChapterResources([]);
        setIsLoadingResources(false);
      }
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      setChapterResources([]);
      setIsLoadingResources(false);
    }
  };

  // Fetch chapter resources when component mounts or when selectedType changes
// Handle type changes and ensure chapter ID is properly updated
useEffect(() => {
  if (selectedType && selectedType !== internalSelectedType) {
    console.log("Selected type changed to:", selectedType, "(previous type:", internalSelectedType + ")");
    sessionStorage.setItem('selectedAssessmentType', selectedType);
    
    // Update the internal state
    setInternalSelectedType(selectedType);
    
    // Get the current chapter ID from session storage
    const currentChapterId = sessionStorage.getItem("chapterId");
    console.log("Current chapter ID when type changed:", currentChapterId);
    
    // Only fetch resources if we have a valid chapter ID
    if (currentChapterId) {
      fetchChapterResources(currentChapterId);
    } else {
      console.warn("No chapter ID available when type changed");
      toast.warning("Please select a chapter first");
    }
  }
}, [selectedType]);

useEffect(() => {
  const handleChapterChange = () => {
    // Get the current type from session storage or props
    const currentType = sessionStorage.getItem('selectedAssessmentType') || selectedType || '1';
    console.log("Chapter changed, fetching resources with type:", currentType);
    fetchChapterResources();
  };

  window.addEventListener('chapterChanged', handleChapterChange);
  
  return () => {
    window.removeEventListener('chapterChanged', handleChapterChange);
  };
}, [selectedType]); // Add selectedType to the dependency array

useEffect(() => {
  const handleClearResources = () => {
    console.log("Clearing chapter resources");
    setChapterResources([]);
  };
  window.addEventListener('clearResources', handleClearResources);
  return () => {
    window.removeEventListener('clearResources', handleClearResources);
  };
}, []);

  const fetchChapterResourcesWithNewType = async (newResourceType: string) => {
    setIsLoadingResources(true);
    try {
      // Get the current chapter ID from session storage
      const currentChapterId = sessionStorage.getItem("chapterId");
      if (!currentChapterId) {
        console.error("No chapter ID found when changing resource type");
        toast.error("No chapter selected. Please select a chapter first.");
        return;
      }
      // Get the latest values right before making the API call
      const userId = sessionStorage.getItem("userID");
      const planClassId = sessionStorage.getItem("planClassId");
      const token = sessionStorage.getItem("authToken");
      
      // Get chapterId right before the API call to ensure it's the latest
      let chapterId = sessionStorage.getItem("chapterId");
      
      console.log("BookReader API call with new type:", { 
        userId, 
        planClassId, 
        chapterId, 
        newResourceType, 
        type: selectedType || "1",
        hasToken: !!token 
      });
      
      // Debug: Check what's in session storage
      console.log("Session storage contents:", {
        userID: sessionStorage.getItem("userID"),
        planClassId: sessionStorage.getItem("planClassId"),
        chapterId: sessionStorage.getItem("chapterId"),
        authToken: sessionStorage.getItem("authToken") ? "exists" : "missing"
      });

      // If we're missing any required data, try to fetch it
      if (!userId || !token || !planClassId || !chapterId) {
        console.log("Missing required data, fetching current chapter data first...");
        await fetchCurrentChapterData();
        
        // Get a fresh chapterId after fetching current chapter data
        chapterId = sessionStorage.getItem("chapterId");
        
        if (!chapterId) {
          throw new Error("Unable to determine current chapter. Please try again.");
        }
      }

      const currentType = selectedType || "1";
      
      const response = await fetch(
        `${await getApiBaseUrl()}/class-subjects/chapter-resources?userId=${userId}&planClassId=${planClassId}&chapterId=${chapterId}&resourceType=${newResourceType}&type=${currentType}`,
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
      console.log("BookReader Chapter Resources API Response with new type:", data);
      
      // Handle the response format - assuming it returns an array of resources
      if (Array.isArray(data)) {
        setChapterResources(data);
      } else if (data.resources && Array.isArray(data.resources)) {
        setChapterResources(data.resources);
      } else {
        setChapterResources([]);
      }
    } catch (error) {
      console.error("Error fetching chapter resources with new type:", error);
   
      setChapterResources([]);
    } finally {
      setIsLoadingResources(false);
    }
  };


  const fetchChapterResources = async (chapterIdParam?: string) => {
  setIsLoadingResources(true);
  try {
    const userId = sessionStorage.getItem("userID");
    const planClassId = sessionStorage.getItem("planClassId");
    const token = sessionStorage.getItem("authToken");
    
    // Use the provided chapterId, then get currentChapterId from session storage (same as chapters API)
    const chapterIdToUse = chapterIdParam || sessionStorage.getItem("chapterId");
    
    if (!chapterIdToUse) {
      console.error("No chapter ID available for fetching resources");
      return;
    }

    console.log("Fetching resources for chapter ID:", chapterIdToUse);
    
    // Get resourceType and type from session storage
    const resourceType = sessionStorage.getItem('selectedResourceType') || '0'; // Default to '0' (All)
    const type = sessionStorage.getItem('selectedAssessmentType') || selectedType || '1'; // Default to '1' (Learning Resources)
    
    console.log("Using resourceType:", resourceType, "and type:", type);
    
    const response = await fetch(
      `${await getApiBaseUrl()}/class-subjects/chapter-resources?userId=${userId}&planClassId=${planClassId}&chapterId=${chapterIdToUse}&resourceType=${resourceType}&type=${type}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch chapter resources');
    }

    const data = await response.json();
    setChapterResources(data);
  } catch (error) {
    console.error("Error fetching chapter resources:", error);
  } finally {
    setIsLoadingResources(false);
  }
};
  // In BookReader.tsx, update the fetchChapterResources function
// const fetchChapterResources = async (typeOverride?: string) => {
//   setIsLoadingResources(true);
//   try {
//     // Clear existing resources immediately when starting a new fetch
//     setChapterResources([]);
    
//     const userId = sessionStorage.getItem("userID");
//     const planClassId = sessionStorage.getItem("planClassId");
//     const token = sessionStorage.getItem("authToken");
    
//     // Always get the latest chapter ID from session storage when fetching resources
//     const currentChapterId = sessionStorage.getItem("chapterId") || '';
//     const resourceType = selectedResourceType || "0";
    
//     // Use the type in this priority: override > sessionStorage > prop > default
//     const currentType = typeOverride || 
//                        sessionStorage.getItem('selectedAssessmentType') || 
//                        selectedType || 
//                        '1';
    
//     // Ensure we have a valid chapter ID before proceeding
//     if (!currentChapterId) {
//       console.error("No chapter ID found in session storage");
//       toast.error("No chapter selected. Please select a chapter first.");
//       return;
//     }
    
//     const chapterId = currentChapterId;

//     if (!userId || !planClassId || !chapterId || !token) {
//       console.error("Missing required parameters for fetching chapter resources");
//       toast.error("Unable to load resources. Missing required parameters.");
//       return;
//     }

//     console.log("Fetching resources for:", {
//       userId,
//       planClassId,
//       chapterId,
//       resourceType,
//       currentType
//     });

//     const response = await fetch(
//       `${await getApiBaseUrl()}/class-subjects/chapter-resources?userId=${userId}&planClassId=${planClassId}&chapterId=${chapterId}&resourceType=${resourceType}&type=${currentType}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Fetched chapter resources:", data);
    
//     // Always set the resources, even if empty
//     setChapterResources(Array.isArray(data) ? data : (data.resources || []));
    
//   } catch (error) {
//     console.error("Error fetching chapter resources:", error);
//     // Ensure resources are cleared on error
//     setChapterResources([]);
//   } finally {
//     setIsLoadingResources(false);
//   }
// };


// const fetchChapterResources = async (typeOverride?: string) => {
//   setIsLoadingResources(true);
//   try {
//     // Get the latest values right before making the API call
//     const userId = sessionStorage.getItem("userID");
//     const planClassId = sessionStorage.getItem("planClassId");
//     const token = sessionStorage.getItem("authToken");
//     const currentChapterId = sessionStorage.getItem("chapterId"); // Changed from chapterId to currentChapterId for consistency
//     const resourceType = selectedResourceType || "0";
    
//     // Use the type in this priority: override > sessionStorage > prop > default
//     const currentType =
//       typeOverride ||
//       sessionStorage.getItem('selectedAssessmentType') ||
//       selectedType ||
//       '1';
    
//     // Use currentChapterId consistently
//     const chapterId = currentChapterId; // Use the same variable name as in the chapters API call

//     if (!userId || !planClassId || !chapterId || !token) {
//       console.error("Missing required parameters for fetching chapter resources");
//       toast.error("Unable to load resources. Missing required parameters.");
//       return;
//     }

//     const response = await fetch(
//       `${await getApiBaseUrl()}/class-subjects/chapter-resources?userId=${userId}&planClassId=${planClassId}&chapterId=${chapterId}&resourceType=${resourceType}&type=${currentType}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     setChapterResources(data);
//     console.log("Fetched chapter resources:", data);
//   } catch (error) {
//     console.error("Error fetching chapter resources:", error);
//   } finally {
//     setIsLoadingResources(false);
//   }
// };

  const getResourceTypeFromString = (resourceType: string) => {
    const typeMap: { [key: string]: string } = {
      'Interactivity': '1',
      'PDF': '2',
      'Animation': '3',
      'Audio': '4',
      'Video': '5',
      'Image': '6',
      'Document': '7',
      'Game': '8'
    };
    return typeMap[resourceType] || resourceType;
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
        return '6'; // Image
      case 'pdf':
        return '2'; // PDF
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
        return '5'; // Video
      case 'mp3':
      case 'wav':
      case 'ogg':
        return '4'; // Audio
      default:
        return '7'; // Document
    }
  };

  const getResourceTypeName = (resourceType: string | number) => {
    // First check if it's already a string type name
    const typeStr = resourceType.toString().toLowerCase();
    switch (typeStr) {
      case 'interactivity': return 'Interactivity';
      case 'pdf': return 'PDF';
      case 'animation': return 'Animation';
      case 'audio': return 'Audio';
      case 'video': return 'Video';
      case 'image': return 'Image';
      case 'document': return 'Document';
      case 'game': return 'Game';
      case 'lessonplan': return 'LessonPlan';
      case 'worksheet': return 'Worksheet';
    }
    
    // If not a string, try numeric codes
    const type = parseInt(resourceType.toString());
    switch (type) {
      case 1: return 'Interactivity';
      case 2: return 'PDF';
      case 3: return 'Animation';
      case 4: return 'Audio';
      case 5: return 'Video';
      case 6: return 'Image';
      case 7: return 'Document';
      case 8: return 'Game';
      case 9: return 'LessonPlan';
      default: return 'Unknown';
    }
  };

  const handleResourceClick = (resource: any) => {
    // Determine resource type from file extension if resourceType is empty
    let resourceType = resource.resourceType;
    if (!resourceType) {
      resourceType = getResourceTypeFromUrl(resource.resourceUrl);
    }

    // Convert to lowercase string for comparison
    const typeStr = resourceType.toString().toLowerCase();

    // Handle resource display based on resourceType
    switch (typeStr) {
      case '1': // Interactivity
      case 'interactivity':
        // Open interactivity in new tab
        window.open(resource.resourceUrl, '_blank');
        break;
      case '2': // PDF
      case 'pdf':
      case 'worksheet': // Worksheet (PDF type)
        // Set resource for ResourceViewer modal
        setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'PDF Document',
          url: resource.resourceUrl
        });
        break;
      case '3': // Animation
      case 'animation':
        // Open animation in new tab
       setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'PDF Document',
          url: resource.resourceUrl
        });
        break;
      case '4': // Audio
      case 'audio':
        // Open audio in new tab
       setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'PDF Document',
          url: resource.resourceUrl
        });
        break;
      case '5': // Video
      case 'video':
        // Open video player
       setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'PDF Document',
          url: resource.resourceUrl
        });
        break;
      case '6': // Image
      case 'image':
        // Open image in new tab
     setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'PDF Document',
          url: resource.resourceUrl
        });
        break;
      case '7': // Document
      case 'document':
        // Open document in new tab
        setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'PDF Document',
          url: resource.resourceUrl
        });
        break;
      case 'lessonplan':
        // Set resource for ResourceViewer modal
        setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'Lesson Plan',
          url: resource.resourceUrl
        });
        break;  
      case '8': // Game
      case 'game':
        // Open game in new tab
        setSelectedResource({
          type: resource.resourceType,
          title: resource.resourceName || 'PDF Document',
          url: resource.resourceUrl
        });
        break;
      default:
        toast.error("Unknown resource type");
    }
  };
  
  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && internalIsFullscreen) {
        setInternalIsFullscreen(false);
        if (onFullscreenChange) {
          onFullscreenChange(false);
        }
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [internalIsFullscreen, onFullscreenChange]);
  
  // Disable body scroll when fullscreen is active
  useEffect(() => {
    if (internalIsFullscreen) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [internalIsFullscreen]);
  
  // Handle parent fullscreen state changes
  useEffect(() => {
    if (isFullscreen !== internalIsFullscreen) {
      console.log("BookReader: Parent fullscreen state changed to:", isFullscreen);
      setInternalIsFullscreen(isFullscreen);
      
      // Restore page when exiting fullscreen
      if (!isFullscreen && internalIsFullscreen) {
        console.log("BookReader: Restoring page after parent fullscreen exit:", currentPageBeforeFullscreen);
        setCurrentPage(currentPageBeforeFullscreen);
        setFullscreenEbookPath('');
      }
    }
  }, [isFullscreen, internalIsFullscreen, currentPageBeforeFullscreen]);
  
  // PDF-specific states
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  
  // PDF refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRenderTask = useRef<any>(null);

  // Manage loading state when ebookPath changes (but not when just exiting fullscreen)
  useEffect(() => {
    // Skip this effect during fullscreen transitions
    // Use a ref to track if we're in a fullscreen transition
    if (internalIsFullscreen) {
      console.log("BookReader: Skipping ebookPath effect - fullscreen mode");
      return;
    }
    
    // Skip if we just exited fullscreen (check if fullscreenEbookPath was recently set)
    if (fullscreenEbookPath) {
      console.log("BookReader: Skipping ebookPath effect - just exited fullscreen");
      return;
    }
    
    console.log("BookReader: ebookPath changed, setting loading to true");
    setLoading(true);
    setError('');
    
    // Set a reasonable timeout for loading
    const timer = setTimeout(() => {
      console.log("BookReader: Loading timeout reached, setting loading to false");
      setLoading(false);
    }, 3000); // 3 seconds timeout
    
    return () => clearTimeout(timer);
  }, [ebookPath]);

  // Also trigger loading when chapter selection changes
  useEffect(() => {
    if (selectedChapter) {
      console.log("BookReader: selectedChapter changed, setting loading to true");
      setLoading(true);
      setError('');
      
      // Reset page to 1 when chapter changes
      console.log("BookReader: Resetting page to 1 due to chapter change");
      setCurrentPage(1);
      
      // Set loading to false after a short delay to show the loading state
      const timer = setTimeout(() => {
        console.log("BookReader: Chapter change loading completed, setting loading to false");
        setLoading(false);
      }, 1500); // 1.5 seconds for chapter change
      
      return () => clearTimeout(timer);
    }
  }, [selectedChapter]);

  // Trigger loading when URL params change (class/subject change)
  useEffect(() => {
    // Skip this effect during fullscreen transitions
    if (internalIsFullscreen) {
      console.log("BookReader: Skipping URL params effect - fullscreen mode");
      return;
    }
    
    // Skip if we just exited fullscreen
    if (fullscreenEbookPath) {
      console.log("BookReader: Skipping URL params effect - just exited fullscreen");
      return;
    }
    
    console.log("BookReader: URL params changed, setting loading to true");
    setLoading(true);
    setError('');
    
    // Reset page to 1 when class/subject changes
    console.log("BookReader: Resetting page to 1 due to class/subject change");
    setCurrentPage(1);
    
    // Set loading to false after a reasonable delay
    const timer = setTimeout(() => {
      console.log("BookReader: URL params loading completed, setting loading to false");
      setLoading(false);
    }, 2000); // 2 seconds for URL changes
    
    return () => clearTimeout(timer);
  }, [window.location.search]);


  // Get the page data, using modulo to cycle through mock pages safely
  const pageIndex = 0; // Simplified since we're not using pages anymore
  const page = mockPages[pageIndex] || mockPages[0];

  // Filter resources based on selected chapter
  const filteredResources = selectedChapter === "all" 
    ? (page?.resources || [])
    : (page?.resources || []).filter(r => r.id === parseInt(selectedChapter));

  // Filter lesson plans based on selected chapter and resource type
  const filteredLessonPlans = selectedChapter === "all"
    ? chapterResources.filter((resource: any) => {
        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
        const typeStr = resourceType.toString().toLowerCase();
        return typeStr === 'pdf' || typeStr === '2' || typeStr === 'lessonplan';
      })
    : chapterResources.filter((resource: any) => {
        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
        const typeStr = resourceType.toString().toLowerCase();
        return (typeStr === 'pdf' || typeStr === '2' || typeStr === 'lessonplan') && 
               resource.resourceName.toLowerCase().includes(lessonPlanSearch.toLowerCase());
      });

  // Filter assessments based on selected chapter and resource type
  const filteredAssessments = selectedChapter === "all"
    ? chapterResources.filter((resource: any) => {
        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
        const typeStr = resourceType.toString().toLowerCase();
        return typeStr === 'pdf' || typeStr === '2' || typeStr === 'worksheet' || typeStr === 'answerkey';
      })
    : chapterResources.filter((resource: any) => {
        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
        const typeStr = resourceType.toString().toLowerCase();
        return (typeStr === 'pdf' || typeStr === '2' || typeStr === 'worksheet' || typeStr === 'answerkey') && 
               resource.resourceName.toLowerCase().includes(assessmentSearch.toLowerCase());
      });

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
    <>
      {isNavigatingBack && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-center">Loading content...</p>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full bg-background">

      {/* Body */}
      <div className="flex-1 flex overflow-visible">
        {/* Main Content - PDF View */}
        <div className="flex-1 flex flex-col overflow-visible bg-muted/30 relative">
          <div className="flex-1 flex flex-col   items-start justify-start p-2 sm:p-3 overflow-visible min-h-[850px] ">
            {/* PDF Document Container */}
            <div className="bg-card shadow-2xl rounded-lg border border-border w-full flex-1 flex items-start justify-start overflow-visible relative">
              {/* Header Buttons - Fixed at the top of the viewport */}
              <div className={`fixed top-4 z-50 flex gap-2  ${(showResources || showAssessments || showLessonPlans) ? 'right-7 left-7' : 'right-7'}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="bg-card/80 backdrop-blur-sm hover:bg-accent"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Fullscreen PDF Viewer - handled by single PDFViewer instance */}
                {internalIsFullscreen && (
                  <>
                    {/* Single exit button - top-right */}
                    <button
                      onClick={toggleFullscreen}
                      className="fixed top-4 right-4 z-[9999] bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-colors shadow-xl border-2 border-white flex items-center gap-2"
                      title="Exit Full screen (ESC)"
                    >
                      <Minimize2 className="w-4 h-4" />
                      <span className="font-semibold">Exit Fullscreen</span>
                    </button>

                    {/* ESC key hint */}
                    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[9999] bg-black/80 text-white px-3 py-1 rounded-lg text-xs">
                      Press ESC to exit
                    </div>
                  </>
                )}
              
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
                      <PDFViewer 
                        pdfPath={getPdfPath()} 
                        className="w-full h-full"
                        initialPage={currentPage}
                        onPageChange={handlePageChange}
                        onFullscreenToggle={toggleFullscreen}
                        isFullscreen={false}
                        isHeaderVisible={isHeaderVisible}
                        key={`pdf-viewer-iframe-${getPdfPath()}`}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Single PDF Viewer instance for both fullscreen and normal mode */}
              {(!ebookPath || ebookPath.trim() === "") && !loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="text-red-500 text-base">The PDF for this chapter is not available.</div>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                  <div className="text-muted-foreground/70 text-sm">Loading...</div>
                </div>
              ) : (
                <PDFViewer 
                  pdfPath={getPdfPath()} 
                  className={`h-full w-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
                  initialPage={currentPage}
                  onPageChange={handlePageChange}
                  onFullscreenToggle={toggleFullscreen}
                  isFullscreen={isFullscreen}
                  isHeaderVisible={isHeaderVisible}
                  key={`pdf-viewer-${getPdfPath()}`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Learning Resources */}
        {showResources && (
          <div className="fixed top-0 right-0 bottom-0 md:relative z-40 md:z-0 w-full md:w-96 bg-card md:border-l border-border rounded flex flex-col" style={{ height: 'calc(105vh - 2rem)', margin: '1rem 0' }}>
            {/* Header */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Resources</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleResources?.()}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-4">
                <h4 className="text-base font-semibold text-foreground mb-3">Filter by Type</h4>
                <Select 
                  key={`resource-type-${selectedResourceType}`} 
                  value={selectedResourceType} 
                  onValueChange={(value) => {
                    setSelectedResourceType(value);
                    sessionStorage.setItem('selectedResourceType', value);
                    fetchChapterResourcesWithNewType(value);
                  }}
                >
                  <SelectTrigger className="w-full border-2 border-primary bg-background hover:bg-muted transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="0">All</SelectItem>
                    <SelectItem value="1">Interactivity</SelectItem>
                    <SelectItem value="2">PDF</SelectItem>
                    <SelectItem value="3">Animation</SelectItem>
                    <SelectItem value="4">Audio</SelectItem>
                    <SelectItem value="5">Video</SelectItem>
                    <SelectItem value="6">Image</SelectItem>
                    <SelectItem value="7">Document</SelectItem>
                    <SelectItem value="8">Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto resources-scrollbar">
              <div className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {isLoadingResources ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-2"></div>
                      <span className="text-sm text-muted-foreground">Loading resources...</span>
                    </div>
                  ) : chapterResources.length > 0 ? (
                    chapterResources
                      .filter((resource: any) => {
                        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                        const typeNum = getResourceTypeFromString(resourceType).toString();
                        
                        // Debug log to see what we're working with
                        console.log('Resource:', {
                          name: resource.resourceName,
                          type: resourceType,
                          typeNum: typeNum,
                          selectedResourceType,
                          selectedType
                        });
                        
                        // If no specific type is selected, show all resources
                        if (selectedResourceType === "0") {
                          return true;
                        }
                        
                        // Check if the resource type matches the selected filter
                        const typeMatch = selectedResourceType === typeNum;
                        
                        // For backward compatibility, also check string type names
                        const typeName = getResourceTypeName(typeNum).toLowerCase();
                        const selectedTypeName = getResourceTypeName(selectedResourceType).toLowerCase();
                        const nameMatch = typeName === selectedTypeName;
                        
                        return typeMatch || nameMatch;
                      })
                      .map((resource: any) => {
                        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                        const typeStr = resourceType.toString().toLowerCase();
                        const isVideo = typeStr === 'video' || typeStr === '5';
                        return (
                          <div
                            key={resource.resourceId}
                            onClick={() => handleResourceClick(resource)}
                            className="p-4 rounded-lg border border-border bg-card hover:bg-muted cursor-pointer transition-all hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              {isVideo ? (
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
                                  {resource.resourceName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Click to preview • {getResourceTypeName(resourceType)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No resources available for this chapter.
                      </p>
                      <Button 
  variant="outline" 
  size="sm" 
  className="mt-2"
  onClick={() => fetchChapterResources()}
>
  Refresh Resources
</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel - 
        */}
        {showAssessments && (
          <div className="fixed top-0 right-0 bottom-0 md:relative z-40 md:z-0 w-full md:w-96 bg-card md:border-l border-border rounded flex flex-col" style={{ height: 'calc(105vh - 2rem)', margin: '1rem 0' }}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Assessments</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleAssessments?.()}
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
                    {isLoadingResources ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-2"></div>
                        <span className="text-sm text-muted-foreground">Loading assessments...</span>
                      </div>
                    ) : chapterResources
                      .filter((resource: any) => {
                        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                        const typeStr = resourceType.toString().toLowerCase();
                        // Show only worksheets/assessments (PDFs) when selectedType is 2
                        return selectedType === "2" && (typeStr === 'pdf' || typeStr === '2' || typeStr === 'worksheet');
                      })
                      .filter((resource: any) => resource.resourceName.toLowerCase().includes(worksheetSearch.toLowerCase()))
                      .length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="text-muted-foreground/70 text-sm">Assessments are not available for this chapter.</div>
                        </div>
                      )}
                    {chapterResources
                      .filter((resource: any) => {
                        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                        const typeStr = resourceType.toString().toLowerCase();
                        // Show only worksheets/assessments (PDFs) when selectedType is 2
                        return selectedType === "2" && (typeStr === 'pdf' || typeStr === '2' || typeStr === 'worksheet');
                      })
                      .filter((resource: any) => resource.resourceName.toLowerCase().includes(worksheetSearch.toLowerCase()))
                      .map((resource: any) => {
                        return (
                          <div
                            key={resource.resourceId}
                            onClick={() => handleResourceClick(resource)}
                            className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <p className="text-sm text-foreground font-medium">
                                  {resource.resourceName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getResourceTypeName(resource.resourceType)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(resource.resourceUrl, '_blank');
                                }}
                              >
                                Preview
                              </Button>
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
                    {isLoadingResources ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-2"></div>
                        <span className="text-sm text-muted-foreground">Loading answer keys...</span>
                      </div>
                    ) : chapterResources
                      .filter((resource: any) => {
                        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                        const typeStr = resourceType.toString().toLowerCase();
                        // Show only answer keys (PDFs) when selectedType is 2
                        return selectedType === "2" && (typeStr === 'pdf' || typeStr === '2' || typeStr === 'answerkey');
                      })
                      .filter((resource: any) => resource.resourceName.toLowerCase().includes(answerKeySearch.toLowerCase()))
                      .length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="text-muted-foreground/70 text-sm">Assessments are not available for this chapter.</div>
                        </div>
                      )}
                    {chapterResources
                      .filter((resource: any) => {
                        const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                        const typeStr = resourceType.toString().toLowerCase();
                        // Show only answer keys (PDFs) when selectedType is 2
                        return selectedType === "2" && (typeStr === 'pdf' || typeStr === '2' || typeStr === 'answerkey');
                      })
                      .filter((resource: any) => resource.resourceName.toLowerCase().includes(answerKeySearch.toLowerCase()))
                      .map((resource: any) => {
                        return (
                          <div
                            key={resource.resourceId}
                            onClick={() => handleResourceClick(resource)}
                            className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <p className="text-sm text-foreground font-medium">
                                  {resource.resourceName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getResourceTypeName(resource.resourceType)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(resource.resourceUrl, '_blank');
                                }}
                              >
                                Preview
                              </Button>
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
          <div className="fixed top-0 right-0 bottom-0 md:relative z-40 md:z-0 w-full md:w-96 bg-card md:border-l border-border rounded flex flex-col" style={{ height: 'calc(105vh - 2rem)', margin: '1rem 0' }}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Lesson Plans</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleLessonPlans?.()}
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
                {isLoadingResources ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-2"></div>
                    <span className="text-sm text-muted-foreground">Loading lesson plans...</span>
                  </div>
                ) : chapterResources
                  .filter((resource: any) => {
                    const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                    const typeStr = resourceType.toString().toLowerCase();
                    // Show only lesson plans (PDFs) when selectedType is 3
                    return selectedType === "3" && (typeStr === 'pdf' || typeStr === '2' || typeStr === 'lessonplan');
                  })
                  .filter((resource: any) => resource.resourceName.toLowerCase().includes(lessonPlanSearch.toLowerCase()))
                  .length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-muted-foreground/70 text-sm">Lesson Plans are not available for this chapter.</div>
                    </div>
                  )}
                {chapterResources
                  .filter((resource: any) => {
                    const resourceType = resource.resourceType || getResourceTypeFromUrl(resource.resourceUrl);
                    const typeStr = resourceType.toString().toLowerCase();
                    // Show only lesson plans (PDFs) when selectedType is 3
                    return selectedType === "3" && (typeStr === 'pdf' || typeStr === '2' || typeStr === 'lessonplan');
                  })
                  .filter((resource: any) => resource.resourceName.toLowerCase().includes(lessonPlanSearch.toLowerCase()))
                  .map((resource: any) => {
                    return (
                      <div
                        key={resource.resourceId}
                        onClick={() => handleResourceClick(resource)}
                        className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm text-foreground font-medium">
                              {resource.resourceName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getResourceTypeName(resource.resourceType)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(resource.resourceUrl, '_blank');
                            }}
                          >
                            Preview
                          </Button>
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
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-1">
          <div className="w-full max-w-full max-h-[300vh] overflow-y-auto">
            <ResourceViewer
              resource={selectedResource}
              onClose={() => setSelectedResource(null)}
            />
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default BookReader;