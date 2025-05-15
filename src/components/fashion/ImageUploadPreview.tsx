
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
        <div key={`${image.name}-${index}`} className="relative rounded-md overflow-hidden border">
          <AspectRatio ratio={1 / 1}>
            <img
              src={URL.createObjectURL(image)}
              alt={`Reference ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ImageUploadPreview;
