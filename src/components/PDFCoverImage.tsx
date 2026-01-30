import { useEffect, useRef, useState } from 'react';

interface PDFCoverImageProps {
  pdfUrl: string;
  className?: string;
  alt?: string;
  fallbackImage?: string;
}

const PDFCoverImage: React.FC<PDFCoverImageProps> = ({ 
  pdfUrl, 
  className = '', 
  alt = 'PDF Cover',
  fallbackImage 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!pdfUrl || !canvasRef.current) return;

    const renderPDFCover = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        setUseFallback(false);

        // Load PDF.js from CDN if not already loaded
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // Set worker source
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        // Load PDF document
        const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        // Get first page
        const page = await pdf.getPage(1);

        // Create canvas
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        // Set canvas dimensions (aspect ratio 4/5 like the original image container)
        const containerWidth = 400;
        const containerHeight = 500;
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Calculate scale to fit the page in the canvas
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          containerWidth / viewport.width,
          containerHeight / viewport.height
        );
        const scaledViewport = page.getViewport({ scale });

        // Render PDF page
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;

        setIsLoading(false);
        console.log(`PDF cover rendered successfully for: ${pdfUrl}`);

      } catch (error) {
        console.error(`Failed to render PDF cover for ${pdfUrl}:`, error);
        setIsLoading(false);
        setHasError(true);
        
        // Use fallback image if available and PDF rendering fails
        if (fallbackImage) {
          setUseFallback(true);
        }
      }
    };

    renderPDFCover();
  }, [pdfUrl, fallbackImage]);

  // If we should use fallback image, render img tag
  if (useFallback && fallbackImage) {
    return (
      <img
        src={fallbackImage}
        alt={alt}
        className={className}
        onLoad={() => console.log(`Fallback image loaded for: ${alt}`)}
        onError={(e) => {
          console.error(`Fallback image failed to load for: ${alt}`, e);
          setHasError(true);
        }}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-gray-500 text-sm">Loading cover...</div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-gray-500 text-sm text-center">Cover not available</div>
      </div>
    );
  }

  // Render canvas with PDF
  return <canvas ref={canvasRef} className={className} />;
};

export default PDFCoverImage;
