import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export const ImageUploader = ({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) => {
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
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {!selectedImage ? (
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
              <h3 className="text-xl font-semibold mb-2">Upload Your Image</h3>
              <p className="text-muted-foreground">
                Drag & drop or click to select an image
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="glass rounded-2xl p-4 relative">
          <Button
            onClick={onClear}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-full h-auto rounded-xl"
          />
        </div>
      )}
    </div>
  );
};
