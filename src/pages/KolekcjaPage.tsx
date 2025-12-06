import { motion } from 'framer-motion';
import { Sparkles, Stamp as StampIcon, Award, Home, Loader2 } from 'lucide-react';
import { useAppStore, PathCategory } from '@/stores/appStore';
import { API_URL, mapWPScenariuszToPath, Path, WPScenariusz } from '@/data/paths';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import bydgoLogo from '@/assets/bydgo-logo.png';
import { useState, useEffect } from 'react';

const PATH_GRADIENT_COLORS: Record<PathCategory, string> = {
  'legendy': 'from-purple-500 to-purple-600',
  'pomniki': 'from-blue-500 to-blue-600',
  'ciekawostki': 'from-amber-500 to-amber-600',
  'historia-xx': 'from-red-500 to-red-600',
  'historia-wspolczesna': 'from-emerald-500 to-emerald-600',
};

const PATH_BG_COLORS: Record<PathCategory, string> = {
  'legendy': 'bg-purple-50',
  'pomniki': 'bg-blue-50',
  'ciekawostki': 'bg-amber-50',
  'historia-xx': 'bg-red-50',
  'historia-wspolczesna': 'bg-emerald-50',
};

const PATH_TEXT_COLORS: Record<PathCategory, string> = {
  'legendy': 'text-purple-800',
  'pomniki': 'text-blue-800',
  'ciekawostki': 'text-amber-800',
  'historia-xx': 'text-red-800',
  'historia-wspolczesna': 'text-emerald-800',
};


export default function KolekcjaPage() {
  const { stamps, getPathProgress } = useAppStore();
  const [paths, setPaths] = useState<Path[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await fetch(API_URL);
        const data: WPScenariusz[] = await res.json();
        const apiPaths = data.map(mapWPScenariuszToPath);
        setPaths(apiPaths);
      } catch (error) {
        console.error('Failed to fetch paths:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaths();
  }, []);

  const totalCheckpoints = paths.reduce((acc, p) => acc + p.checkpoints.length, 0);
  const collectedCount = stamps.length;

  const completedPaths = paths.filter(
    p => getPathProgress(p.id) === p.checkpoints.length
  );

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>Ładowanie kolekcji...</span>
        </div>
    );
  }

  return (
      <div className="min-h-screen p-4 pt-safe pb-24">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img 
            src={bydgoLogo} 
            alt="BydGO!" 
            className="w-20 h-20 mx-auto mb-3 object-contain"
          />
          <h1 className="text-2xl font-bold mb-1">Kolekcja</h1>
          <p className="text-muted-foreground">
            Zebrano {collectedCount} z {totalCheckpoints} stempli
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(collectedCount / totalCheckpoints) * 100}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Achievements */}
        {completedPaths.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Osiągnięcia ({completedPaths.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {completedPaths.map(path => {
                return (
                  <div
                    key={path.id}
                    className={cn(
                      'px-3 py-2 rounded-lg flex items-center gap-2',
                      PATH_BG_COLORS[path.category] || 'bg-gray-50'
                    )}
                  >
                    {path.imageUrl ? (
                      <img src={path.imageUrl} alt={path.title} className="w-6 h-6 rounded object-cover" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span className={cn("font-medium text-sm", PATH_TEXT_COLORS[path.category] || 'text-gray-800')}>{path.title}</span>
                    <span className="text-green-600">✓</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Paths with Stamps */}
        <div className="space-y-6">
          {paths.map((path, pathIndex) => {
            const progress = getPathProgress(path.id);
            const pathStamps = stamps.filter(s => s.pathId === path.id);
            const isCompleted = progress === path.checkpoints.length;

            return (
              <motion.div
                key={path.id}
                className="bg-card rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * pathIndex }}
              >
                {/* Path Header */}
                <div className={cn(
                  'p-4 bg-gradient-to-r text-white',
                  PATH_GRADIENT_COLORS[path.category] || 'from-gray-500 to-gray-600'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {path.imageUrl ? (
                        <img src={path.imageUrl} alt={path.title} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <Sparkles className="w-6 h-6" />
                      )}
                      <div>
                        <h3 className="font-bold">{path.title}</h3>
                        <div className="flex items-center gap-2 text-xs opacity-80">
                          <span>{progress}/{path.checkpoints.length} punktów</span>
                          {path.accessibleFromHome && (
                            <span className="flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded">
                              <Home className="w-3 h-3" />
                              Z domu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Ukończono
                      </div>
                    )}
                  </div>
                  <div className="mt-3 bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${(progress / path.checkpoints.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Checkpoints Grid */}
                <div className="p-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {path.checkpoints.map((checkpoint, index) => {
                    const stamp = pathStamps.find(s => s.checkpointId === checkpoint.id);
                    const isCollected = !!stamp;

                    return (
                      <motion.div
                        key={checkpoint.id}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: pathIndex * 0.1 + index * 0.03 }}
                      >
                        <div
                          className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all',
                            isCollected 
                              ? 'bg-green-100 text-green-600 ring-2 ring-green-500' 
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {isCollected ? (
                            <StampIcon className="w-5 h-5" />
                          ) : (
                            <span className="text-lg opacity-50">{checkpoint.order}</span>
                          )}
                        </div>
                        <p className={cn(
                          'text-[10px] text-center line-clamp-2',
                          isCollected ? 'text-foreground font-medium' : 'text-muted-foreground'
                        )}>
                          {isCollected ? checkpoint.title : '???'} 
                        </p>
                        {stamp && (
                          <p className="text-[9px] text-muted-foreground">
                            {format(new Date(stamp.collectedAt), 'd MMM', { locale: pl })}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {collectedCount === 0 && (
          <motion.div 
            className="text-center mt-12 p-6 bg-muted/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StampIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium mb-2">Twoja kolekcja jest pusta</h3>
            <p className="text-sm text-muted-foreground">
              Odkrywaj ścieżki Bydgoszczy i zbieraj stemple rozwiązując zagadki!
            </p>
          </motion.div>
        )}

        {/* All completed */}
        {collectedCount === totalCheckpoints && totalCheckpoints > 0 && (
          <motion.div 
            className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-5xl mb-3 block">🏆</span>
            <h3 className="font-bold text-xl mb-1">Gratulacje!</h3>
            <p className="text-sm text-muted-foreground">
              Zebrałeś wszystkie stemple i zostałeś Ekspertem Bydgoszczy!
            </p>
          </motion.div>
        )}
      </div>
  );
}
