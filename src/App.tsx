import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Install from "./pages/Install";
import ColorGrade from "./pages/ColorGrade";
import Auth from "./pages/Auth";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        <BrowserRouter>
          <Navbar /> {/* ✅ Navbar yaha = bas ek baar */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/install" element={<Install />} />
            <Route path="/color-grade" element={<ColorGrade />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
