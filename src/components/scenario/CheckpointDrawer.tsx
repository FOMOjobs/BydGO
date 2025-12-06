import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, Check, Lock, Sparkles, Lightbulb } from 'lucide-react';
import { Path, Checkpoint } from '@/data/paths';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CheckpointDrawerProps {
  path: Path | null;
  checkpoint: Checkpoint | null;
  onClose: () => void;
}

export function CheckpointDrawer({ path, checkpoint, onClose }: CheckpointDrawerProps) {
  const [answer, setAnswer] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { addStamp, hasStamp, isGpsSimulated, isCheckpointUnlocked } = useAppStore();

  if (!path || !checkpoint) return null;

  const isCompleted = hasStamp(path.id, checkpoint.id);
  const isFieldLocked = path.type === 'field' && !isGpsSimulated && !isCompleted;
  const isSequentiallyLocked = !isCheckpointUnlocked(path.id, checkpoint.order);
  const isLocked = isFieldLocked || (isSequentiallyLocked && !isCompleted);

  const handleSubmit = () => {
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = checkpoint.answer.toLowerCase();

    if (normalizedAnswer === normalizedCorrect) {
      setShowSuccess(true);
      addStamp({
        pathId: path.id,
        checkpointId: checkpoint.id,
        collectedAt: new Date(),
        title: checkpoint.title,
        pathTitle: path.title,
      });
      setTimeout(() => {
        setShowSuccess(false);
        setAnswer('');
        onClose();
        toast.success('Gratulacje! Zdobyłeś nowy stempel!', {
          description: `${path.title} - ${checkpoint.title}`,
        });
      }, 2000);
    } else {
      toast.error('Niepoprawna odpowiedź', {
        description: 'Spróbuj ponownie lub użyj podpowiedzi!',
      });
    }
  };

  return (
    <AnimatePresence>
      {checkpoint && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto" // Increased height to 90vh
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Animation */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-green-500/95 z-10 rounded-t-3xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <motion.div
                    className="text-center text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <Sparkles className="w-20 h-20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Brawo!</h2>
                    <p>Stempel zdobyty!</p>
                    <p className="text-sm mt-2 opacity-80">
                      {checkpoint.order < path.checkpoints.length 
                        ? 'Następny punkt odblokowany!' 
                        : 'Ścieżka ukończona!'}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="px-6 pb-16">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <img src={path.imageUrl || '/images/spichrze.jpg'} alt={path.title} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-xs text-muted-foreground">{path.title}</p>
                  <h2 className="text-xl font-bold">{checkpoint.title}</h2>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-4">
                {path.checkpoints.map((cp, i) => (
                  <div
                    key={cp.id}
                    className={cn(
                      'flex-1 h-1.5 rounded-full transition-colors',
                      hasStamp(path.id, cp.id) 
                        ? 'bg-green-500' 
                        : cp.id === checkpoint.id 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  path.type === 'field' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-amber-100 text-amber-700'
                )}>
                  {path.type === 'field' ? '📍 Terenowe' : '🏠 Wirtualne'}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {path.difficulty === 'easy' ? 'Łatwe' : path.difficulty === 'medium' ? 'Średnie' : 'Trudne'}
                </span>
                <span className="text-xs">
                  Punkt {checkpoint.order}/{path.checkpoints.length}
                </span>
              </div>

              {/* Story */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Historia</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {checkpoint.story}
                </p>
              </div>

              {/* Task */}
              {isLocked ? (
                <div className="bg-muted p-4 rounded-xl flex items-center gap-3">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Punkt zablokowany</p>
                    <p className="text-sm text-muted-foreground">
                      {isSequentiallyLocked 
                        ? 'Najpierw ukończ poprzedni punkt na ścieżce'
                        : 'Podejdź bliżej lub włącz symulację GPS'}
                    </p>
                  </div>
                </div>
              ) : isCompleted ? (
                <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-700">Ukończone!</p>
                    <p className="text-sm text-muted-foreground">
                      Stempel znajduje się w Twoim paszporcie
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-primary/5 p-4 rounded-xl">
                  <h3 className="font-semibold mb-2">🎯 Wyzwanie</h3>
                  <p className="text-muted-foreground mb-4">{checkpoint.task}</p>
                  
                  {/* Hint */}
                  {checkpoint.hint && (
                    <div className="mb-4">
                      <button 
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {showHint ? 'Ukryj podpowiedź' : 'Pokaż podpowiedź'}
                      </button>
                      <AnimatePresence>
                        {showHint && (
                          <motion.p 
                            className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            💡 {checkpoint.hint}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Twoja odpowiedź..."
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <Button onClick={handleSubmit} disabled={!answer.trim()}>
                      Sprawdź
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification badge */}
              {path.verified && path.verifiedBy && (
                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Zweryfikowano przez: {path.verifiedBy}</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
