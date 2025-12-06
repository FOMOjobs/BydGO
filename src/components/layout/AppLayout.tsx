import { ReactNode, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { useAppStore } from '@/stores/appStore';

export type ActiveView = 'map' | 'kolekcja' | 'kreator' | 'konto';

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function AppLayout({ children, hideNav, activeView, setActiveView }: AppLayoutProps) {
  const { accessibility } = useAppStore();

  useEffect(() => {
    // Apply accessibility settings
    const root = document.documentElement;
    
    // Contrast mode
    root.setAttribute('data-contrast', accessibility.contrast);
    
    // Apply dark class for dark mode
    if (accessibility.contrast === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Saturation
    root.style.setProperty('--saturation-scale', String(accessibility.saturation));
    
    // Text scale
    root.style.setProperty('--text-scale', String(accessibility.textScale));
  }, [accessibility]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className={cn('flex-1', !hideNav && 'pb-16')}>
        {children}
      </main>
      {!hideNav && <BottomNav activeView={activeView} setActiveView={setActiveView} />}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
