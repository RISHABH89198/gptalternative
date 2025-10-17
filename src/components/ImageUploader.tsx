import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImagesSelect: (files: File[]) => void;
  selectedImages: File[];
  onClear: (index: number) => void;
}

export const ImageUploader = ({ onImagesSelect, selectedImages, onClear }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      onImagesSelect(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onImagesSelect(files);
    }
    // Reset input so same file can be selected again
    if (e.target) e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {selectedImages.length === 0 ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            glass cursor-pointer rounded-2xl p-12 text-center transition-all duration-300
            hover:bg-card/80 hover:border-primary/50
            ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-gradient-primary p-4 shadow-glow">
              <Upload className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Images</h3>
              <p className="text-muted-foreground">
                Drag & drop or click to select up to 4 images
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="glass rounded-2xl p-4 relative">
                <Button
                  onClick={() => onClear(index)}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 shadow-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Selected ${index + 1}`}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            ))}
          </div>
          {selectedImages.length < 4 && (
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                glass cursor-pointer rounded-2xl p-8 text-center transition-all duration-300
                hover:bg-card/80 hover:border-primary/50
                ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : ''}
              `}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Add more images ({selectedImages.length}/4)
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
