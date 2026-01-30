import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BookReader from "@/components/BookReader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getApiBaseUrl } from '@/utils/config';

interface ChapterOption {
  id: number;
  name: string;
}

interface CombinedOption {
  id: string;
  label: string;
  className: string;
  subjectName: string;
  planClassId: string;
}

const BookReaderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userRole = localStorage.getItem("userRole") as "student" | "teacher" | null;
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [combinedSelection, setCombinedSelection] = useState<string>("");
  const [chapterSelection, setChapterSelection] = useState<string>("all");
  const [combinedOptions, setCombinedOptions] = useState<CombinedOption[]>([]);
  const [chapterOptions, setChapterOptions] = useState<ChapterOption[]>([]);
  
  // Store current content state to preserve during fullscreen
  const [currentContentState, setCurrentContentState] = useState<{
    subjectTitle: string;
    chapterTitle: string;
    ebookPath: string;
  } | null>(null);
  const [isLoadingChapters, setIsLoadingChapters] = useState<boolean>(false);
  const [isDropdownLoading, setIsDropdownLoading] = useState<boolean>(false);
    const [isReloading, setIsReloading] = useState(false);

  // Handle browser back button
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      // Prevent default back navigation
      event.preventDefault();
      
      // Show loading state
      setIsReloading(true);
      
      // Force a page reload after a short delay
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500);
      
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

  // Teacher Tools state
  const [showResources, setShowResources] = useState(false);
  const [showAssessments, setShowAssessments] = useState(false);
  const [showLessonPlans, setShowLessonPlans] = useState(false);
  const [isResourceFloaterOpen, setIsResourceFloaterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('1');
  const [resetResourceType, setResetResourceType] = useState<boolean>(false);

// Reset trigger back to false after a short delay
useEffect(() => {
  if (resetResourceType) {
    const timer = setTimeout(() => {
      setResetResourceType(false);
    }, 100);
    return () => clearTimeout(timer);
  }
}, [resetResourceType]);
  
  // Track initial URL chapter and class-subject change
  const [initialUrlChapter, setInitialUrlChapter] = useState<string>("");
  const [hasClassSubjectChanged, setHasClassSubjectChanged] = useState<boolean>(false);
  const [chapterChangeTime, setChapterChangeTime] = useState<number>(0);
  const [currentChapterId, setCurrentChapterId] = useState<string>("");

// Auto-fetch resources when panel opens and class/subject has changed
useEffect(() => {
  if ((showResources || showAssessments || showLessonPlans) && hasClassSubjectChanged) {
    console.log("BookReaderPage: Auto-fetching resources due to panel opening after class/subject change");
    // Trigger resource fetch by setting a small timeout to ensure state updates first
    setTimeout(() => {
      // Get the current chapter from Header dropdown, not the stale state
      const currentChapterSelection = sessionStorage.getItem("chapterSelection");
      console.log("BookReaderPage: Using current chapter from Header:", currentChapterSelection);
      // This will trigger resource fetch in BookReader component
      const event = new CustomEvent('refetchResources', { detail: { chapterId: currentChapterSelection } });
      window.dispatchEvent(event);
    }, 100);
  }
}, [showResources, showAssessments, showLessonPlans, hasClassSubjectChanged]);

  // Auto-select first chapter when chapters are loaded and chapterSelection is "all" (only run once)
  useEffect(() => {
    if (chapterOptions.length > 0 && chapterSelection === "all") {
      console.log("BookReader: Auto-selecting first chapter to replace 'all'");
      const firstChapterId = chapterOptions[0]?.id.toString() || "1";
      setChapterSelection(firstChapterId);
      console.log("BookReader: Set chapterSelection to:", firstChapterId);
    }
  }, [chapterOptions.length]); // Only depend on length, not the entire array

  // Auto-fetch resources when panel opens and class/subject has changed
useEffect(() => {
  if ((showResources || showAssessments || showLessonPlans) && hasClassSubjectChanged) {
    console.log("BookReaderPage: Auto-fetching resources due to panel opening after class/subject change");
    // Trigger resource fetch by setting a small timeout to ensure state updates first
    setTimeout(() => {
      // Get the current chapter from Header dropdown, not the stale state
      const currentChapterSelection = sessionStorage.getItem("chapterSelection");
      console.log("BookReaderPage: Using current chapter from Header:", currentChapterSelection);
      // This will trigger resource fetch in BookReader component
      const event = new CustomEvent('refetchResources', { detail: { chapterId: currentChapterSelection } });
      window.dispatchEvent(event);
    }, 100);
  }
}, [showResources, showAssessments, showLessonPlans, hasClassSubjectChanged]);

  // Store initial session chapter on first load
  useEffect(() => {
    const sessionChapter = sessionStorage.getItem("selectedChapter");
    if (sessionChapter && !initialUrlChapter) {
      setInitialUrlChapter(sessionChapter);
      console.log("BookReader: Stored initial session chapter:", sessionChapter);
    }
  }, []);

  // Read chapterSelection from session storage when component mounts
  useEffect(() => {
    const storedChapterSelection = sessionStorage.getItem("chapterSelection");
    if (storedChapterSelection) {
      setChapterSelection(storedChapterSelection);
      console.log("BookReader: Read chapterSelection from session storage:", storedChapterSelection);
    }
  }, []);

  const { subjectTitle, chapterTitle, ebookPath } = useMemo(() => {
    // If we're in fullscreen and have stored content state, use it and return immediately
    if (isFullscreen && currentContentState) {
      console.log("BookReader: Fullscreen mode, using stored content state:", currentContentState);
      return currentContentState;
    }
    
    // If we're entering fullscreen, store the current content state
    if (isFullscreen && !currentContentState) {
      // Get the current content from the most recent normal logic result
      // Instead of relying on session storage, let's get it from the current computed values
      const sessionSubject = sessionStorage.getItem("selectedSubject");
      const sessionChapter = sessionStorage.getItem("selectedChapter");
      const sessionEbookPath = sessionStorage.getItem("selectedEbookPath");
      const sessionClass = sessionStorage.getItem("selectedClass");

      const storedSubject = sessionStorage.getItem("currentSubjectName") || sessionStorage.getItem("selectedSubjectName");
      const storedChapter = sessionStorage.getItem("currentChapterName");
      const storedEbookPath = sessionStorage.getItem("currentEbookPath");
      const storedClassName = sessionStorage.getItem("currentClassName");

      // Use the same logic as the normal flow to get current values
      let finalEbookPath = "";
      let finalChapterTitle = "";
      let finalSubjectTitle = "";

      // If we have stored values from Header (most recent), use them
      if (storedEbookPath && storedChapter) {
        finalEbookPath = storedEbookPath;
        finalChapterTitle = storedChapter;
        finalSubjectTitle = storedSubject || sessionSubject || "";
      }
      // Otherwise, use session values
      else if (sessionChapter && sessionEbookPath) {
        finalEbookPath = sessionEbookPath;
        finalChapterTitle = sessionChapter;
        finalSubjectTitle = sessionSubject || storedSubject || "";
      }
      
      if (finalEbookPath && finalChapterTitle) {
        const contentState = {
          subjectTitle: finalSubjectTitle,
          chapterTitle: finalChapterTitle,
          ebookPath: finalEbookPath
        };
        setCurrentContentState(contentState);
        console.log("BookReader: Fullscreen mode, storing and using current content:", contentState);
        return contentState;
      }
      
      // If we can't get current content, return empty values to prevent wrong content
      console.log("BookReader: Fullscreen mode, could not get current content, returning empty values");
      return { subjectTitle: "", chapterTitle: "", ebookPath: "" };
    }
    
    // Don't clear the stored state when exiting fullscreen - keep it for next time
    // Only clear it when chapter actually changes (in handleChapterChange)
    
    // If we're not in fullscreen but have stored state, use it as the source of truth
    // This prevents session storage corruption from affecting the current chapter
    if (!isFullscreen && currentContentState) {
      console.log("BookReader: Using stored content state as source of truth:", currentContentState);
      return currentContentState;
    }

    const sessionSubject = sessionStorage.getItem("selectedSubject");
    const sessionChapter = sessionStorage.getItem("selectedChapter");
    const sessionEbookPath = sessionStorage.getItem("selectedEbookPath");
    const sessionClass = sessionStorage.getItem("selectedClass");

    const storedSubject = sessionStorage.getItem("currentSubjectName") || sessionStorage.getItem("selectedSubjectName");
    const storedChapter = sessionStorage.getItem("currentChapterName");
    const storedEbookPath = sessionStorage.getItem("currentEbookPath");
    const storedClassName = sessionStorage.getItem("currentClassName");

    // If chapter was just changed, wait a bit for URL to update
    const timeSinceChange = Date.now() - chapterChangeTime;
    if (timeSinceChange < 500 && chapterChangeTime > 0) {
      console.log("BookReader: Waiting for URL update after chapter change");
      return { subjectTitle: storedSubject || "", chapterTitle: storedChapter || "", ebookPath: storedEbookPath || "" };
    }

    console.log("BookReader: useMemo called with:", {
      sessionSubject,
      sessionChapter,
      sessionEbookPath,
      sessionClass,
      storedSubject,
      storedChapter,
      storedEbookPath,
      storedClassName,
      initialUrlChapter,
      hasClassSubjectChanged
    });
    console.log("BookReader: DEBUG - Session params - sessionEbookPath:", sessionEbookPath, "sessionChapter:", sessionChapter);

    let finalEbookPath;
    let finalChapterTitle;
    let finalSubjectTitle;

    // First time load: use session values
    if (!hasClassSubjectChanged && sessionChapter) {
      console.log("BookReader: First time load, using session chapter:", sessionChapter);
      finalEbookPath = sessionEbookPath || "";
      finalChapterTitle = sessionChapter;
      finalSubjectTitle = sessionSubject || "";
    }
    // After class-subject change: use stored values based on ebookPath
    else if (hasClassSubjectChanged && storedEbookPath) {
      console.log("BookReader: Class-subject changed, using stored ebookPath:", storedEbookPath);
      finalEbookPath = storedEbookPath;
      finalChapterTitle = storedChapter;
      finalSubjectTitle = storedSubject;
    }
    // Chapter change: prioritize session parameters (updated by Header)
    else if (sessionEbookPath) {
      console.log("BookReader: Chapter change, using session ebookPath:", sessionEbookPath);
      finalEbookPath = sessionEbookPath;
      finalChapterTitle = sessionChapter;
      finalSubjectTitle = sessionSubject;
    }
    else if (sessionChapter) {
      console.log("BookReader: Entering sessionChapter condition. sessionChapter:", sessionChapter, "storedEbookPath:", storedEbookPath);
      // Check if storedEbookPath is newer (from Header update)
      if (storedEbookPath && storedChapter !== sessionChapter) {
        console.log("BookReader: Using newer storedEbookPath instead of session chapter");
        console.log("BookReader: Using newer storedEbookPath instead of URL chapter");
        finalEbookPath = storedEbookPath;
        finalChapterTitle = storedChapter;
        finalSubjectTitle = storedSubject || sessionSubject || "";
      } else {
        finalEbookPath = storedEbookPath || "";
        finalChapterTitle = sessionChapter;
        finalSubjectTitle = sessionSubject || storedSubject || "";
      }
    }
    // Fallback to existing logic
    else {
      console.log("BookReader: Using fallback logic");
      finalEbookPath = storedEbookPath || sessionEbookPath || "";
      finalChapterTitle = storedChapter || sessionChapter || "";
      finalSubjectTitle = storedSubject || sessionSubject || "";
    }
    
    // If no ebookPath, leave it empty (no dynamic construction)
    if (!finalEbookPath) {
      console.log("BookReader: No ebookPath available, showing empty path");
      finalEbookPath = "";
    } else {
      console.log("BookReader: Using existing ebookPath:", finalEbookPath);
    }

    const result = {
      subjectTitle: finalSubjectTitle,
      chapterTitle: finalChapterTitle,
      ebookPath: finalEbookPath,
    };

    console.log("BookReader: Final result:", result);
    return result;
  }, [sessionStorage.getItem("selectedChapter"), sessionStorage.getItem("selectedEbookPath"), chapterChangeTime, isFullscreen]); // Use session storage instead of URL and include isFullscreen

  useEffect(() => {
    // Load all class-subject combinations from session storage
    const storedSubjects = sessionStorage.getItem("subjectsForReader");
    
    if (storedSubjects) {
      try {
        const subjectsData = JSON.parse(storedSubjects);
        const options = subjectsData.map((item: any, index: number) => ({
          id: `option-${index}`,
          classId: item.classID.toString(),
          className: item.className,
          subjectId: item.subjectID.toString(),
          subjectName: item.subjectName,
          planClassId: item.planClassId.toString(),
          label: `${item.className} - ${item.subjectName}`,
        }));

        setCombinedOptions(options);

        // Find the current selection based on stored data
        const currentClassName = sessionStorage.getItem("selectedClassName");
        const currentSubjectName = sessionStorage.getItem("currentSubjectName") || sessionStorage.getItem("selectedSubjectName");
        
        if (currentClassName && currentSubjectName) {
          const currentOption = options.find(opt => 
            opt.className === currentClassName && opt.subjectName === currentSubjectName
          );
          if (currentOption) {
            setCombinedSelection(currentOption.id);
          } else if (!combinedSelection) {
            setCombinedSelection(options[0]?.id || "");
          }
        } else if (!combinedSelection) {
          setCombinedSelection(options[0]?.id || "");
        }
      } catch (e) {
        console.error("Failed to parse subjects data:", e);
        setCombinedOptions([]);
      }
    } else {
      setCombinedOptions([]);
    }

    const storedChapters = sessionStorage.getItem("chaptersForReader");
    if (storedChapters) {
      try {
        const parsed: Array<{ chapterName: string }> = JSON.parse(storedChapters);
        const mapped: ChapterOption[] = parsed.map((ch, index) => ({
          id: index + 1,
          name: ch.chapterName,
        }));
        setChapterOptions(mapped);

        if (chapterTitle) {
          const match = mapped.find((c) => c.name === chapterTitle);
          if (match) {
            setChapterSelection(match.id.toString());
          } else {
            setChapterSelection("all");
          }
        } else {
          setChapterSelection("all");
        }
      } catch (e) {
        console.error("Failed to parse chaptersForReader from sessionStorage", e);
        setChapterOptions([]);
        setChapterSelection("all");
      }
    } else {
      setChapterOptions([]);
      setChapterSelection("all");
    }
  }, [subjectTitle, chapterTitle, combinedSelection]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleTeacherToolsClick = (chapterId: string) => {
    console.log("Teacher tools clicked for chapter:", chapterId);
    
    // Update URL with the clicked chapter ID
    const url = new URL(window.location.href);
    url.searchParams.set('chapterId', chapterId);
    window.history.pushState({}, '', url.toString());
    
    // Update session storage with the new chapter ID
    sessionStorage.setItem('chapterId', chapterId);
    
    // Update state
    setCurrentChapterId(chapterId);
    
    // If chapter selection is different, update it
    if (chapterSelection !== chapterId) {
      setChapterSelection(chapterId);
      setChapterChangeTime(Date.now());
    }
    
    // Show the resources panel if not already shown
    if (!showResources) {
      setShowResources(true);
      setShowAssessments(false);
      setShowLessonPlans(false);
    }
    
    // Dispatch event to refetch resources for this chapter
    const event = new CustomEvent('refetchResources', { 
      detail: { 
        chapterId: chapterId,
        timestamp: Date.now()
      } 
    });
    window.dispatchEvent(event);
  };

  const handleCombinedChange = (value: string) => {
    const selectedOption = combinedOptions.find(opt => opt.id === value);
    if (selectedOption) {
      // Update the dropdown selection
      setCombinedSelection(value);
      
      // Clear chapter options immediately to prevent showing previous chapter during loading
      setChapterOptions([]);
      setChapterSelection("all");
      
      // Set loading state for chapters dropdown
      setIsDropdownLoading(true);
      
      // Set flag that class-subject has changed
      setHasClassSubjectChanged(true);
      console.log("BookReader: Class-subject changed, setting flag to true");
      
      // Reset resource type to All when class-subject changes
      setResetResourceType(true);
      
      // Store the new selection in session storage
      sessionStorage.setItem("selectedClassName", selectedOption.className);
      sessionStorage.setItem("selectedSubjectName", selectedOption.subjectName);
      sessionStorage.setItem("planClassId", selectedOption.planClassId);
      
      // Preserve the correct selectedType based on which panel is open
      let currentType = "1"; // Default to Learning Resources
      if (showAssessments) {
        currentType = "2"; // Assessments
      } else if (showLessonPlans) {
        currentType = "3"; // Lesson Plans
      }
      setSelectedType(currentType);
      console.log("BookReader: Preserving selectedType as:", currentType, "for panel:", showAssessments ? "Assessments" : showLessonPlans ? "Lesson Plans" : "Resources");
      
      // Fetch chapters for the new class-subject
      fetchChaptersForClassSubject(selectedOption.planClassId, selectedOption);
      
      // Auto-fetch resources if any Teacher Tools panel is open
      if (showResources || showAssessments || showLessonPlans) {
        console.log("BookReaderPage: Auto-fetching resources due to class/subject change with panel open");
        // Trigger resource fetch by setting a small timeout to ensure state updates first
        setTimeout(() => {
          // This will trigger resource fetch in BookReader component
          const event = new CustomEvent('refetchResources', { detail: { chapterId: sessionStorage.getItem("chapterId") } });
          window.dispatchEvent(event);
        }, 100);
      }
    }
  };

  const fetchChaptersForClassSubject = async (planClassId: string, selectedOption: CombinedOption) => {
    try {
      // Set loading state to true
      setIsLoadingChapters(true);
      
      const userId = sessionStorage.getItem("userID");
      const token = sessionStorage.getItem("authToken");
      
      console.log("Fetching chapters with:", { userId, planClassId, selectedOption });
      
      if (!userId || !token) {
        console.error("Missing user authentication data:", { userId, token: !!token });
        return;
      }

      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(
        `${apiBaseUrl}/class-subjects/chapters?userId=${userId}&planClassId=${planClassId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        const error = await response.text();
        console.error("Error fetching chapters:", error);
        return;
      }

      const data = await response.json();
      console.log("Chapters API Response:", data);

      // Store chapters data in session storage
      if (data.summary && data.summary.length > 0) {
        console.log("Storing chapters:", data.summary);
        sessionStorage.setItem("chaptersForReader", JSON.stringify(data.summary));
        
        // Update chapter options
        const mapped: ChapterOption[] = data.summary.map((ch: any, index: number) => ({
          id: index + 1,
          name: ch.chapterName,
        }));
        console.log("Mapped chapter options:", mapped);
        setChapterOptions(mapped);
        console.log("Chapter options state set to:", mapped);
        
        // Reset chapter selection to first chapter
        setChapterSelection("1");
        console.log("Chapter selection set to: 1");
        
        // Store first chapter data for immediate display
        if (data.summary[0]) {
          sessionStorage.setItem("currentChapterName", data.summary[0].chapterName);
          sessionStorage.setItem("currentEbookPath", data.summary[0].ebookPath || "");
          sessionStorage.setItem("chapterId", data.summary[0].chapterID?.toString() || "");
          console.log("Stored first chapter data:", data.summary[0].chapterName);
        }
        
        // Store data in session storage only (not in URL)
        sessionStorage.setItem("selectedSubject", selectedOption.subjectName || "");
        sessionStorage.setItem("selectedChapter", data.summary[0]?.chapterName || "");
        if (data.summary[0]?.ebookPath) {
          sessionStorage.setItem("selectedEbookPath", data.summary[0].ebookPath);
        }
        
        // Trigger chapter change handler to bind dropdown and load PDF
        setTimeout(() => {
          console.log("Triggering chapter change handler for first chapter");
          handleChapterChange("1");
        }, 100);
        
        console.log("Updated URL and stored chapter data, chapters should now be visible");
      } else {
        console.log("No chapters found in response:", data);
        setChapterOptions([]);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      // Always reset loading state
      setIsLoadingChapters(false);
      setIsDropdownLoading(false);
      console.log("BookReader: Finished loading chapters, isLoadingChapters set to false");
      
      // Reset class-subject change flag after a delay to allow panel toggles to work normally again
      setTimeout(() => {
        setHasClassSubjectChanged(false);
        console.log("BookReader: Reset class-subject change flag to false");
      }, 200);
    }
  };

// In BookReaderPage.tsx, update the handleChapterChange function
const handleChapterChange = (value: string) => {
  console.log("BookReader: handleChapterChange called with value:", value);
  
  // Clear the stored content state when chapter actually changes
  setCurrentContentState(null);
  console.log("BookReader: Cleared stored content state due to chapter change");
  
  // Clear resources immediately when changing chapters
  const event = new CustomEvent('clearResources');
  window.dispatchEvent(event);
  
  setChapterSelection(value);
  setChapterChangeTime(Date.now());
  
  // Reset resource type to All when chapter changes
  setResetResourceType(true);
  
  // Auto-fetch resources if any Teacher Tools panel is open
  if (showResources || showAssessments || showLessonPlans) {
    console.log("BookReader: Auto-fetching resources due to chapter change with panel open");
    // Add a small delay to ensure state updates before fetching
    setTimeout(() => {
      const fetchEvent = new CustomEvent('refetchResources', { 
        detail: { 
          chapterId: value,
          forceRefresh: true  // Add flag to force refresh
        } 
      });
      window.dispatchEvent(fetchEvent);
    }, 100);
  }
};

  // const handleChapterChange = (value: string) => {
  //   console.log("BookReader: handleChapterChange called with value:", value);
  //   console.log("BookReader: Current chapterSelection before update:", chapterSelection);
  //   setChapterSelection(value);
  //   setChapterChangeTime(Date.now()); // Set timestamp for timing
  //   console.log("BookReader: Set chapterSelection to:", value);
    
  //   // Reset resource type to All when chapter changes
  //   setResetResourceType(true);
    
  //   // Auto-fetch resources if any Teacher Tools panel is open
  //   if (showResources || showAssessments || showLessonPlans) {
  //     console.log("BookReader: Auto-fetching resources due to chapter change with panel open");
  //     // Trigger resource fetch by setting a small timeout to ensure state updates first
  //     setTimeout(() => {
  //       // This will trigger the resource fetch in BookReader component
  //       const event = new CustomEvent('refetchResources', { detail: { chapterId: value } });
  //       window.dispatchEvent(event);
  //     }, 100);
  //   }
  // };

  // Handle fullscreen changes from BookReader
  const handleFullscreenChange = (fullscreen: boolean) => {
    console.log("BookReaderPage: handleFullscreenChange called with:", fullscreen);
    setIsFullscreen(fullscreen);
  };

  // Handle exiting fullscreen mode
  const handleExitFullscreen = () => {
    console.log("BookReaderPage: handleExitFullscreen called - setting isFullscreen to false");
    setIsFullscreen(false);
  };

  // Teacher Tools callback functions
  const handleToggleResources = () => {
    setShowResources(!showResources);
    setShowAssessments(false);
    setShowLessonPlans(false);
    // Only set selectedType if not in the middle of a class-subject change
    if (!hasClassSubjectChanged) {
      setSelectedType("1");
      setResetResourceType(true);
    }
  };

  const handleToggleAssessments = () => {
    setShowAssessments(!showAssessments);
    setShowResources(false);
    setShowLessonPlans(false);
    // Only set selectedType if not in the middle of a class-subject change
    if (!hasClassSubjectChanged) {
      setSelectedType("2");
      setResetResourceType(true);
    }
  };

  const handleToggleLessonPlans = () => {
    setShowLessonPlans(!showLessonPlans);
    setShowResources(false);
    setShowAssessments(false);
    // Only set selectedType if not in the middle of a class-subject change
    if (!hasClassSubjectChanged) {
      setSelectedType("3");
      setResetResourceType(true);
    }
  };

  const handleToggleResourceFloater = () => {
    console.log("BookReaderPage handleToggleResourceFloater called");
    console.log("Current isResourceFloaterOpen state:", isResourceFloaterOpen);
    console.trace("Stack trace for handleToggleResourceFloater call");
    setIsResourceFloaterOpen(!isResourceFloaterOpen);
  };

  const handleSetSelectedType = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-y-auto relative">
       {(!isFullscreen  && <div
        className={`relative z-[10000] transition-all duration-500 ease-in-out ${
          isHeaderCollapsed ? "-translate-y-16" : "translate-y-0"
        }`}
      >
        <Header
        isHeaderCollapsed={isHeaderCollapsed}
  onToggleHeader={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
          onLogout={handleLogout}
          role={userRole || "student"}
          showClassSubjectSelector={true}
          combinedSelection={combinedSelection}
          onCombinedChange={handleCombinedChange}
          combinedOptions={combinedOptions}
          showChapterSelector={true}
          chapterSelection={chapterSelection}
          onChapterChange={handleChapterChange}
          chapterOptions={chapterOptions}
          isFullscreen={isFullscreen}
          onExitFullscreen={handleExitFullscreen}
          isDropdownLoading={isDropdownLoading}
          // Teacher Tools props
          showResources={showResources}
          showAssessments={showAssessments}
          showLessonPlans={showLessonPlans}
          isResourceFloaterOpen={isResourceFloaterOpen}
          onToggleResources={handleToggleResources}
          onToggleAssessments={handleToggleAssessments}
          onToggleLessonPlans={handleToggleLessonPlans}
          onToggleResourceFloater={handleToggleResourceFloater}
          onSetSelectedType={handleSetSelectedType}
          selectedType={selectedType}
        />
      </div>
       )}

      {/* Header Toggle Button - Same for both modes */}
{/* {(isFullscreen || !isFullscreen) && (
  <div className="relative">
    <div className={`fixed left-1/2 -translate-x-1/2 z-[99999] transition-all duration-300 pointer-events-auto ${
      isHeaderCollapsed ? 'top-0' : 'top-16'
    }`}>
      <Button
        onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
        className="h-10 px-6 rounded-b-lg rounded-t-none shadow-lg bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
        aria-label={isHeaderCollapsed ? "Show header" : "Hide header"}
        title={isHeaderCollapsed ? "Show header" : "Hide header"}
      >
        {isHeaderCollapsed ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </Button>
    </div>
  </div>
)} */}

      <div className={`flex-1 flex flex-col border rounded  transition-all duration-500 ease-in-out  ${
          isHeaderCollapsed ? "-translate-y-16" : "translate-y-0"
        }` }>
        {/* Loading Overlay */}
    
        {/* Optional: show chapter title above reader */}

        <BookReader
          subject={subjectTitle}
          onClose={() => navigate(-1)}
          selectedChapter={chapterSelection}
          ebookPath={ebookPath}
          onFullscreenChange={handleFullscreenChange}
          userRole={userRole}
          combinedSelection={combinedSelection}
          onCombinedChange={handleCombinedChange}
          combinedOptions={combinedOptions}
          onChapterChange={handleChapterChange}
          chapterOptions={chapterOptions}
          isFullscreen={isFullscreen}
          isHeaderVisible={!isHeaderCollapsed}
          // Teacher Tools props
          showResources={showResources}
          showAssessments={showAssessments}
          showLessonPlans={showLessonPlans}
          isResourceFloaterOpen={isResourceFloaterOpen}
          onToggleResources={handleToggleResources}
          onToggleAssessments={handleToggleAssessments}
          onToggleLessonPlans={handleToggleLessonPlans}
          onToggleResourceFloater={handleToggleResourceFloater}
          onSetSelectedType={handleSetSelectedType}
          selectedType={selectedType}
          resetResourceType={resetResourceType}
        />
      </div>
      <Footer className="mt-auto" />
    </div>
    
  );
};

export default BookReaderPage;
