import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { PromptInput } from "@/components/PromptInput";
import { GeneratedImage } from "@/components/GeneratedImage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setGeneratedImageUrl(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setGeneratedImageUrl(null);
  };

  const handleGenerate = async (prompt: string) => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: {
            imageData: base64Image,
            prompt: prompt
          }
        });

        if (error) throw error;

        if (data?.imageUrl) {
          setGeneratedImageUrl(data.imageUrl);
          toast.success("Image generated successfully!");
        } else {
          throw new Error("No image URL in response");
        }
      };

      reader.onerror = () => {
        throw new Error("Failed to read image file");
      };
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-primary p-3 shadow-glow">
              <Wand2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image and describe your vision. Watch as AI transforms it into something magical.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom duration-700">
          <ImageUploader
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClearImage}
          />

          {selectedImage && (
            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          )}

          {generatedImageUrl && (
            <GeneratedImage imageUrl={generatedImageUrl} />
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

export default Index;
