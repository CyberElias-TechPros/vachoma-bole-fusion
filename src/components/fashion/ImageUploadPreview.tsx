
import React from "react";
import { X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface ImageUploadPreviewProps {
  images: File[];
  onRemove: (index: number) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ images, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {images.map((image, index) => (
        <div 
          key={`${image.name}-${index}`} 
          className="relative rounded-md overflow-hidden border border-border hover:shadow-md transition-all duration-200 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <AspectRatio ratio={1 / 1}>
            <img
              src={URL.createObjectURL(image)}
              alt={`Reference ${index + 1}`}
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </AspectRatio>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-80 hover:opacity-100"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 bg-background/70 text-xs p-1 text-center truncate">
            {image.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageUploadPreview;
