import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Star, List, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { getApiBaseUrl } from '@/utils/config';
import oxfordIgniteCover from "@/assets/oxford-ignite-cover.jpg";
import { toast } from "react-hot-toast";
import Footer from "@/components/Footer";

// Utility function to truncate text
const truncateText = (text: string, maxLength: number = 25): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

interface Chapter {
  className: string;
  subjectName: string;
  chapterName: string;
  planClassId: number;
  customID: number;
  chapterID?: number; // Add chapterID as optional
  ebookPath: string;
  coverImage?: string;
  id?: string;
  title?: string;
}

interface CombinedOption {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  planClassId: string;
  label: string;
}

const ChaptersPage = () => {
  const navigate = useNavigate();
  
  // State for class/subject data and selections
  const [combinedOptions, setCombinedOptions] = useState<CombinedOption[]>([]);
  const [planClassId, setPlanClassId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
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
  
  // Get values from sessionStorage
  const userId = sessionStorage.getItem("userID") || "";
  const initialClass = sessionStorage.getItem("selectedClass") || "";
  const initialSubject = sessionStorage.getItem("selectedSubject") || "";

  // State for selections
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [combinedSelection, setCombinedSelection] = useState<string>("");
  const [chapterData, setChapterData] = useState<Chapter[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // Fetch class and subject data when component mounts
  useEffect(() => {
    const fetchClassSubjects = async () => {
      try {
        console.log("Fetching class subjects with userId:", userId);
        const token = sessionStorage.getItem("authToken");
const headers: HeadersInit = {
          "Authorization": `Bearer ${token}`,
        };
        if (!token) {
          console.error("No auth token found in sessionStorage");
          toast.error("Authentication required. Please log in again.");
          return;
        }

        console.log("Class-subjects auth token from sessionStorage:", token);
        console.log("Class-subjects request headers:", headers);

        // Check login response for terms and password conditions
       
        const apiBaseUrl = await getApiBaseUrl();
        const response = await fetch(
          `${apiBaseUrl}/class-subjects?userId=${encodeURIComponent(
            userId
          )}&planClassID=0`,
          {
            headers,
          }
        );

      if (!response.ok) {
        const error = await response.text();
        console.error("Error response:", error);
        throw new Error("Failed to fetch class subjects");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // If the API returns summary array
      if (data.summary && data.summary.length > 0) {
        // Store subjects data in session storage for dynamic path construction
        sessionStorage.setItem("subjectsForReader", JSON.stringify(data.summary));
        
        const options = data.summary.map((item: any, index: number) => ({
          id: `option-${index}`,
          classId: item.classID.toString(),
          className: item.className,
          subjectId: item.subjectID.toString(),
          subjectName: item.subjectName,
          planClassId: item.planClassId.toString(),
          label: `${item.className} - ${item.subjectName}`,
        }));

        setCombinedOptions(options);

        // Always default to Beginner-2023 - English if available, else first option
        if (options.length > 0) {
          const selectedOption =
            options.find(
              (opt) => opt.className === "Beginner-2023" && opt.subjectName === "English"
            ) || options[0];

          // Update state
          setCombinedSelection(selectedOption.id);
          setSelectedClass(selectedOption.classId);
          setSelectedSubject(selectedOption.subjectId);
          const planId = parseInt(selectedOption.planClassId) || 0;
          setPlanClassId(planId);

          // Update session storage
          sessionStorage.setItem("selectedClass", selectedOption.classId);
          sessionStorage.setItem("selectedSubject", selectedOption.subjectId);
          sessionStorage.setItem("planClassId", selectedOption.planClassId);
          sessionStorage.setItem("selectedClassName", selectedOption.className);
          sessionStorage.setItem("selectedSubjectName", selectedOption.subjectName);
        }
      }
    } catch (error) {
      console.error("Error fetching class subjects:", error);
      toast.error("Failed to load class subjects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userId) {
    fetchClassSubjects();
  }
}, [userId]);


  // Fetch chapters when selection changes
  useEffect(() => {
    const fetchChapters = async () => {
      if (!userId || !planClassId) return;

      try {
        setIsLoading(true); // Start loading
        setChapterData([]); // Clear existing data
        
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found in sessionStorage");
          toast.error("Authentication required. Please log in again.");
          setChapterData([]);
          setIsLoading(false); // Stop loading on error
          return;
        }

        const headers: HeadersInit = {
          "Authorization": `Bearer ${token}`,
        };

        console.log("Chapters auth token from sessionStorage:", token);
        console.log("Chapters request headers:", headers);

        const apiBaseUrl = await getApiBaseUrl();
        const response = await fetch(
          `${apiBaseUrl}/class-subjects/chapters?userId=${encodeURIComponent(
            userId
          )}&planClassId=${planClassId}`,
          { headers }
        );
      
      if (!response.ok) {
        const error = await response.text();
        console.error("Chapters error response:", error);
        throw new Error("Failed to fetch chapters");
      }

      const data = await response.json();
      console.log("Chapters API Response:", data);
      console.log("API Response structure:", {
        isArray: Array.isArray(data),
        hasSummary: data?.summary,
        summaryLength: data?.summary?.length,
        hasChapters: data?.chapters,
        chaptersLength: data?.chapters?.length,
        allKeys: Object.keys(data)
      });
      
      // Debug: Check if coverImage data exists in API response
      if (data.summary && data.summary.length > 0) {
        data.summary.forEach((chapter: any, index: number) => {
          console.log(`API Chapter ${index + 1}:`, {
            chapterName: chapter.chapterName,
            coverImage: chapter.coverImage,
            coverImg: chapter.coverImg,
            cover: chapter.cover,
            ebookPath: chapter.ebookPath,
            allKeys: Object.keys(chapter)
          });
          
          // Print coverImage path if present
          if (chapter.coverImage) {
            console.log(`CoverImage path present for "${chapter.chapterName}": ${chapter.coverImage}`);
          } else {
            console.log(`No CoverImage path found for "${chapter.chapterName}"`);
          }
        });
      }

      // Support both { chapters: [...] } and direct array responses
      const rawChapters = Array.isArray(data)
        ? data
        : Array.isArray(data?.chapters)
        ? data.chapters
        : [];

      const selectedClassName = sessionStorage.getItem("selectedClassName") || "";
      const selectedSubjectName = sessionStorage.getItem("selectedSubjectName") || "";

      const filteredChapters = rawChapters.filter((chapter: any) => {
        return (
          chapter.className === selectedClassName &&
          chapter.subjectName === selectedSubjectName
        );
      });

      const formattedChapters: Chapter[] = filteredChapters.map((chapter: any) => ({
        ...chapter,
        // Only use coverImage field from API, no fallbacks
        coverImage: chapter.coverImage,
        id:
          chapter.customID?.toString() ||
          `chapter-${Math.random().toString(36).substr(2, 9)}`,
        title: chapter.chapterName,
      }));

      // Debug: Log cover image data for each chapter
      formattedChapters.forEach((chapter, index) => {
        console.log(`Chapter ${index + 1} - Name: ${chapter.chapterName}`);
        console.log(`  coverImage: ${chapter.coverImage}`);
        console.log(`  coverImg: ${(chapter as any).coverImg}`);
        console.log(`  cover: ${(chapter as any).cover}`);
        console.log(`  Final coverImage: ${chapter.coverImage}`);
      });

      console.log("Filtered and formatted chapters:", formattedChapters);
      setChapterData(formattedChapters);

      try {
        sessionStorage.setItem("chaptersForReader", JSON.stringify(formattedChapters));
      } catch (e) {
        console.error("Failed to store chapters in sessionStorage", e);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
      toast.error("Failed to load chapters. Please try again.");
      setChapterData([]);
    } finally {
      setIsLoading(false); // Always stop loading
    }
  };
  fetchChapters();
}, [userId, planClassId, selectedClass, selectedSubject]);


  const handleCombinedChange = (value: string) => {
    const selected = combinedOptions.find(opt => opt.id === value);
    
    if (selected) {
      setCombinedSelection(value);
      setSelectedClass(selected.classId);
      setSelectedSubject(selected.subjectId);
      const planId = parseInt(selected.planClassId) || 0;
      setPlanClassId(planId);
      
      // Update session storage
      sessionStorage.setItem("selectedClass", selected.classId);
      sessionStorage.setItem("selectedSubject", selected.subjectId);
      sessionStorage.setItem("planClassId", selected.planClassId);
      sessionStorage.setItem("selectedClassName", selected.className);
      sessionStorage.setItem("selectedSubjectName", selected.subjectName);
      
      // Clear previous chapters
      setChapterData([]);
    }
  };

  const handleChapterClick = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setIsOpening(true);

    // Find the full chapter object to get names and ebookPath
    const chapter = chapterData.find(
      (ch) => (ch.id || ch.customID?.toString()) === chapterId
    );

    const subjectName = chapter?.subjectName || sessionStorage.getItem("selectedSubjectName") || "";
    const chapterName = chapter?.chapterName || "";
    const ebookPath = chapter?.ebookPath || "";
    const coverImage = chapter?.coverImage || "";

    // Store the selected chapter details in session storage
    sessionStorage.setItem("selectedChapter", chapterId);
    sessionStorage.setItem("chapterId", chapterId); // Store chapterId for Learning Resources
    if (subjectName) sessionStorage.setItem("currentSubjectName", subjectName);
    if (chapterName) sessionStorage.setItem("currentChapterName", chapterName);
    if (ebookPath) sessionStorage.setItem("currentEbookPath", ebookPath);
    if (coverImage) sessionStorage.setItem("currentCoverImage", coverImage);

    // Store data in session storage only (not in URL)
    if (subjectName) sessionStorage.setItem("selectedSubject", subjectName);
    if (chapterName) sessionStorage.setItem("selectedChapter", chapterName);
    if (ebookPath) sessionStorage.setItem("selectedEbookPath", ebookPath);

    // Wait long enough to show realistic book opening animation
    // navigate(`/book-reader`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-muted/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentChapter = selectedChapter
    ? chapterData.find(
        (ch) => (ch.id || ch.customID?.toString()) === selectedChapter
      )
    : undefined;

  const currentChapterName = currentChapter?.chapterName || "Chapter";
  const currentSubjectName = currentChapter?.subjectName || "";

  return (
    <div className="min-h-screen w-full bg-muted/40 overflow-auto flex flex-col">
      <Header
        role="student"
        onLogout={handleLogout}
        showClassSubjectSelector={true}
        combinedSelection={combinedSelection}
        onCombinedChange={handleCombinedChange}
        combinedOptions={combinedOptions}
      />

      <AnimatePresence>
        {isOpening && selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{ perspective: "2000px" }}
            >
              {/* Left Page (Cover) */}
              <motion.div
                className="absolute w-[45vw] h-[70vh] origin-right"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                transition={{
                  duration: 1.4,
                  ease: [0.45, 0, 0.15, 1],
                  delay: 0.1,
                }}
              >
                {/* Front of left page (book cover) */}
                <div
                  className="absolute inset-0 backface-hidden rounded-l-lg shadow-2xl overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 p-12 flex flex-col items-center justify-center text-white">
                    <BookOpen className="w-32 h-32 mb-6 drop-shadow-lg" />
                    <h2 className="text-4xl font-bold text-center mb-3 drop-shadow-md">
                      {currentChapterName}
                    </h2>
                    <p className="text-xl opacity-90 drop-shadow-sm">
                      {currentSubjectName}
                    </p>
                  </div>
                  {/* Book spine shadow */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
                </div>

                {/* Back of left page */}
                <div
                  className="absolute inset-0 backface-hidden bg-gradient-to-br from-card to-muted rounded-l-lg shadow-inner p-12"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="space-y-4">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 0.3, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                        className="h-4 bg-foreground/10 rounded"
                        style={{ width: `${Math.random() * 25 + 75}%` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Page (Content) */}
              <motion.div
                className="absolute w-[45vw] h-[70vh] origin-left"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 0 }}
              >
                {/* Front of right page */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-card via-background to-muted/50 rounded-r-lg shadow-2xl p-12"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.3, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.04 }}
                        className="h-4 bg-foreground/10 rounded"
                        style={{ width: `${Math.random() * 30 + 70}%` }}
                      />
                    ))}
                  </motion.div>
                  {/* Page shadow on left edge */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-black/10" />
                </div>
              </motion.div>

              {/* Center spine/binding */}
              <div
                className="absolute w-3 h-[70vh] bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/50 to-muted-foreground/30 shadow-lg"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow:
                    "0 0 20px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.2)",
                }}
              />

              {/* Ambient shadow under book */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute w-[92vw] h-8 bg-black/40 blur-3xl"
                style={{ top: "calc(50% + 36vh)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="dashboard-main pb-24 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {chapterData.length > 0 ? (
              chapterData.map((chapter, index) => (
                <motion.div
                  key={chapter.id || `chapter-${index}`}
                  className="group cursor-pointer h-full relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    onClick={() => {
                      // Find the chapter index (dropdown value is index + 1)
                      const chapterIndex = index + 1;
                      
                      // Store chapter info in session storage
                      sessionStorage.setItem("selectedSubject", chapter.subjectName || '');
                      sessionStorage.setItem("selectedChapter", chapter.chapterName || '');
                      if (chapter.ebookPath) {
                        sessionStorage.setItem("selectedEbookPath", chapter.ebookPath);
                      }
                      
                      // CRITICAL: Set the dropdown value that Header expects
                      sessionStorage.setItem("chapterSelection", chapterIndex.toString());
                      
                      // Also store the actual chapterID for API calls
                      if (chapter.chapterID) {
                        sessionStorage.setItem("chapterId", chapter.chapterID.toString());
                      }
                      
                      // Store current chapter info for Header
                      sessionStorage.setItem("currentChapterName", chapter.chapterName || '');
                      sessionStorage.setItem("currentEbookPath", chapter.ebookPath || '');
                      sessionStorage.setItem("currentSubjectName", chapter.subjectName || '');
                      sessionStorage.setItem("currentClassName", chapter.className || '');
                      
                      console.log("ChaptersPage: Selected chapter", chapterIndex, ":", chapter.chapterName);
                      console.log("ChaptersPage: Stored chapterSelection:", chapterIndex);
                      console.log("ChaptersPage: Stored actual chapterID:", chapter.chapterID);
                      
                      navigate(`/book-reader`);
                    }}
                    className="relative h-full rounded-2xl overflow-visible bg-card border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col cursor-pointer"
                  >
                    <div className="absolute -right-1 top-4 bottom-4 w-3 pointer-events-none">
                      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-muted border-r border-t border-b border-border rounded-r-sm translate-x-[6px] opacity-70" />
                      <div className="absolute right-0 top-[2px] bottom-[2px] w-[3px] bg-muted border-r border-t border-b border-border rounded-r-sm translate-x-[4px] opacity-85" />
                      <div className="absolute right-0 top-[4px] bottom-[4px] w-[3px] bg-card border-r border-t border-b border-border/80 rounded-r-sm translate-x-[2px]" />
                    </div>

                    <div className="relative aspect-[4/6] overflow-hidden flex-shrink-0 rounded-t-2xl">
                      {chapter.coverImage ? (
                        <img
                          src={chapter.coverImage}
                          alt={chapter.chapterName || `Chapter ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onLoad={() => console.log(`Image loaded successfully for: ${chapter.chapterName}, src: ${chapter.coverImage}`)}
                          onError={(e) => {
                            console.error(`Image failed to load for: ${chapter.chapterName}, src: ${chapter.coverImage}`);
                            console.error('Error event:', e);
                            // No fallback - if coverImage fails to load, show no image
                          }}
                        />
                      ) : (
                        <img
                          src={oxfordIgniteCover}
                          alt={chapter.chapterName || `Chapter ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent transition-all duration-300" />

                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-white/30" />

                      <div className="absolute bottom-0 left-0 right-0 ">
                        <div className="flex items-center">
                          {/* <h3 className={`pl-1 font-semibold drop-shadow-lg leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-full bg-white text-sm md:text-base text-black`}>
                            {chapter.chapterName || `Chapter ${index + 1}`}
                          </h3> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-10 flex items-center justify-center min-h-[400px]">
                <p className="text-foreground text-center">
                  {isLoading ? 'Loading chapters...' : 
                   chapterData.length === 0 && planClassId ? 'No chapters available or No book found' : 
                   'No class subject chapters available for this login'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

        <Footer className="mt-auto" />
    </div>
  );
};

export default ChaptersPage;