import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResourceViewerProps {
  resource: {
    type: string;
    title: string;
    url: string;
  };
  onClose: () => void;
}

const ResourceViewer = ({ resource, onClose }: ResourceViewerProps) => {
  return (
<Card className="fixed top-0 left-0 right-0 z-50 mx-auto w-full max-w-7xl mt-4 mb-6 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {resource.type === "video" ? (
          <div className="aspect-video w-full">
            <iframe
              src={resource.url}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="h-[600px] w-full">
            <iframe
              src={resource.url}
              className="w-full h-full rounded-lg border border-border"
              title={resource.title}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceViewer;
