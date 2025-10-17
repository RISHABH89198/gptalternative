import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratedImageProps {
  imageUrl: string;
}

export const GeneratedImage = ({ imageUrl }: GeneratedImageProps) => {
  const handleDownload = async () => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">
      <div className="glass rounded-2xl p-4 shadow-card">
        <img
          src={imageUrl}
          alt="Generated"
          className="w-full h-auto rounded-xl"
        />
      </div>
      <Button
        onClick={handleDownload}
        variant="outline"
        className="w-full h-12 text-base font-medium border-primary/50 hover:bg-primary/10"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Image
      </Button>
    </div>
  );
};
