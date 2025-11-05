import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Trash2, ArrowLeft, RefreshCw, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ImageHistory {
  id: string;
  original_image_url: string | null;
  generated_image_url: string;
  prompt: string;
  created_at: string;
}

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ImageHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editPrompt, setEditPrompt] = useState("");
  const [selectedItem, setSelectedItem] = useState<ImageHistory | null>(null);

  useEffect(() => {
    checkAuth();
    fetchHistory();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("image_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load history");
    } else {
      setHistory(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("image_history")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted successfully");
      setHistory(history.filter((item) => item.id !== id));
    }
  };

  const handleRegenerate = (item: ImageHistory) => {
    const cleanPrompt = item.prompt.replace(/^Color Grade: /, "");
    
    if (item.original_image_url) {
      // It's a color grade, navigate to color-grade page
      navigate("/color-grade", { state: { regeneratePrompt: cleanPrompt } });
    } else {
      // It's a regular generation, navigate to index page
      navigate("/", { state: { regeneratePrompt: cleanPrompt } });
    }
  };

  const handleEditRegenerate = () => {
    if (!selectedItem || !editPrompt.trim()) return;

    if (selectedItem.original_image_url) {
      navigate("/color-grade", { state: { regeneratePrompt: editPrompt } });
    } else {
      navigate("/", { state: { regeneratePrompt: editPrompt } });
    }
  };

  const openEditDialog = (item: ImageHistory) => {
    setSelectedItem(item);
    setEditPrompt(item.prompt.replace(/^Color Grade: /, ""));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <HistoryIcon className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Your Image History</h1>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No images generated yet. Start creating!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div key={item.id} className="glass rounded-2xl p-4 space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={item.generated_image_url}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.prompt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRegenerate(item)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Prompt</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          placeholder="Modify your prompt..."
                          className="min-h-[120px]"
                        />
                        <Button
                          onClick={handleEditRegenerate}
                          className="w-full bg-gradient-primary"
                        >
                          Regenerate with New Prompt
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
