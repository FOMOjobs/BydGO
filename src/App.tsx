import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import MapPage from "./pages/MapPage";

const queryClient = new QueryClient();

function AppContent() {
  const { accessibility } = useAppStore();

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Contrast mode
    root.setAttribute('data-contrast', accessibility.contrast);
    
    // Text scale
    root.style.setProperty('--text-scale', String(accessibility.textScale));
    
    // Saturation
    root.style.setProperty('--saturation-scale', String(accessibility.saturation));
    
    // Line height
    root.style.setProperty('--line-height', String(accessibility.lineHeight));
    
    // Letter spacing
    root.style.setProperty('--letter-spacing', `${accessibility.letterSpacing}em`);
    
    // Content scale
    root.style.setProperty('--content-scale', String(accessibility.contentScale));
    
    // Invert colors
    if (accessibility.invertColors) {
      root.classList.add('invert-colors');
    } else {
      root.classList.remove('invert-colors');
    }
    
    // Monochrome
    if (accessibility.monochrome) {
      root.classList.add('monochrome');
    } else {
      root.classList.remove('monochrome');
    }
    
    // Highlight links
    if (accessibility.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }
    
    // Highlight headings
    if (accessibility.highlightHeadings) {
      root.classList.add('highlight-headings');
    } else {
      root.classList.remove('highlight-headings');
    }
  }, [accessibility]);

  return <MapPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
