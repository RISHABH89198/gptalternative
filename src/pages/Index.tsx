import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { PromptInput } from "@/components/PromptInput";
import { GeneratedImage } from "@/components/GeneratedImage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

const Index = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagesSelect = (files: File[]) => {
    setSelectedImages(files);
    setGeneratedImageUrls([]);
  };

  const handleClearImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setGeneratedImageUrls([]);
  };

  const handleGenerate = async (prompt: string) => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image first");
      return;
    }

    setIsLoading(true);
    const urls: string[] = [];
    
    try {
      for (const image of selectedImages) {
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });

        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: {
            imageData: base64Image,
            prompt: prompt
          }
        });

        if (error) throw error;

        if (data?.imageUrl) {
          urls.push(data.imageUrl);
        } else {
          throw new Error("No image URL in response");
        }
      }

      setGeneratedImageUrls(urls);
      toast.success(`${urls.length} image(s) generated successfully!`);
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || "Failed to generate images");
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
            onImagesSelect={handleImagesSelect}
            selectedImages={selectedImages}
            onClear={handleClearImage}
          />

          {selectedImages.length > 0 && (
            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          )}

          {generatedImageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {generatedImageUrls.map((url, index) => (
                <GeneratedImage key={index} imageUrl={url} />
              ))}
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

export default Index;
