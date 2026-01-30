import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  LogOut, 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  Video, 
  BookMarked, 
  GraduationCap,
  BarChart3,
  List,
  Info,
  Menu
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MobileSidebar from "./MobileSidebar";
import { getApiBaseUrl, getApiBaseUrlSync } from '@/utils/config';
import oxfordIgniteLogo from "@/assets/oxford-ignite-logo.png";

// Utility function to truncate text
const truncateText = (text: string, maxLength: number = 25): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

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

interface HeaderProps {
  onLogout?: () => void;
  isHeaderCollapsed?: boolean;
  onToggleHeader?: () => void;
  role?: "teacher" | "student";
  combinedSelection?: string;
  onCombinedChange?: (value: string) => void;
  combinedOptions?: CombinedOption[];
  showClassSubjectSelector?: boolean;
  chapterSelection?: string;
  onChapterChange?: (value: string) => void;
  chapterOptions?: Array<{ id: number; name: string }>;
  showChapterSelector?: boolean;
  isAgreeTermsAndCondition?: number;
  pageType?: "login" | "prelogin" | "default";
  isFullscreen?: boolean;
  onExitFullscreen?: () => void;
  isDropdownLoading?: boolean;
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
  onTeacherToolsClick?: (chapterId: string) => void;
}

const Header = ({ 
  onLogout, 
  isHeaderCollapsed = false,
  onToggleHeader = () => {},
  role = "student",  // Add default values for optional props
  combinedSelection = "",
  onCombinedChange = () => {},
  combinedOptions, 
  showClassSubjectSelector = false, 
  chapterSelection, 
  onChapterChange, 
  chapterOptions, 
  showChapterSelector = false,
  isAgreeTermsAndCondition,
  pageType = "default",
  isFullscreen = false,
  onExitFullscreen,
  isDropdownLoading = false,
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
  selectedType = "0",
  onTeacherToolsClick
}: HeaderProps) => {
  // Debug: Log isFullscreen prop changes
useEffect(() => {
  console.log("Header: isFullscreen prop changed to:", isFullscreen);
}, [isFullscreen]);

// Debug: Log Teacher Tools visibility conditions
useEffect(() => {
  console.log("Header Teacher Tools visibility check:", {
    pageType,
    role,
    shouldShow: pageType === "default" && role === "teacher"
  });
}, [pageType, role]);

// Debug: Log Teacher Tools props
useEffect(() => {
  
}, [showResources, showAssessments, showLessonPlans, isResourceFloaterOpen, onToggleResources, onToggleAssessments, onToggleLessonPlans, onToggleResourceFloater, onSetSelectedType]);

const navigate = useNavigate();
  const location = useLocation();
  const [userTypeName, setUserTypeName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [securityDetails, setSecurityDetails] = useState<string>("");
  const [localChapterOptions, setLocalChapterOptions] = useState<ChapterOption[]>([]);
  const [isLocalDropdownLoading, setIsLocalDropdownLoading] = useState<boolean>(false);
  const [shouldAutoSelect, setShouldAutoSelect] = useState(false);
  const [localPopoverOpen, setLocalPopoverOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isMobileTeacherToolsOpen, setIsMobileTeacherToolsOpen] = useState(false);
  const isDefaultImage = (imagePath: string | null | undefined): boolean => {
  if (!imagePath) return true;
  const defaultImages = ['profile.png', 'default.png', 'avatar.png'];
  return defaultImages.some(img => imagePath.toLowerCase().includes(img.toLowerCase()));
};

const getProfileImageUrl = (imagePath: string | null): string | null => {
  // Return null for empty string, single space, or null
  if (!imagePath || imagePath.trim() === '' || imagePath.trim() === ' ') {
    return null;
  }
  
  const trimmedPath = imagePath.trim();
  
  // Check for the exact base URL patterns without any additional path
  if (trimmedPath === 'https://oxford-uat.excelindia.com/OUPI_RootRepository' || 
      trimmedPath === 'https://oxford-uat.excelindia.com/OUPI_RootRepository/' ||
      trimmedPath === 'https://oxfordignite.co.in/OA_RootRepository' ||
      trimmedPath === 'https://oxfordignite.co.in/OA_RootRepository/') {
    return null;
  }
  
  // Check if the path ends with just the base repository (no actual image file)
  if (trimmedPath.endsWith('/OUPI_RootRepository') || 
      trimmedPath.endsWith('/OA_RootRepository') ||
      trimmedPath.endsWith('/OUPI_RootRepository/') ||
      trimmedPath.endsWith('/OA_RootRepository/')) {
    return null;
  }
  
  // If it's already a full URL, data URL, or blob URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:image') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // Get the base URL from config or fallback
  const baseUrl = getApiBaseUrlSync();
  console.log('Profile image base URL:', baseUrl, 'Image path:', imagePath);
  
  // If it's a Windows path, convert it to a URL
  if (imagePath.includes('\\')) {
    const url = `${baseUrl || ''}${imagePath.replace(/\\/g, '/')}`;
    console.log('Converted Windows path URL:', url);
    return url;
  }
  
  // If it starts with a forward slash, ensure we don't add an extra one
  if (imagePath.startsWith('/')) {
    const url = `${baseUrl || ''}${imagePath}`;
    console.log('Forward slash URL:', url);
    return url;
  }
  
  // Otherwise, assume it's a relative path and add the base URL
  const url = `${baseUrl || ''}/${imagePath}`;
  console.log('Relative path URL:', url);
  return url;
};  

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      setIsImageLoading(true);
      const userId = sessionStorage.getItem("userID");
      const token = sessionStorage.getItem("authToken");
      
      if (!userId || !token) {
        setIsImageLoading(false);
        return;
      }

      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(
        `${apiBaseUrl}/users/get-user-details/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('User profile data:', data); // Debug log
        
        // Set the profile image directly, let getProfileImageUrl handle the URL validation
        setProfileImage(data.photo1 || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfileImage(''); // Set empty to trigger fallback
    } finally {
      setIsImageLoading(false);
    }
  };

  fetchUserProfile();
}, []);
//   useEffect(() => {
//  const fetchUserProfile = async () => {
//   try {
//     setIsImageLoading(true);
//     const userId = sessionStorage.getItem("userID");
//     const token = sessionStorage.getItem("authToken");
    
//     if (!userId || !token) return;
//     const response = await fetch(
//       `${getApiBaseUrl()}/users/get-user-details/${userId}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     if (response.ok) {
//       const data = await response.json();
//     if (data.photo1) {
//   setProfileImage(data.photo1);
//   // Let the Avatar component handle the loading state
// }  else {
//         setProfileImage(''); // Set empty to trigger fallback
//         setIsImageLoading(false);
//       }
//     } else {
//       setProfileImage(''); // Set empty to trigger fallback
//       setIsImageLoading(false);
//     }
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     setProfileImage(''); // Set empty to trigger fallback
//     setIsImageLoading(false);
//   }
// };

//   // Check if we have the image in session storage
//   const savedImage = sessionStorage.getItem('userImage');
//   if (savedImage) {
//     setProfileImage(savedImage);
//   } else {
//     fetchUserProfile();
//   }
// }, []);

  useEffect(() => {
    const handleProfileImageUpdate = (event: CustomEvent) => {
      const newImageUrl = event.detail?.imageUrl;
      if (newImageUrl) {
        setProfileImage(newImageUrl);
        // If the new image is a blob URL, we don't need to update session storage
        // as it's already been updated in the ProfileSettings component
        if (!newImageUrl.startsWith('blob:')) {
          sessionStorage.setItem('profileImage', newImageUrl);
        }
      }
    };

    // Add event listener for profile image updates
    const eventListener = (e: Event) => handleProfileImageUpdate(e as CustomEvent);
    window.addEventListener('profileImageUpdated', eventListener as EventListener);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('profileImageUpdated', eventListener as EventListener);
    };
  }, []);

  // Sync local popover state with props
useEffect(() => {
  setLocalPopoverOpen(isResourceFloaterOpen || false);
}, [isResourceFloaterOpen]);

// Sync chapter options with props and clear when empty
useEffect(() => {
  if (chapterOptions && chapterOptions.length > 0) {
    setLocalChapterOptions(chapterOptions);
    setIsLocalDropdownLoading(false);
  } else {
    // Clear local chapter options when prop is empty (during loading)
    setLocalChapterOptions([]);
    setIsLocalDropdownLoading(true);
  }
}, [chapterOptions]);

// Handle popover open/close
const handlePopoverOpenChange = (open: boolean) => {
  setLocalPopoverOpen(open);
  if (open !== isResourceFloaterOpen) {
    onToggleResourceFloater?.();
  }
};
  const [lastPlanClassId, setLastPlanClassId] = useState<string | null>(null);
  const [defaultChapterName, setDefaultChapterName] = useState<string>(() => {
  return sessionStorage.getItem("currentChapterName");
});
  const [teachingDetails, setTeachingDetails] = useState<any[]>([]);
  const [isLoadingTeachingDetails, setIsLoadingTeachingDetails] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>({});
  const [isLoadingStudentDetails, setIsLoadingStudentDetails] = useState(false);
  
  // Fetch teaching details for teacher
  const fetchTeachingDetails = async () => {
    try {
      const userId = sessionStorage.getItem("userID");
      const token = sessionStorage.getItem("authToken");
      
      console.log("Teaching Details Debug - UserID:", userId);
      console.log("Teaching Details Debug - Token:", token ? "exists" : "missing");
      console.log("Teaching Details Debug - API Base URL:", await getApiBaseUrl());
      
      if (!userId || !token) {
        console.log("Teaching Details Debug - Missing credentials");
        return;
      }

      setIsLoadingTeachingDetails(true);
      const apiBaseUrl = await getApiBaseUrl();
      const apiUrl = `${apiBaseUrl}/teachers/${userId}`;
      console.log("Teaching Details Debug - API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Teaching Details Debug - API Response:", data);
      setTeachingDetails(data);
    } catch (error) {
      console.error("Error fetching teaching details:", error);
      setTeachingDetails([]);
    } finally {
      setIsLoadingTeachingDetails(false);
    }
  };

  // Group teaching details by class-section, then by subject
  const getGroupedTeachingDetails = () => {
    const grouped: { [key: string]: string[] } = {};
    teachingDetails.forEach((item: any) => {
      const classSection = `${item.className}-${item.sectionName}`;
      
      if (!grouped[classSection]) {
        grouped[classSection] = [];
      }
      
      // Add subject if not already in the array
      if (!grouped[classSection].includes(item.subjectName)) {
        grouped[classSection].push(item.subjectName);
      }
    });
    
    return grouped;
  };

  // Fetch student details for student
  const fetchStudentDetails = async () => {
    try {
      const userId = sessionStorage.getItem("userID");
      const token = sessionStorage.getItem("authToken");
      
      console.log("Student Details Debug - UserID:", userId);
      console.log("Student Details Debug - Token:", token ? "exists" : "missing");
      console.log("Student Details Debug - API Base URL:", await getApiBaseUrl());

      if (!userId || !token) {
        console.log("Student Details Debug - Missing credentials");
        return;
      }

      setIsLoadingStudentDetails(true);
      // Use teachers API for both teachers and students
      const apiBaseUrl = await getApiBaseUrl();
      const apiUrl = `${apiBaseUrl}/teachers/${userId}`;
      console.log("Student Details Debug - API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("Student Details Debug - Response Status:", response.status);
      console.log("Student Details Debug - Response OK:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Student Details Debug - API Response:", data);
      console.log("Student Details Debug - Response Type:", typeof data);
      console.log("Student Details Debug - Response Keys:", Object.keys(data));
      
      setStudentDetails(data);
    } catch (error) {
      console.error("Student Details Debug - Error:", error);
      setStudentDetails({});
    } finally {
      setIsLoadingStudentDetails(false);
    }
  };

  useEffect(() => {
    const storedUserType = sessionStorage.getItem("userTypeName");
    const storedFirstName = sessionStorage.getItem("firstName");
    const storedLastName = sessionStorage.getItem("lastName");
    const storedEmail = sessionStorage.getItem("email");
    const storedSecretQuestion = sessionStorage.getItem("secretQuestion");
    const storedChapterName = sessionStorage.getItem("currentChapterName");
    
    
    if (storedUserType) {
      setUserTypeName(storedUserType);
    }
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
    if (storedLastName) {
      setLastName(storedLastName);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedSecretQuestion) {
      setSecurityDetails(storedSecretQuestion);
    }
    if (storedChapterName) {
      setDefaultChapterName(storedChapterName);
    }
    
    // Fetch teaching details if user is a teacher, student details if user is a student
    if (storedUserType === "Teacher") {
      console.log("Header useEffect - User is Teacher, fetching teaching details");
      fetchTeachingDetails();
    } else if (storedUserType === "Student") {
      console.log("Header useEffect - User is Student, fetching student details");
      fetchStudentDetails();
    } else {
      console.log("Header useEffect - User is neither Teacher nor Student, skipping details fetch");
    }
  }, []);

  // Fetch chapters when class-subject changes
  const fetchChaptersForHeader = async (planClassId: string) => {
    try {
      const userId = sessionStorage.getItem("userID");
      const token = sessionStorage.getItem("authToken");
      
      
      if (!userId || !token) {
        console.error("Missing user authentication data in Header");
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

      console.log("Header API Response status:", response.status);
      
      if (!response.ok) {
        const error = await response.text();
        console.error("Header error fetching chapters:", error);
        return;
      }

      const data = await response.json();

      // Update chapter options from API response
      if (data && data.length > 0) {
        const mapped: ChapterOption[] = data.map((ch: any, index: number) => ({
          id: index + 1,
          name: ch.chapterName,
        }));
        setLocalChapterOptions(mapped);
        
        // Store in session storage for consistency
        sessionStorage.setItem("chaptersForReader", JSON.stringify(data));
        
        // Store first chapter data for immediate display
        if (data[0]) {
          sessionStorage.setItem("currentChapterName", data[0].chapterName);
          sessionStorage.setItem("currentEbookPath", data[0].ebookPath || "");
          sessionStorage.setItem("chapterId", data[0].chapterID?.toString() || "");
          
          // Store data in session storage only (not in URL)
          sessionStorage.setItem("selectedSubject", data[0].subjectName);
          sessionStorage.setItem("selectedChapter", data[0].chapterName);
          sessionStorage.setItem("selectedClass", data[0].className);
          
          // Store assetID in session storage for progress tracking
          if (data[0].assetID) {
            sessionStorage.setItem("courseAssetId", data[0].assetID.toString());
          }
          
          if (data[0].ebookPath) {
            sessionStorage.setItem("selectedEbookPath", data[0].ebookPath);
          }
          
          
          // Don't exit fullscreen mode when changing content - let user stay in fullscreen

          // Notify parent of the first chapter selection so BookReaderPage updates
          const firstChapterId = localChapterOptions[0]?.id.toString();
          if (firstChapterId && onChapterChange && !isFullscreen) {
            onChapterChange(firstChapterId);
          } else if (isFullscreen) {
          }
        }
      } else {
        setLocalChapterOptions([]);
      }
    } catch (error) {
      console.error("Header error fetching chapters:", error);
    }
  };

  // Handle chapter change to load ebookPath
  const handleChapterSelectionChange = (value: string) => {
    console.log("Header: Chapter changed to:", value);
    
    // Set loading state immediately
    setIsLocalDropdownLoading(true);
    
    // Get the selected chapter from local options
    const selectedChapter = localChapterOptions.find(ch => ch.id.toString() === value);
    if (selectedChapter) {
      
      // Get the full chapter data from sessionStorage to find ebookPath
      const storedChapters = sessionStorage.getItem("chaptersForReader");
      if (storedChapters) {
        try {
          const chaptersData = JSON.parse(storedChapters);
          console.log("Header: Stored chapters data:", chaptersData);
          const fullChapterData = chaptersData.find((ch: any) => ch.chapterName === selectedChapter.name);
          console.log("Header: Full chapter data found:", fullChapterData);
          
          if (fullChapterData) {
            console.log("Header: Found ebookPath:", fullChapterData.ebookPath);
            
            // Update session storage with new chapter data FIRST
            sessionStorage.setItem("chapterId", fullChapterData.chapterID?.toString() || "");
            sessionStorage.setItem("currentChapterName", fullChapterData.chapterName);
            sessionStorage.setItem("currentEbookPath", fullChapterData.ebookPath || "");
            
            // Call onChapterChange AFTER session storage update
            if (onChapterChange) {
              onChapterChange(value);
            }
             
            // Store data in session storage only (not in URL)
            sessionStorage.setItem("selectedSubject", fullChapterData.subjectName);
            sessionStorage.setItem("selectedChapter", fullChapterData.chapterName);
            sessionStorage.setItem("chapterSelection", value); // Store dropdown index for BookReader
            sessionStorage.setItem("selectedClass", fullChapterData.className);
            if (fullChapterData.ebookPath) {
              sessionStorage.setItem("selectedEbookPath", fullChapterData.ebookPath);
            }
            
            
            // Don't exit fullscreen mode when changing content - let user stay in fullscreen
          } else {
          }
        } catch (error) {
          console.error("Header: Error parsing stored chapters:", error);
        }
      } else {
        console.log("Header: No stored chapters found in sessionStorage");
      }
    } else {
      console.log("Header: Chapter not found in local options:", value);
    }
    
    // Clear loading state after processing
    setIsLocalDropdownLoading(false);
  };

  // Debug: Log chapterOptions when they change
  useEffect(() => {

    console.log("Chapter selector conditions:", { 
      showChapterSelector, 
      chapterSelection, 
      onChapterChange: !!onChapterChange, 
      chapterOptions: chapterOptions?.length || 0,
      localChapterOptions: localChapterOptions?.length || 0
    });
  }, [chapterOptions, localChapterOptions, showChapterSelector, chapterSelection, onChapterChange]);

  // Fetch chapters when class-subject selection changes
  useEffect(() => {
    if (combinedSelection && combinedOptions.length > 0) {
      const selectedOption = combinedOptions.find(opt => opt.id === combinedSelection);
      if (selectedOption && selectedOption.planClassId) {
        // Only fetch if this is a different planClassId than before
        if (selectedOption.planClassId !== lastPlanClassId) {
          
          // Store the current subject and class names
          sessionStorage.setItem("currentSubjectName", selectedOption.subjectName);
          sessionStorage.setItem("currentClassName", selectedOption.className);
          
          // Set flag to trigger auto-selection after chapters are loaded
          setShouldAutoSelect(true);
          setLastPlanClassId(selectedOption.planClassId);
          
          fetchChaptersForHeader(selectedOption.planClassId);
        } else {
          console.log("Header: Same planClassId, skipping fetch");
        }
      }
    }
  }, [combinedSelection, combinedOptions, lastPlanClassId]);

  // Auto-select first chapter when localChapterOptions are updated and shouldAutoSelect is true
  useEffect(() => {
    if (localChapterOptions.length > 0 && shouldAutoSelect) {
      const firstChapterId = localChapterOptions[0]?.id.toString();
      
      // Only auto-select if no chapter is currently selected
      if (!chapterSelection || chapterSelection === "") {
        handleChapterSelectionChange(firstChapterId || "1");
      }
      
      setShouldAutoSelect(false); // Reset flag after checking
    }
  }, [localChapterOptions, shouldAutoSelect, chapterSelection]);
  
  return (
    
    <header className="app-header h-20">
      <div className="flex items-center gap-3 ">
        {/* Mobile Sidebar Menu */}
        <MobileSidebar
          onLogout={onLogout}
          role={role}
          combinedSelection={combinedSelection}
          onCombinedChange={onCombinedChange}
          combinedOptions={combinedOptions}
          showClassSubjectSelector={showClassSubjectSelector}
        />
        
      <div 
  className={`header-brand ${location.pathname === "/" || location.pathname === "/prelogin" ? 'cursor-default' : 'cursor-pointer'}`} 
  onClick={async () => {
    // Don't navigate if on login or prelogin pages
    if (location.pathname === "/" || location.pathname === "/prelogin") {
      console.log("Logo clicked on login/prelogin page - staying on current page");
      return;
    }
    
    if (location.pathname === "/chapters") {
      navigate("/chapters");
    } else {
      // Otherwise navigate to chapters page
      navigate("/chapters");
    }
  }}
>
  <img src={oxfordIgniteLogo} alt="Oxford Ignite" className="h-11 w-auto" />
</div>
      </div>

      <div className="flex items-right gap-2 md:gap-4">
        {showClassSubjectSelector && combinedSelection && onCombinedChange && combinedOptions && (
          <Select value={combinedSelection} onValueChange={onCombinedChange}>
            <SelectTrigger className="flex w-[240px] bg-white dark:bg-white dark:text-black rounded-lg border-2 pointer-events-auto z-[99999]" data-radix-select-trigger>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <SelectValue placeholder="Select class and subject" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-white z-[99999] pointer-events-auto" data-radix-select-content>
              {combinedOptions.map((option) => (
                <SelectItem key={option.id} value={option.id} className="dark:text-black">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showChapterSelector && onChapterChange && (localChapterOptions.length > 0 || chapterOptions || isDropdownLoading || isLocalDropdownLoading) && (
          <Select value={(isLocalDropdownLoading || isDropdownLoading) ? "loading" : (chapterSelection || "")} onValueChange={handleChapterSelectionChange}>
            <SelectTrigger className="flex w-[240px] bg-white dark:bg-white dark:text-black rounded-lg border-2 pointer-events-auto z-[99999]" data-radix-select-trigger>
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                {(isLocalDropdownLoading || isDropdownLoading) ? (
                  <span className="text-muted-foreground">Loading chapters...</span>
                ) : (
                  <SelectValue placeholder="Select chapter" />
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-white z-[99999] pointer-events-auto" data-radix-select-content>
              {(isLocalDropdownLoading || isDropdownLoading) ? (
                <div className="p-3 text-center text-muted-foreground">
                  Loading chapters...
                </div>
              ) : localChapterOptions && localChapterOptions.length > 0 ? (
                localChapterOptions.map((chapter) => (
                  <div key={chapter.id} className="relative group w-full">
                    <SelectItem 
                      value={chapter.id.toString()} 
                      className="dark:text-black hover:bg-muted/50 transition-colors duration-200 w-full pr-8"
                      title={chapter.name}
                    >
                      <span className="truncate block">{truncateText(chapter.name, 25)}</span>
                    </SelectItem>
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999] max-w-xs">
                      <div className="truncate">{chapter.name}</div>
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                ))
              ) : chapterOptions && chapterOptions.length > 0 ? (
                chapterOptions.map((chapter) => (
                  <div key={chapter.id} className="relative group w-full">
                    <SelectItem 
                      value={chapter.id.toString()} 
                      className="dark:text-black hover:bg-muted/50 transition-colors duration-200 w-full pr-8"
                      title={chapter.name}
                    >
                      <span className="truncate block">{truncateText(chapter.name, 25)}</span>
                    </SelectItem>
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999] max-w-xs">
                      <div className="truncate">{chapter.name}</div>
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                ))
              ) : (
                <SelectItem value="no-chapters" disabled className="dark:text-black">
                  No chapters available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}

        {/* Teacher Tools buttons - positioned beside chapter dropdown */}
        {showChapterSelector && onChapterChange && (localChapterOptions.length > 0 || chapterOptions || isDropdownLoading || isLocalDropdownLoading) && (
          <>
            {/* Desktop View - Individual Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* Learning Resources Button - Available for both Teachers and Students */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showResources ? "default" : "outline"}
                    size="sm"
                    className={`h-9 px-3 rounded-lg border-2 ${showResources ? "bg-primary text-white" : "bg-white hover:bg-primary/100"}`}
                    onClick={() => {
                      onToggleResources?.();
                      onSetSelectedType?.("1");
                    }}
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learning Resources</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Assessments Button - Available for both Teachers and Students */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showAssessments ? "default" : "outline"}
                    size="sm"
                    className={`h-9 px-3 rounded-lg border-2 ${showAssessments ? "bg-primary text-white" : "bg-white hover:bg-primary/100"}`}
                    onClick={() => {
                      onToggleAssessments?.();
                      onSetSelectedType?.("2");
                    }}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assessments</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Lesson Plans Button - Only for Teachers */}
              {userTypeName === "Teacher" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showLessonPlans ? "default" : "outline"}
                      size="sm"
                      className={`h-9 px-3 rounded-lg border-2 ${showLessonPlans ? "bg-primary text-white" : "bg-white hover:bg-primary/100"}`}
                      onClick={() => {
                        onToggleLessonPlans?.();
                        onSetSelectedType?.("3");
                      }}
                    >
                      <BookMarked className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lesson Plans</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Mobile View - Teacher Tools Dropdown */}
            <div className="md:hidden">
              <DropdownMenu open={isMobileTeacherToolsOpen} onOpenChange={setIsMobileTeacherToolsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 rounded-lg border-2 bg-white hover:bg-primary/100"
                  >
                    <Menu className="w-4 h-4" />
                    <span className="ml-2 text-xs">Teacher Tools</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  {/* Learning Resources */}
                  <DropdownMenuItem 
                    className={`cursor-pointer ${showResources ? "bg-primary text-white" : ""}`}
                    onClick={() => {
                      onToggleResources?.();
                      onSetSelectedType?.("1");
                      setIsMobileTeacherToolsOpen(false);
                    }}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Learning Resources
                  </DropdownMenuItem>
                  
                  {/* Assessments */}
                  <DropdownMenuItem 
                    className={`cursor-pointer ${showAssessments ? "bg-primary text-white" : ""}`}
                    onClick={() => {
                      onToggleAssessments?.();
                      onSetSelectedType?.("2");
                      setIsMobileTeacherToolsOpen(false);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Assessments
                  </DropdownMenuItem>
                  
                  {/* Lesson Plans - Only for Teachers */}
                  {userTypeName === "Teacher" && (
                    <DropdownMenuItem 
                      className={`cursor-pointer ${showLessonPlans ? "bg-primary text-white" : ""}`}
                      onClick={() => {
                        onToggleLessonPlans?.();
                        onSetSelectedType?.("3");
                        setIsMobileTeacherToolsOpen(false);
                      }}
                    >
                      <BookMarked className="w-4 h-4 mr-2" />
                      Lesson Plans
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {/* Navigation Icons - Desktop only */}
        <div className="hidden md:flex items-center gap-2">
          {/* Show Reports button only on default pages (not login or prelogin) */}
          {pageType === "default" && isAgreeTermsAndCondition !== 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/reports-coming-soon")}
                  className="h-9 w-9 rounded-lg border-2"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reports</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Desktop User Dropdown - Hidden on Mobile and Login Page */}
        {pageType !== "login" && (
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex focus:outline-none">
<Avatar className="w-9 h-9 cursor-pointer hover:opacity-90 transition-opacity relative">  {isImageLoading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
    </div>
  )}
  <AvatarImage 
    src={getProfileImageUrl(profileImage) || ""}
    alt="Profile"
    onLoad={() => setIsImageLoading(false)}
    onError={() => {
      console.error('Failed to load small profile image');
      setIsImageLoading(false);
    }}
    className={`object-cover w-full h-full ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
  />
  {!isImageLoading && !getProfileImageUrl(profileImage) && (
    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
      {firstName?.[0]}{lastName?.[0] || 'U'}
    </AvatarFallback>
  )}
</Avatar>
</DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 bg-popover border-border p-0">
  <div className="p-4 text-center">
    <div className="flex justify-center mb-3">
<Avatar className="w-16 h-16 cursor-pointer hover:opacity-90 transition-opacity relative">  {isImageLoading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
    </div>
  )}
  <AvatarImage 
    src={getProfileImageUrl(profileImage) || ""}
    alt="Profile"
    onLoad={() => setIsImageLoading(false)}
    onError={() => {
      console.error('Failed to load small profile image');
      setIsImageLoading(false);
    }}
    className={`object-cover w-full h-full ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
  />
  {!isImageLoading && !getProfileImageUrl(profileImage) && (
    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
      {firstName?.[0]}{lastName?.[0] || 'U'}
    </AvatarFallback>
  )}
</Avatar>
    </div>
              <h3 className="font-semibold text-foreground mb-1">
                {firstName || "User"}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                {email || "No email available"}
              </p>
              <p className="text-xs text-muted-foreground">{userTypeName === "Teacher" ? "Teacher Account" : "Student Account"}</p>
                   
              {(userTypeName === "Teacher" || userTypeName === "Student") && (
                <div className="mt-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full text-xs h-8">
                        <Info className="w-3 h-3 mr-1.5" />
                        {userTypeName === "Teacher" ? "Teaching Details" : "Student Details"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-popover z-[100000]" align="center" side="bottom" sideOffset={5}>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-foreground">
                            {userTypeName === "Teacher" ? "Teaching Details" : "Student Details"}
                          </h4>
                          {userTypeName === "Teacher" ? (
                            <>
                              {isLoadingTeachingDetails ? (
                                <div className="text-xs text-muted-foreground text-center py-2">
                                  Loading teaching details...
                                </div>
                              ) : teachingDetails.length > 0 ? (
                                <div className="space-y-2 text-xs text-muted-foreground max-h-64 overflow-y-auto pr-2">
                                  {Object.entries(getGroupedTeachingDetails()).map(([classSection, subjects]) => (
                                    <div key={classSection}>
                                      <p className="font-medium text-foreground mb-1">{classSection}</p>
                                      <p className="pl-3">{subjects.join(", ")}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground text-center py-2">
                                  No teaching details available
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {isLoadingStudentDetails ? (
                                <div className="text-xs text-muted-foreground text-center py-2">
                                  Loading student details...
                                </div>
                              ) : Array.isArray(studentDetails) && studentDetails.length > 0 ? (
                                <div className="space-y-2 text-xs text-muted-foreground max-h-64 overflow-y-auto pr-2">
                                  {/* Format student details like teaching details - class-section + subjects */}
                                  {(() => {
                                    // Debug: Log the actual student details structure
                                    console.log("Student Details Debug - Raw Data:", studentDetails);
                                    console.log("Student Details Debug - Is Array:", Array.isArray(studentDetails));
                                    console.log("Student Details Debug - Length:", studentDetails.length);
                                    
                                    // Group student details by class-section, same as teaching details
                                    const grouped: { [key: string]: string[] } = {};
                                    studentDetails.forEach((item: any) => {
                                      const classSection = `${item.className}-${item.sectionName}`;
                                      
                                      if (!grouped[classSection]) {
                                        grouped[classSection] = [];
                                      }
                                      
                                      // Add subject if not already in the array
                                      if (!grouped[classSection].includes(item.subjectName)) {
                                        grouped[classSection].push(item.subjectName);
                                      }
                                    });
                                    
                                    console.log("Student Details Debug - Grouped Data:", grouped);
                                    
                                    return Object.entries(grouped).map(([classSection, subjects]) => (
                                      <div key={classSection}>
                                        <p className="font-medium text-foreground mb-1">{classSection}</p>
                                        <p className="pl-3">{subjects.join(", ")}</p>
                                      </div>
                                    ));
                                  })()}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground text-center py-2">
                                  No student details available
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            <DropdownMenuSeparator className="my-0" />
            <div className="p-2">
              {isAgreeTermsAndCondition !== 0 && (
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-muted rounded-md"
                  onClick={() => navigate("/profile-settings")}
                >
                  Profile Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-muted text-destructive rounded-md"
                onClick={onLogout}
              >
                Logout
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>
   {/* Add this condition to show/hide the toggle button */}
{!['/', '/prelogin', '/chapters', '/profile-settings'].includes(location.pathname) && (
  <div className={`fixed left-1/2 -translate-x-1/2 z-[99999] transition-all duration-300 pointer-events-auto ${
    isHeaderCollapsed ? 'top-16' : 'top-16'
  }`}>
    <Button
      onClick={onToggleHeader}
      className="h-10 px-6 rounded-b-lg rounded-t-none shadow-lg bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
      aria-label={isHeaderCollapsed ? "Show header" : "Hide header"}
      title={isHeaderCollapsed ? "Show header" : "Hide header"}
    >
      {isHeaderCollapsed ? (
        <ChevronUp className="w-5 h-5" />
      ) : (
        <ChevronDown className="w-5 h-5" />
      )}
    </Button>
  </div>
)}
    </header>
  );
};
export default Header;
