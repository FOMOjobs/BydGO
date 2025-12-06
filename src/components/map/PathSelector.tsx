import { motion } from 'framer-motion';
import { ChevronRight, Clock, MapPin, Home, Loader2 } from 'lucide-react';
import {
  Path,
  STATIC_CATEGORY_LABELS,
  STATIC_CATEGORY_COLORS,
} from '@/data/paths';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

interface PathSelectorProps {
  paths: Path[];
  isLoading: boolean;
  selectedPathId: string | null;
  onSelectPath: (pathId: string | null) => void;
}

const PATH_COLORS: Record<string, string> = {
  enigma: 'bg-red-500',
  powstanie: 'bg-red-500',
  legendy: 'bg-purple-500',
  gwara: 'bg-amber-500',
  pomniki: 'bg-blue-500',
  'historia-wspolczesna': 'bg-emerald-500',
};

export function PathSelector({ paths, isLoading, selectedPathId, onSelectPath }: PathSelectorProps) {
  const { getPathProgress } = useAppStore();

  if (selectedPathId) {
    const path = paths.find(p => p.id === selectedPathId);
    if (!path) return null;

    const progress = getPathProgress(path.id);
    const total = path.checkpoints.length;

    return (
      <motion.div
        className="absolute top-20 left-4 right-4 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <button 
            onClick={() => onSelectPath(null)}
            className="text-xs text-muted-foreground mb-2 hover:text-foreground transition-colors"
          >
            ← Powrót
          </button>
          <div className="flex items-center gap-3">
            {path.imageUrl ? (
              <img src={path.imageUrl} alt={path.title} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <MapPin className="w-6 h-6 text-primary" />
            )}
            <div className="flex-1">
              <h3 className="font-bold">{path.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {path.estimatedTime && (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>{path.estimatedTime}</span>
                    <span>•</span>
                  </>
                )}
                <span>{progress}/{total} punktów</span>
                {path.accessibleFromHome && (
                  <>
                    <span>•</span>
                    <Home className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">Z domu</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 bg-muted rounded-full h-2 overflow-hidden">
            <motion.div 
              className={cn('h-full rounded-full', PATH_COLORS[path.id] || 'bg-primary')}
              initial={{ width: 0 }}
              animate={{ width: `${(progress / total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute bottom-24 left-4 right-4 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm">Ścieżki</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-muted-foreground text-sm flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ładowanie ścieżek...
            </div>
          )}
          {!isLoading && paths.map((path, index) => (
            <PathCard 
              key={path.id} 
              path={path} 
              index={index}
              onSelect={() => onSelectPath(path.id)} 
            />
          ))}
          {!isLoading && paths.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Brak dostępnych ścieżek.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PathCard({ path, index, onSelect }: { path: Path; index: number; onSelect: () => void }) {
  const { getPathProgress } = useAppStore();
  const progress = getPathProgress(path.id);
  const total = path.checkpoints.length;
  const isCompleted = progress === total;

  return (
    <motion.button
      className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50 last:border-b-0"
      onClick={onSelect}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden',
        isCompleted ? 'bg-green-100' : 'bg-muted'
      )}>
        {isCompleted ? (
          <span className="text-green-600 text-xl">✓</span>
        ) : path.imageUrl ? (
          <img src={path.imageUrl} alt={path.title} className="w-full h-full object-cover" />
        ) : (
          <MapPin className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-sm truncate">{path.title}</h4>
          <span className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-medium text-white',
            STATIC_CATEGORY_COLORS[path.category]
          )}>
            {STATIC_CATEGORY_LABELS[path.category]}
          </span>
          {path.accessibleFromHome && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 flex items-center gap-0.5">
              <Home className="w-2.5 h-2.5" />
              Z domu
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {path.estimatedTime && (
            <>
              <Clock className="w-3 h-3" />
              <span>{path.estimatedTime}</span>
              <span>•</span>
            </>
          )}
          <MapPin className="w-3 h-3" />
          <span>{total} punktów</span>
        </div>
        <div className="mt-1.5 bg-muted rounded-full h-1.5 overflow-hidden">
          <div 
            className={cn('h-full rounded-full transition-all', PATH_COLORS[path.id] || 'bg-primary')}
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </motion.button>
  );
}
