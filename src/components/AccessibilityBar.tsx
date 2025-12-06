import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Circle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ThemeMode = 'light' | 'dark';
type ContrastMode = 'normal' | 'high' | 'extra-high';
type FontSize = 'small' | 'medium' | 'large';

export const AccessibilityBar = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [contrast, setContrast] = useState<ContrastMode>('normal');
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    const savedContrast = localStorage.getItem('contrastMode') as ContrastMode | null;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedContrast) setContrast(savedContrast);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    // Apply contrast mode using data-contrast attribute
    document.documentElement.setAttribute('data-contrast', contrast);
    localStorage.setItem('contrastMode', contrast);

    // Apply font size
    const root = document.documentElement;
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
    localStorage.setItem('fontSize', fontSize);
  }, [theme, contrast, fontSize]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const cycleContrast = () => {
    const modes: ContrastMode[] = ['normal', 'high', 'extra-high'];
    const currentIndex = modes.indexOf(contrast);
    const nextMode = modes[(currentIndex + 1) % 3];
    setContrast(nextMode);
  };

  const cycleFontSize = (direction: 'up' | 'down') => {
    const sizes: FontSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(fontSize);
    
    if (direction === 'up' && currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Theme Toggle */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hover:bg-muted"
                >
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5 text-primary" />
                  ) : (
                    <Moon className="h-5 w-5 text-primary" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{theme === 'light' ? 'Tryb jasny' : 'Tryb ciemny'}</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Motyw
            </span>
          </div>

          {/* Center: Contrast Toggle */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleContrast}
                  className="hover:bg-muted relative"
                >
                  <Circle className="h-5 w-5 text-primary" />
                  {contrast !== 'normal' && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>
                  Kontrast: {contrast === 'normal' && 'Normalny'}
                  {contrast === 'high' && 'Wysoki'}
                  {contrast === 'extra-high' && 'Bardzo wysoki'}
                </p>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Kontrast
            </span>
          </div>

          {/* Right: Font Size Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cycleFontSize('down')}
                disabled={fontSize === 'small'}
                className="h-8 px-2 text-xs hover:bg-background disabled:opacity-50"
              >
                A-
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFontSize('medium')}
                className={`h-8 px-2 hover:bg-background ${
                  fontSize === 'medium' ? 'bg-background font-bold' : ''
                }`}
              >
                A
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cycleFontSize('up')}
                disabled={fontSize === 'large'}
                className="h-8 px-2 text-sm hover:bg-background disabled:opacity-50"
              >
                A+
              </Button>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">
                  Dostosuj wygląd strony do swoich potrzeb: zmień motyw, kontrast lub rozmiar czcionki.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
