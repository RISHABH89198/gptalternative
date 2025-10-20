import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette, Sun, Moon, Film, Sparkles, Mountain, Coffee, MonitorUp, Zap } from "lucide-react";

interface ColorGradingProps {
  onApplyGrading: (gradingType: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const gradingPresets = [
  {
    id: "cinematic",
    name: "Cinematic",
    icon: Film,
    description: "Hollywood movie look with rich colors",
    prompt: "Apply professional cinematic color grading with deep shadows, rich highlights, warm skin tones, and film-like quality. Create a Hollywood blockbuster aesthetic with enhanced contrast and saturation."
  },
  {
    id: "warm",
    name: "Warm Sunset",
    icon: Sun,
    description: "Golden hour warmth",
    prompt: "Apply warm sunset color grading with golden hour lighting, orange and yellow tones, soft warm glow, enhanced warmth in highlights, and dreamy sunset atmosphere."
  },
  {
    id: "cool",
    name: "Cool Mood",
    icon: Moon,
    description: "Cool blue tones",
    prompt: "Apply cool moody color grading with blue and teal tones, dramatic shadows, cinematic look, reduced warmth, and atmospheric cool palette."
  },
  {
    id: "vintage",
    name: "Vintage Film",
    icon: Coffee,
    description: "Classic retro film look",
    prompt: "Apply vintage film color grading with faded colors, warm nostalgic tones, slight grain texture, retro aesthetic, reduced saturation, and classic film photography look."
  },
  {
    id: "vibrant",
    name: "Vibrant Pop",
    icon: Sparkles,
    description: "Punchy vivid colors",
    prompt: "Apply vibrant pop color grading with boosted saturation, punchy colors, enhanced vibrancy, bright and energetic palette, increased clarity and sharpness."
  },
  {
    id: "natural",
    name: "Natural HDR",
    icon: Mountain,
    description: "Enhanced natural look",
    prompt: "Apply natural HDR color grading with balanced exposure, enhanced dynamic range, natural color reproduction, perfect white balance, and professional landscape photography look."
  },
  {
    id: "4k-hdr",
    name: "4K HDR Ultra",
    icon: MonitorUp,
    description: "Maximum quality enhancement",
    prompt: "Enhance to 4K HDR quality with ultra-high definition details, maximum sharpness, professional color depth, expanded dynamic range, perfect clarity, enhanced texture details, and cinematic 4K resolution quality."
  },
  {
    id: "ultra-sharp",
    name: "Ultra Sharp",
    icon: Zap,
    description: "Crystal clear enhancement",
    prompt: "Apply ultra-sharp enhancement with maximum detail clarity, professional sharpening, enhanced edge definition, crystal clear focus, texture enhancement, and high-definition quality improvement."
  }
];

export const ColorGrading = ({ onApplyGrading, isLoading, disabled }: ColorGradingProps) => {
  return (
    <Card className="glass p-6 space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
          <Palette className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Color Grading</h2>
          <p className="text-sm text-muted-foreground">
            One-click professional color grading presets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gradingPresets.map((preset) => {
          const Icon = preset.icon;
          return (
            <Button
              key={preset.id}
              onClick={() => onApplyGrading(preset.prompt)}
              disabled={disabled || isLoading}
              variant="outline"
              className="h-auto flex-col gap-2 p-4 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <Icon className="h-6 w-6 text-primary" />
              <div className="text-center">
                <div className="font-semibold text-sm">{preset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Click any preset to apply professional color grading to your image
      </p>
    </Card>
  );
};