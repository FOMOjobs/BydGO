import { Map, Sparkles, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { ActiveView } from './AppLayout';

const navItems = [
  { view: 'map' as ActiveView, icon: Map, label: 'Mapa', activeColor: 'text-blue-500', activeBg: 'bg-blue-500/10' },
  { view: 'kolekcja' as ActiveView, icon: Sparkles, label: 'Kolekcja', activeColor: 'text-red-500', activeBg: 'bg-red-500/10' },
  { view: 'kreator' as ActiveView, icon: PlusCircle, label: 'Kreator', activeColor: 'text-green-500', activeBg: 'bg-green-500/10' },
  { view: 'konto' as ActiveView, icon: User, label: 'Konto', activeColor: 'text-amber-500', activeBg: 'bg-amber-500/10' },
];

interface BottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function BottomNav({ activeView, setActiveView }: BottomNavProps) {
  const { isLoggedIn } = useAppStore();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isEnabled = isLoggedIn || item.view === 'map';
        const isActive = activeView === item.view;

        return (
          <button
            key={item.view}
            disabled={!isEnabled}
            onClick={() => isEnabled && setActiveView(item.view)}
            className={cn(
              'bottom-nav-item flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200',
              isActive 
                ? `${item.activeBg} scale-105` 
                : 'hover:bg-muted/50',
              !isEnabled && 'opacity-50 pointer-events-none'
            )}
            title={!isEnabled ? "Zaloguj się, aby uzyskać dostęp" : undefined}
          >
            <item.icon 
              className={cn(
                'w-6 h-6 transition-all duration-200',
                isActive ? item.activeColor : 'text-foreground/60'
              )} 
            />
            <span className={cn(
              'text-xs transition-colors',
              isActive ? `${item.activeColor} font-bold` : 'text-foreground/60'
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
