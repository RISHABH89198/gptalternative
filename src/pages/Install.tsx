import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Smartphone, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="glass max-w-2xl w-full p-8 md:p-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-[var(--shadow-glow)]">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Install AI Image Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform your images anywhere, anytime with our PWA
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50">
            <Zap className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Works offline & loads instantly</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50">
            <Smartphone className="w-8 h-8 text-secondary mb-2" />
            <h3 className="font-semibold mb-1">Works Everywhere</h3>
            <p className="text-sm text-muted-foreground">iPhone, Android, Desktop</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50">
            <Download className="w-8 h-8 text-accent mb-2" />
            <h3 className="font-semibold mb-1">No App Store</h3>
            <p className="text-sm text-muted-foreground">Install directly from browser</p>
          </div>
        </div>

        <div className="space-y-4">
          {isInstallable ? (
            <Button 
              onClick={handleInstall}
              size="lg"
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5 mr-2" />
              Install Now
            </Button>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-center">
                <strong>Installation Steps:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>iPhone/iPad: Tap Share → Add to Home Screen</li>
                <li>Android: Tap menu (⋮) → Install App</li>
                <li>Desktop: Look for install icon in address bar</li>
              </ul>
            </div>
          )}

          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Continue in Browser
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Install;