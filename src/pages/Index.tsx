import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { PromptInput } from "@/components/PromptInput";
import { GeneratedImage } from "@/components/GeneratedImage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wand2, Download, Palette, History, LogOut, LogIn } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";


const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [promptValue, setPromptValue] = useState("");

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Check if there's a regenerate prompt from history
    if (location.state?.regeneratePrompt) {
      setPromptValue(location.state.regeneratePrompt);
      // Clear the state after setting
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleImagesSelect = (files: File[]) => {
    setSelectedImages(prev => {
      const newImages = [...prev, ...files];
      return newImages.slice(0, 4); // Max 4 images
    });
    setGeneratedImageUrl(null);
  };

  const handleClearImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setGeneratedImageUrl(null);
  };

  const handleGenerate = async (prompt: string) => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image first");
      return;
    }

    setIsLoading(true);
    
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
        setGeneratedImageUrl(data.imageUrl);
        toast.success("Image generated successfully!");

        // Save to history if user is logged in
        if (user) {
          const { error: saveError } = await supabase.from("image_history").insert({
            user_id: user.id,
            generated_image_url: data.imageUrl,
            prompt: prompt,
          });

          if (saveError) {
            console.error("Failed to save to history:", saveError);
          }
        }
      } else {
        throw new Error("No image URL in response");
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Buttons */}
        <div className="flex justify-end gap-2">
          <Link to="/color-grade">
            <Button variant="outline" size="sm" className="gap-2">
              <Palette className="h-4 w-4" />
              Color Grade
            </Button>
          </Link>
          {user && (
            <Link to="/history">
              <Button variant="outline" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                History
              </Button>
            </Link>
          )}
          <Link to="/install">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Install App
            </Button>
          </Link>
          {user ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>

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
            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} initialPrompt={promptValue} />
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
