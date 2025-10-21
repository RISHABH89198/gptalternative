import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { GeneratedImage } from "@/components/GeneratedImage";
import { ColorGrading } from "@/components/ColorGrading";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Palette, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ColorGrade = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImagesSelect = (files: File[]) => {
    // Only allow 1 image for color grading
    setSelectedImages([files[0]]);
    setGeneratedImageUrl(null);
    
    // Create preview URL for original image
    if (files[0]) {
      const previewUrl = URL.createObjectURL(files[0]);
      setOriginalImageUrl(previewUrl);
    }
  };

  const handleClearImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setGeneratedImageUrl(null);
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
      setOriginalImageUrl(null);
    }
  };

  const handleGenerate = async (prompt: string) => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image first");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      // Convert all images to base64
      const base64Images = await Promise.all(
        selectedImages.map(image => 
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          })
        )
      );

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          images: base64Images,
          prompt: prompt
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        clearInterval(progressInterval);
        setProgress(100);
        setGeneratedImageUrl(data.imageUrl);
        toast.success("Color grading applied successfully!");
      } else {
        throw new Error("No image URL in response");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Generation error:', error);
      toast.error(error.message || "Failed to apply color grading");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Home Button */}
        <div className="flex justify-end">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-primary p-3 shadow-glow">
              <Palette className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Color Grade Your Image
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your image for colour grade. Choose from professional presets for instant enhancement.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom duration-700">
          <ImageUploader
            onImagesSelect={handleImagesSelect}
            selectedImages={selectedImages}
            onClear={handleClearImage}
            maxImages={1}
            singleImageText="Upload Your Image for Colour Grade"
          />

          {selectedImages.length > 0 && (
            <>
              {isLoading && (
                <div className="glass p-6 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Applying color grading...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    This may take 10-15 seconds. Please wait...
                  </p>
                </div>
              )}
              
              <ColorGrading 
                onApplyGrading={handleGenerate}
                isLoading={isLoading}
                disabled={selectedImages.length === 0}
              />
            </>
          )}

          {generatedImageUrl && originalImageUrl && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-center">Compare Results</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-center text-muted-foreground">Original</h3>
                  <div className="glass rounded-2xl p-4 shadow-card">
                    <img
                      src={originalImageUrl}
                      alt="Original"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </div>
                
                {/* Color Graded Image */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-center text-primary">Color Graded</h3>
                  <GeneratedImage imageUrl={generatedImageUrl} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8">
          Powered by Lovable AI
        </div>
      </div>
    </div>
  );
};

export default ColorGrade;
