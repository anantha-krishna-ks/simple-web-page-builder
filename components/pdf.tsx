import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface PDFViewerProps {
  pdfPath?: string;
  className?: string;
  style?: React.CSSProperties;
  isFullscreen?: boolean;
  isHeaderVisible?: boolean;
  onFullscreenToggle?: () => void;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

// Helper function to check if content is HTML
const isHtmlContent = (path: string): boolean => {
  if (!path) return false;
  const lowerPath = path.toLowerCase();
  return (
    lowerPath.endsWith('.html') || 
    lowerPath.endsWith('.htm') || 
    lowerPath.includes('index.html') ||
    (path.startsWith('http') && !lowerPath.endsWith('.pdf')) ||
    path.startsWith('<') ||
    path.startsWith('<!DOCTYPE') ||
    path.includes('<html') ||
    path.includes('<body')
  );
};

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  pdfPath = '/oxfordignite/Maths_Grade4_Ch04.pdf', 
  className = '',
  style = {},
  isFullscreen = false,
  isHeaderVisible = true,
  onFullscreenToggle,
  initialPage = 1,
  onPageChange
}) => {
  // Clean HTML content to ensure it's properly formatted without duplication
  const cleanHtmlContent = (html: string): string => {
    if (!html) return '';
    
    // If it's a complete HTML document, extract just the body content
    let bodyContent = html;
    
    // Remove any existing HTML/HEAD/BODY tags if present
    bodyContent = bodyContent.replace(/<\/?(html|head|body)[^>]*>/gi, '');
    
    // Remove any doctype declarations
    bodyContent = bodyContent.replace(/<!DOCTYPE[^>]*>/i, '');
    
    // Remove any script tags for security
    bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Clean up any extra whitespace
    bodyContent = bodyContent.trim();
    
    // Get the fullscreen-specific styles
    const fullscreenStyles = isFullscreen ? 'max-height: calc(100vh - 120px) !important;' : '';
    
    // Create a clean, minimal HTML document
    return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: auto !important;
            ${fullscreenStyles}
          }
         body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            background: white !important;
            padding: 10px;
            max-width: none !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 !important;
          }
          * {
            margin: 0 !important;
            padding: 0 !important;
          }
          p, div, span, h1, h2, h3, h4, h5, h6 {
            margin-bottom: 8px !important;
          }
          img, video, iframe, table {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin-bottom: 10px !important;
          }
          * {
            box-sizing: border-box !important;
          }
        </style>
      </head>
      <body>${bodyContent}</body>
      </html>`;
  };

  // Check if the content is HTML or a URL at the top level
  const isHtml = isHtmlContent(pdfPath || '');
  const isUrl = (pdfPath?.startsWith('http') || pdfPath?.startsWith('/')) && !pdfPath?.toLowerCase().endsWith('.pdf');
  
  // Clean the HTML content if needed
  const processedHtml = useMemo(() => {
    return isHtml && pdfPath ? cleanHtmlContent(pdfPath) : '';
  }, [isHtml, pdfPath]);
  
  // Generate iframe source
  const iframeSrc = useMemo(() => {
    if (!pdfPath) return '';
    
    if (isHtml) {
      return `data:text/html;charset=utf-8,${encodeURIComponent(processedHtml)}`;
    } else if (isUrl) {
      return pdfPath;
    }
    return '';
  }, [pdfPath, isHtml, isUrl, processedHtml]);
  
  // All hooks must be called unconditionally at the top level
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [currentPdfPath, setCurrentPdfPath] = useState<string>('');
  const [isReloading, setIsReloading] = useState(false);
  const [elementValues, setElementValues] = useState<{[key: string]: string}>({});
  const observerRef = useRef<MutationObserver | null>(null);


  
  // Track if we've already made the initial GET request
  const initialLoadRef = useRef(false);
  
  // Function to fetch user progress (GET)
  const fetchUserProgress = async () => {
    if (initialLoadRef.current) return; // Only fetch once
    
    try {
      const userId = sessionStorage.getItem('userId') || '125797';
      const courseAssetId = sessionStorage.getItem('courseAssetId');
      
      if (!courseAssetId) {
        console.warn('courseAssetId not found in session storage');
        return;
      }
      
      // Make GET request to fetch progress
      const progressUrl = `${import.meta.env.VITE_API_BASE_URL}/api/UserProgress/search?userId=${encodeURIComponent(userId)}&courseAssetId=${encodeURIComponent(courseAssetId)}&csAssetId=0&isRecentBrowse=false&courseId=0`;
      
      const response = await fetch(progressUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch user progress');
      
      const progressData = await response.json();
      console.log('Fetched user progress:', progressData);
      
      // Store the fetched values
      if (progressData && progressData.length > 0) {
        const userProgress = progressData[0];
        if (userProgress.elementName && userProgress.elementValue) {
          setElementValues(prev => ({
            ...prev,
            [userProgress.elementName]: userProgress.elementValue
          }));
        }
      }
      
      initialLoadRef.current = true;
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // Function to update user progress (POST)
  const updateUserProgress = async (elementName: string, elementValue: string) => {
    try {
      // Don't update if values are empty or haven't changed
      if (!elementName || !elementValue || elementValues[elementName] === elementValue) {
        console.log('Skipping update - no change or empty values');
        return;
      }
      
      const userId = sessionStorage.getItem('userId') || '125797';
      const courseAssetId = sessionStorage.getItem('courseAssetId');
      
      if (!courseAssetId) {
        console.warn('courseAssetId not found in session storage');
        return;
      }
      
      // Update local state
      setElementValues(prev => ({
        ...prev,
        [elementName]: elementValue
      }));
      
      // Prepare update payload with actual values or defaults
      const updatePayload = {
        UserID: parseInt(userId, 10),
        CourseAssetID: parseInt(courseAssetId, 10),
        CSAssetID: 0,
        IsInsert: false,
        ElementName: elementName,
        ElementValue: elementValue,
        CourseId: 0,
        ScheduleUserDetailID: 0
      };
      
      console.log('Updating progress with:', updatePayload);
      
      // Update the progress
      const updateResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/UserProgress/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update progress');
      }
      
      console.log('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Track if we've already processed an update in this cycle
  const updateInProgressRef = useRef(false);
  
  // Function to handle style changes
  const handleStyleChanges = (mutations: MutationRecord[]) => {
    // Prevent multiple updates in the same cycle
    if (updateInProgressRef.current) return;
    updateInProgressRef.current = true;
    
    try {
      // Process mutations
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement;
          
          // Only process style/class changes
          if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
            const elementName = target.getAttribute('data-element-name');
            const elementValue = target.getAttribute('data-element-value');
            
            // Only update if we have both name and value
            if (elementName && elementValue) {
              // Use the values from the element's data attributes
              updateUserProgress(elementName, elementValue);
              return; // Exit after first valid update
            }
          }
        }
      }
    } finally {
      // Reset the flag in the next tick to allow future updates
      setTimeout(() => {
        updateInProgressRef.current = false;
      }, 0);
    }
  };
  
  // Refs for PDF rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedPdfPathRef = useRef<string>('');
  const currentRenderTask = useRef<any>(null);

  // For testing, use a known working PDF URL if local PDF fails
  const testPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

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

  // Update current page when initialPage prop changes (for fullscreen mode)
  useEffect(() => {
    if (pdfDocument) {
      console.log("PDFViewer: Updating page from initialPage prop:", initialPage);
      setCurrentPage(initialPage);
      renderPage(pdfDocument, initialPage, scale);
    }
  }, [initialPage, pdfDocument]);

  // Handle loading PDF or HTML content
  useEffect(() => {
    const loadPDF = async () => {
      // Skip PDF loading if the content is HTML
      if (isHtml || isUrl) {
        console.log('HTML/URL content detected, skipping PDF loading');
        setLoading(false);
        return;
      }
      
      // Skip if no PDF path is provided
      if (!pdfPath) {
        setLoading(false);
        return;
      }
      
      // Check if PDF path is empty or null
      if (!pdfPath || pdfPath.trim() === '') {
        console.log('No PDF path provided, showing blank page');
        setError(' ');
        setLoading(false);
        return;
      }
      
      // Ensure we're using HTTPS for PDF paths to avoid mixed content issues
      let normalizedPath = pdfPath;
      
      // If it's a relative path, prepend a slash if needed
      if (!pdfPath.startsWith('http')) {
        normalizedPath = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;
      } 
      // If it's HTTP, convert to HTTPS
      else if (pdfPath.startsWith('http://')) {
        normalizedPath = 'https' + pdfPath.substring(4);
      }
      
      // Check if this is the same PDF path to prevent unnecessary reload
      if (loadedPdfPathRef.current === normalizedPath && pdfDocument) {
        console.log('Same PDF path detected, skipping reload');
        return;
      }
      
      // Store the current path for download function and ref tracking
      setCurrentPdfPath(normalizedPath);
      loadedPdfPathRef.current = normalizedPath;
      
      try {
        setLoading(true);
        setError('');
        
        console.log('Attempting to load PDF from:', normalizedPath);
        
        // Load PDF.js from CDN
        if (!window.pdfjsLib) {
          console.log('Loading PDF.js from CDN...');
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = () => {
              console.log('PDF.js loaded successfully');
              resolve(undefined);
            };
            script.onerror = () => {
              console.error('Failed to load PDF.js');
              reject(new Error('Failed to load PDF.js'));
            };
            document.head.appendChild(script);
          });
        } else {
          console.log('PDF.js already loaded');
        }
        
        // Set worker source
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        console.log('Worker source set');
        
        // First, try to fetch the PDF to check if it exists
        console.log('Fetching PDF file...');
        let response = await fetch(normalizedPath);
        let pdfToLoad = normalizedPath;
        
        if (!response.ok) {
          console.log('Local PDF failed, trying test URL...');
          response = await fetch(testPdfUrl);
          if (!response.ok) {
            throw new Error(`Both PDFs failed. Local: ${normalizedPath} (${response.status}), Test: ${testPdfUrl}`);
          }
          pdfToLoad = testPdfUrl;
          console.log('Using test PDF URL instead');
        }
        
        console.log('PDF file exists, size:', response.headers.get('content-length'));
        
        // Load PDF document
        console.log('Loading PDF document...');
        const loadingTask = window.pdfjsLib.getDocument(pdfToLoad);
        const pdf = await loadingTask.promise;
        
        console.log('PDF loaded successfully, pages:', pdf.numPages);
        
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        
        // Render first page
        console.log('Rendering first page...');
        await renderPage(pdf, 1, scale);
        console.log('First page rendered successfully');
        
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(` `);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfPath, isHtml, isUrl]);

  // Track last rendered page and scale to prevent unnecessary re-renders
  const lastRenderRef = useRef({ page: 0, scale: 0 });

  // Re-render page when currentPage or scale changes
  useEffect(() => {
    if (!pdfDocument || isRendering || isHtml || isUrl) return;
    
    // Only re-render if page or scale has actually changed
    if (lastRenderRef.current.page === currentPage && 
        lastRenderRef.current.scale === scale) {
      return;
    }

    const renderCurrentPage = async () => {
      if (!pdfDocument || isRendering) return;
      
      try {
        setIsRendering(true);
        console.log('Rendering page', currentPage, 'at scale', scale);
        await renderPage(pdfDocument, currentPage, scale);
        // Update last rendered values
        lastRenderRef.current = { page: currentPage, scale };
      } catch (error) {
        console.error('Error rendering page:', error);
      } finally {
        setIsRendering(false);
      }
    };

    renderCurrentPage();
  }, [currentPage, scale, pdfDocument, isRendering, isHtml, isUrl]);

  // Set loading to false when component mounts for HTML content
  useEffect(() => {
    if (isHtml || isUrl) {
      setLoading(false);
    }
  }, [isHtml, isUrl]);

  const renderPage = async (pdf: any, pageNumber: number, currentScale: number) => {
    if (!canvasRef.current) {
      console.error('Canvas ref not available');
      return;
    }
    
    // Cancel any existing render operation
    if (currentRenderTask.current) {
      console.log('Cancelling previous render operation');
      currentRenderTask.current.cancel();
      currentRenderTask.current = null;
    }
    
    setIsRendering(true);
    
    try {
      console.log(`Rendering page ${pageNumber} at scale ${currentScale}`);
      const page = await pdf.getPage(pageNumber);
      console.log(`Page ${pageNumber} loaded, viewport:`, page.getViewport({ scale: currentScale }));
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Canvas context not available');
        return;
      }

      // Clear canvas before rendering new page
      context.clearRect(0, 0, canvas.width, canvas.height);
      console.log('Canvas cleared');

      // Calculate scaled dimensions
      const viewport = page.getViewport({ scale: currentScale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      // Store the render task so we can cancel it if needed
      currentRenderTask.current = page.render(renderContext);
      await currentRenderTask.current.promise;
      
      console.log(`Page ${pageNumber} rendered successfully`);
      
    } catch (err) {
      if (err instanceof Error && err.message.includes('cancelled')) {
        console.log('Render operation was cancelled');
        return;
      }
      console.error('Error rendering page:', err);
      setError(`Failed to render page ${pageNumber}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsRendering(false);
      currentRenderTask.current = null;
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || !pdfDocument) return;
    
    setCurrentPage(newPage);
    await renderPage(pdfDocument, newPage, scale);
    
    // Call the onPageChange callback if provided
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleZoom = async (newScale: number) => {
    const clampedScale = Math.max(0.5, Math.min(3.0, newScale));
    setScale(clampedScale);
    
    if (pdfDocument) {
      await renderPage(pdfDocument, currentPage, clampedScale);
    }
  };

  const handleDownload = () => {
    window.open(currentPdfPath, '_blank');
  };

  const goToPreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    handlePageChange(currentPage + 1);
  };


  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full w-full ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading EBook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Show error message when content fails to load
    return (
      <div className={`border rounded-lg bg-background-white flex flex-col relative ${isFullscreen ? 'fixed inset-0 z-50 border-0 rounded-none' : 'h-full'} ${className}`}>
        <div className={`flex-1 overflow-auto p-4 ${isFullscreen ? 'p-8' : ''}`}
          style={{
            maxHeight: isFullscreen ? 'calc(100vh - 120px)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 mb-2">Unable to load content</p>
            <p className="text-gray-600">The requested content could not be loaded.</p>
            {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        
        {/* Controls - Always Visible at Bottom */}
        <div className={`p-4 bg-background-white from-slate-50 to-slate-100 ${isFullscreen ? 'sticky bottom-0 z-10' : ''}`}>
          <div className="flex justify-center mb-2">
            <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm max-w-2xl">
<div className="flex items-center justify-center space-x-4  ">                {/* Page Navigation */}
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-md px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleZoom(scale - 0.25)}
                  disabled={scale <= 0.5}
                  className="h-7 w-7 p-0 hover:bg-blue-700 hover:text-white"
                >
                  <ZoomOut className="w-3 h-3" />
                </Button>
                
                <span className="text-sm text-slate-600 font-medium min-w-[45px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleZoom(scale + 0.25)}
                  disabled={scale >= 3.0}
                  className="h-7 w-7 p-0 hover:bg-blue-700 hover:text-white"
                >
                  <ZoomIn  className="w-3 h-3 " />
                </Button>


              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we're using HTTPS for iframe sources to avoid mixed content issues
  const getIframeSrc = (url: string) => {
    if (url.startsWith('http://')) {
      return 'https' + url.substring(4);
    }
    return url;
  };

  // Function to get the local path for Reader_Ignite_v1 content
  const getLocalReaderPath = (path: string) => {
    // If it's a full URL, extract the path after 'Reader_Ignite_v1/'
    const match = path.match(/Reader_Ignite_v1[\\/](.*)/);
    if (match) {
      // Use the direct path from the project root
      return `/src/Reader_Ignite_v1/${match[1].replace(/\\/g, '/')}`;
    }
    // If it's already a local path, ensure it uses forward slashes
    if (path.includes('Reader_Ignite_v1')) {
      return path.replace(/\\/g, '/');
    }
    // Otherwise, treat it as a relative path from Reader_Ignite_v1
    return `/src/Reader_Ignite_v1/${path.replace(/^[\\/]/, '')}`;
  };

  // Function to get the base URL for the iframe
  const getBaseUrl = (path: string) => {
    // For development, use the absolute path to the project
    if (import.meta.env.DEV) {
      return 'http://localhost:8080/src/Reader_Ignite_v1';
    }
    // For production, use the public URL
    return '/Reader_Ignite_v1';
  };

  // Render HTML content
  if (isHtml || isUrl) {
    let iframeSrc = '';
    let baseUrl = getBaseUrl(pdfPath);
    
    // Handle HTML content with Reader_Ignite_v1
    if (isHtml) {
      const relativePath = getLocalReaderPath(pdfPath).replace(/^.*?Reader_Ignite_v1[\\/]?/i, '');
      iframeSrc = `${baseUrl}/${relativePath}`;
    } else {
      // Only use the URL as-is if it's not HTML content
      iframeSrc = getIframeSrc(pdfPath);
    }
    
    return (
      <div 
        className={`bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full w-full'} ${className}`} 
        style={{
          ...style,
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
            </div>
          </div>
        )}
       
<div
          className="w-full h-full flex-1"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            overflow: 'hidden',
            padding: 0,
            margin: 0,
            backgroundColor: 'white',
            boxShadow: 'none'
          }}
        >
          <iframe 
            src={iframeSrc}
            className="border-0 w-full h-full"
            title="Ebook Content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'white',
              zIndex: 1
            }}
            onLoad={async (e) => {
              console.log('Iframe content loaded successfully');
              setLoading(false);
              setError('');
              setIframeLoaded(true);
              
              // Fetch user progress using courseAssetId from session storage
              try {
                const userId = sessionStorage.getItem('userId') || '125797';
                const courseAssetId = sessionStorage.getItem('courseAssetId');
                
                if (!courseAssetId) {
                  console.warn('courseAssetId not found in session storage');
                  return;
                }
                
                // First, fetch the user progress
                const progressUrl = `${import.meta.env.VITE_API_BASE_URL}/api/UserProgress/search?userId=${encodeURIComponent(userId)}&courseAssetId=${encodeURIComponent(courseAssetId)}&csAssetId=0&isRecentBrowse=false&courseId=0`;
                
                const response = await fetch(progressUrl, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                
                if (!response.ok) {
                  throw new Error('Failed to fetch user progress');
                }
                
                const progressData = await response.json();
                console.log('User progress data:', progressData);
                
                // Extract values from progress response or use defaults
                const userProgress = Array.isArray(progressData) ? progressData[0] : progressData;
                
                // Prepare update payload with values from the response or use defaults
                const updatePayload = {
                  UserID: parseInt(userId, 10),
                  CourseAssetID: parseInt(courseAssetId, 10),
                  CSAssetID: userProgress?.csAssetID || 0,
                  IsInsert: userProgress?.isInsert || false,
                  ElementName: userProgress?.elementName || '',
                  ElementValue: userProgress?.elementValue || '',
                  CourseId: userProgress?.courseID || 0,
                  ScheduleUserDetailID: userProgress?.scheduleUserDetailID || 0
                };
                
                console.log('Updating progress with:', updatePayload);
                
                // Then update the progress
                const updateResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/UserProgress/update`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updatePayload)
                });
                
                if (!updateResponse.ok) {
                  throw new Error('Failed to update progress');
                }
                
                console.log('Progress fetched and updated successfully');
              } catch (error) {
                console.error('Error updating progress:', error);
              }
              
              // Get the iframe's document
              const iframe = e.target as HTMLIFrameElement;
              const iframeDoc = iframe.contentDocument || (iframe.contentWindow as any)?.document;
              
              if (!iframeDoc) return;
              
              // Make initial GET request for user progress
              fetchUserProgress();
              
              // Set up MutationObserver to track style changes
              if (observerRef.current) {
                observerRef.current.disconnect();
              }
              
              observerRef.current = new MutationObserver(handleStyleChanges);
              
              try {
                // Start observing the document with the configured parameters
                observerRef.current.observe(iframeDoc.documentElement, {
                  attributes: true,
                  attributeFilter: ['style', 'class'],
                  childList: true,
                  subtree: true,
                  attributeOldValue: true
                });
              } catch (error) {
                console.error('Error setting up MutationObserver:', error);
              }
              
              try {
                // Ensure viewport is set correctly
                let viewportMeta = iframeDoc.querySelector('meta[name="viewport"]');
                if (!viewportMeta) {
                  viewportMeta = iframeDoc.createElement('meta');
                  viewportMeta.setAttribute('name', 'viewport');
                  iframeDoc.head.prepend(viewportMeta);
                }
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes');
                
                // Remove any duplicate styles or scripts
                const existingStyles = iframeDoc.querySelectorAll('style');
                existingStyles.forEach((style, index) => {
                  // Keep only the first style tag (the one we added in cleanHtmlContent)
                  if (index > 0) style.remove();
                });
                
                // Ensure body takes full height and has no margin/padding
                const body = iframeDoc.body;
                if (body) {
                  body.style.margin = '0';
                  body.style.padding = '0';
                  body.style.width = '100%';
                  body.style.height = '100%';
                  body.style.overflow = 'auto';
                }
              } catch (e) {
                console.warn('Could not modify iframe content:', e);
              }
            }}
            onError={(e) => {
              console.error('Error loading iframe content:', e);
              setError('Failed to load content. Please check the URL and try again.');
              setLoading(false);
            }}
          />
        </div>
      </div>
    );
  }

  // Handle PDF content
  return (
    <div className={`bg-white flex flex-col relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} ${className}`} style={style}>
      {/* Content Area - Scrollable */}
      <div
        ref={containerRef}
        className={`flex-1 bg-white-50 ${isFullscreen ? 'fixed inset-0' : 'h-full'}`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-sm">Loading PDF...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* PDF Content */}
            <div className={`flex-1 ${isFullscreen ? 'pb-16' : ''}`}>
              <div className="flex items-center justify-center h-full p-4">
                <canvas
                  ref={canvasRef}
                  className="border shadow-lg"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              </div>
            </div>
            
            {!isHtml && (
              <div className={isFullscreen ? 'w-full flex justify-center' : 'bg-white/90 backdrop-blur-sm border-t border-gray-200'}>
                {isFullscreen ? (
                  // Fullscreen mode - Only show zoom controls
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 border mb-5 border-gray-200 shadow-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoom(scale - 0.25);
                      }}
                      disabled={scale <= 0.5}
                      className="h-10 w-10 p-0 hover:bg-blue-700 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                    
                    <span className="text-sm text-slate-600 font-medium min-w-[45px] text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoom(scale + 0.25);
                      }}
                      disabled={scale >= 3.0}
                      className="h-10 w-10 p-0 hover:bg-blue-700 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                    
                    {onFullscreenToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFullscreenToggle();
                        }}
                        className="h-10 w-10 p-0 hover:bg-blue-700 hover:text-white ml-1"
                        title="Exit Fullscreen"
                      >
                        <Minimize2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                ) : (
                  // Normal mode - Show all controls for PDF
                  <div className="w-full px-4 py-2">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-0">
                      {/* Page Navigation */}
                      <div className="flex items-center justify-center space-x-3 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={currentPage <= 1}
                          className="bg-white hover:bg-blue-700 hover:text-white border-slate-200"
                        >
                          <ChevronLeft className="w-4 h-3 mr-1" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center space-x-1 px-3 py-1 bg-white border border-slate-200 rounded-md">
                          <span className="text-sm text-slate-500 font-medium">
                            {currentPage} / {totalPages}
                          </span>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage >= totalPages}
                          className="bg-white hover:bg-blue-700 hover:text-white border-slate-200"
                        >
                          Next
                          <ChevronRight className="w-4 h-3 ml-1" />
                        </Button>

                              {/* Zoom Controls */}
                      <div className="flex items-center space-x-1 bg-white/80 rounded-lg p-1 border border-gray-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleZoom(scale - 0.25);
                          }}
                          disabled={scale <= 0.5}
                          className="h-8 w-8 p-0 hover:bg-blue-700 hover:text-white"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        
                        <span className="text-sm text-slate-600 font-medium min-w-[45px] text-center">
                          {Math.round(scale * 100)}%
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleZoom(scale + 0.25);
                          }}
                          disabled={scale >= 3.0}
                          className="h-8 w-8 p-0 hover:bg-blue-700 hover:text-white"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        
                        {onFullscreenToggle && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFullscreenToggle();
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-700 hover:text-white ml-1"
                            title="Enter Fullscreen"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
