import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, MapPin, Check, Clock, AlertCircle } from 'lucide-react';
import { useAppStore, UserScenario } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function CreatorPage() {
  const { userScenarios, addUserScenario } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'field' as 'field' | 'virtual',
    category: 'ciekawostki' as import('@/stores/appStore').PathCategory,
    question: '',
    answer: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.location || !form.question || !form.answer) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }

    addUserScenario({
      ...form,
      coordinates: [53.1235 + (Math.random() - 0.5) * 0.02, 18.0084 + (Math.random() - 0.5) * 0.02],
    });

    toast.success('Scenariusz został dodany!', {
      description: 'Czeka na weryfikację przez Miejską Bibliotekę Publiczną',
    });

    setForm({
      title: '',
      description: '',
      location: '',
      type: 'field',
      category: 'ciekawostki',
      question: '',
      answer: '',
    });
    setShowForm(false);
  };

  return (
      <div className="min-h-screen p-4 pt-safe">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
            <PlusCircle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Kreator Scenariuszy</h1>
          <p className="text-muted-foreground">
            Podziel się historią Bydgoszczy
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div 
          className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Weryfikacja scenariuszy</p>
              <p className="text-muted-foreground">
                Wszystkie scenariusze są weryfikowane przez Miejską Bibliotekę Publiczną 
                w Bydgoszczy, aby zapewnić poprawność historyczną i bezpieczeństwo lokalizacji.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Add Button or Form */}
        {!showForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              className="w-full py-6" 
              onClick={() => setShowForm(true)}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Dodaj nowy scenariusz
            </Button>
          </motion.div>
        ) : (
          <motion.form
            className="space-y-4 bg-card rounded-xl p-4 border"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <Label htmlFor="title">Tytuł scenariusza</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="np. Tajemnica Starego Rynku"
              />
            </div>

            <div>
              <Label htmlFor="description">Historia / Opis</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Opowiedz ciekawą historię związaną z tym miejscem..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location">Lokalizacja</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="np. Stary Rynek, okolice fontanny"
              />
            </div>

            <div>
              <Label>Typ scenariusza</Label>
              <RadioGroup
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value as 'field' | 'virtual' })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="field" id="field" />
                  <Label htmlFor="field" className="cursor-pointer">
                    📍 Terenowe
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="virtual" id="virtual" />
                  <Label htmlFor="virtual" className="cursor-pointer">
                    🏠 Wirtualne
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="question">Pytanie / Zadanie</Label>
              <Textarea
                id="question"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="Jakie pytanie lub zadanie musi rozwiązać uczestnik?"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="answer">Poprawna odpowiedź</Label>
              <Input
                id="answer"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                placeholder="Odpowiedź (wielkość liter nie ma znaczenia)"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                Anuluj
              </Button>
              <Button type="submit" className="flex-1">
                Wyślij do weryfikacji
              </Button>
            </div>
          </motion.form>
        )}

        {/* User's Scenarios */}
        {userScenarios.length > 0 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-semibold mb-4">Twoje scenariusze</h2>
            <div className="space-y-3">
              {userScenarios.map((scenario, index) => (
                <ScenarioCard key={scenario.id} scenario={scenario} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
  );
}

function ScenarioCard({ scenario, index }: { scenario: UserScenario; index: number }) {
  return (
    <motion.div
      className="bg-card rounded-xl p-4 border"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{scenario.title}</h3>
        <StatusBadge status={scenario.status} />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <MapPin className="w-4 h-4" />
        <span>{scenario.location}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{scenario.description}</p>
      <p className="text-xs text-muted-foreground mt-2">
        Dodano: {format(new Date(scenario.submittedAt), 'd MMMM yyyy', { locale: pl })}
      </p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: UserScenario['status'] }) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Weryfikacja',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    verified: {
      icon: Check,
      label: 'Zweryfikowano',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    rejected: {
      icon: AlertCircle,
      label: 'Odrzucono',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', className)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
