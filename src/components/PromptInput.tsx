import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput = ({ onGenerate, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="glass rounded-2xl p-6 space-y-4">
        <label className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Describe Your Vision
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Transform this into a cyberpunk style artwork with neon lights..."
          className="min-h-[120px] resize-none bg-muted/50 border-border focus:border-primary transition-colors"
          disabled={isLoading}
        />
      </div>
      
      <Button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 shadow-glow transition-all duration-300 hover:scale-[1.02]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Image
          </>
        )}
      </Button>
    </form>
  );
};
