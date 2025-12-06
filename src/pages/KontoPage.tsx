import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Monitor, Navigation, Bug, Scale, 
  HelpCircle, ChevronRight, Eye, Accessibility, MapPin, Compass,
  Volume2, Bell, Mail, Phone, FileText, Shield, Award, Star,
  MessageSquare, Send, CheckCircle, Clock, Smartphone, Globe, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';
import bydgoLogo from '@/assets/bydgo-logo.png';

type ActiveSection = 'main' | 'profil' | 'ustawienia-ekranu' | 'ulatwienia' | 'nawigacja' | 'zglos-blad' | 'informacje-prawne' | 'pomoc';

export default function KontoPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('main');
  
  if (activeSection === 'profil') {
    return <ProfilSection onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'ustawienia-ekranu') {
    return <ScreenSettings 
            onBack={() => setActiveSection('main')} 
            onOpenAccessibility={() => setActiveSection('ulatwienia')}
          />;
  }

  if (activeSection === 'ulatwienia') {
    return <AccessibilityPanel onBack={() => setActiveSection('ustawienia-ekranu')} />;
  }

  if (activeSection === 'nawigacja') {
    return <NawigacjaSection onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'zglos-blad') {
    return <ZglosBladSection onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'informacje-prawne') {
    return <InformacjePrawneSection onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'pomoc') {
    return <PomocSection onBack={() => setActiveSection('main')} />;
  }

  return (
      <div className="min-h-screen p-4 pt-safe pb-24">
        {/* Header with Logo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img 
            src={bydgoLogo} 
            alt="BydGO!" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold mb-1">Konto</h1>
          <p className="text-muted-foreground">
            Zarządzaj swoim profilem
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MenuButton
            icon={<User className="w-5 h-5" />}
            label="Profil"
            description="Twoje dane, avatar, osiągnięcia"
            onClick={() => setActiveSection('profil')}
          />

          <MenuButton
            icon={<Monitor className="w-5 h-5" />}
            label="Ustawienia ekranu"
            description="Ustawienia Seniora, dostępność"
            onClick={() => setActiveSection('ustawienia-ekranu')}
          />

          <MenuButton
            icon={<Navigation className="w-5 h-5" />}
            label="Nawigacja"
            description="Preferencje nawigacji GPS"
            onClick={() => setActiveSection('nawigacja')}
          />

          <MenuButton
            icon={<Bug className="w-5 h-5" />}
            label="Zgłoś błąd"
            description="Pomóż nam ulepszyć aplikację"
            onClick={() => setActiveSection('zglos-blad')}
          />

          <MenuButton
            icon={<Scale className="w-5 h-5" />}
            label="Informacje prawne"
            description="Regulamin, polityka prywatności"
            onClick={() => setActiveSection('informacje-prawne')}
          />

          <MenuButton
            icon={<HelpCircle className="w-5 h-5" />}
            label="Centrum pomocy"
            description="FAQ, instrukcje, kontakt"
            onClick={() => setActiveSection('pomoc')}
          />
        </motion.section>

        {/* About Section */}
        <motion.div 
          className="mt-8 bg-card rounded-xl p-4 border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-semibold mb-4">O aplikacji</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>BydGO!</strong></p>
            <p>Wersja: 2.0.0</p>
            <p>
              Aplikacja stworzona we współpracy z Miejską Biblioteką Publiczną 
              w Bydgoszczy oraz Instytutem Pamięci Narodowej.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-8 text-center pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            Aplikacja stworzona z <span className="text-primary">❤</span> dla miasta Bydgoszcz
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            We współpracy z Urzędem Miasta Bydgoszcz
          </p>
        </motion.div>
      </div>
  );
}

function MenuButton({ 
  icon, 
  label, 
  description, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-xl p-4 border flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{label}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

function ScreenSettings({ onBack, onOpenAccessibility }: { onBack: () => void; onOpenAccessibility: () => void }) {
  const { setSeniorMode, accessibility } = useAppStore();

  const handleSeniorMode = (enabled: boolean) => {
    setSeniorMode(enabled);
  };

  return (
    <div className="min-h-screen p-4 pt-safe pb-24">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button 
          onClick={onBack}
          className="text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          ← Powrót
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Monitor className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ustawienia ekranu</h1>
            <p className="text-sm text-muted-foreground">Dostosuj wygląd aplikacji</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Senior Mode - Quick Toggle */}
          <div className="bg-card rounded-xl p-4 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Accessibility className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">Ustawienia Seniora</h3>
                  <p className="text-xs text-muted-foreground">
                    Większy tekst, wysoki kontrast, uproszczony interfejs
                  </p>
                </div>
              </div>
              <Switch 
                checked={accessibility.seniorMode} 
                onCheckedChange={handleSeniorMode}
              />
            </div>
          </div>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenAccessibility}
            className="w-full bg-card rounded-xl p-4 border flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Ułatwienia dostępu</h3>
              <p className="text-xs text-muted-foreground">
                Kontrast, kolory, rozmiar tekstu, odstępy
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AccessibilityPanel({ onBack }: { onBack: () => void }) {
  const {
    accessibility,
    setContrast,
    setSaturation,
    setTextScale,
    setLineHeight,
    setLetterSpacing,
    setInvertColors,
    setMonochrome,
    setHighlightLinks,
    setHighlightHeadings,
    setContentScale,
  } = useAppStore();

  return (
    <div className="min-h-screen p-4 pt-safe pb-24">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button 
          onClick={onBack}
          className="text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          ← Powrót
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ułatwienia dostępu</h1>
            <p className="text-sm text-muted-foreground">Podgląd na żywo zmian</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Color Options */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-4">Opcje wyświetlania</h3>
            <div className="grid grid-cols-2 gap-3">
              <ToggleOption
                label="Odwróć kolory"
                active={accessibility.invertColors}
                onChange={setInvertColors}
              />
              <ToggleOption
                label="Monochromatyczny"
                active={accessibility.monochrome}
                onChange={setMonochrome}
              />
              <ToggleOption
                label="Ciemny kontrast"
                active={accessibility.contrast === 'dark'}
                onChange={(v) => setContrast(v ? 'dark' : 'standard')}
              />
              <ToggleOption
                label="Jasny kontrast"
                active={accessibility.contrast === 'high'}
                onChange={(v) => setContrast(v ? 'high' : 'standard')}
              />
              <ToggleOption
                label="Niskie nasycenie"
                active={accessibility.saturation < 0.5}
                onChange={(v) => setSaturation(v ? 0.3 : 1)}
              />
              <ToggleOption
                label="Wysokie nasycenie"
                active={accessibility.saturation > 1.2}
                onChange={(v) => setSaturation(v ? 1.5 : 1)}
              />
              <ToggleOption
                label="Zaznacz linki"
                active={accessibility.highlightLinks}
                onChange={setHighlightLinks}
              />
              <ToggleOption
                label="Zaznacz nagłówki"
                active={accessibility.highlightHeadings}
                onChange={setHighlightHeadings}
              />
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-card rounded-xl p-4 border space-y-6">
            <h3 className="font-medium">Regulacja</h3>
            
            <SliderOption
              label="Skalowanie treści"
              value={accessibility.contentScale}
              onChange={setContentScale}
              min={1}
              max={2}
              step={0.1}
              formatValue={(v) => `${Math.round(v * 100)}%`}
            />

            <SliderOption
              label="Rozmiar czcionki"
              value={accessibility.textScale}
              onChange={setTextScale}
              min={1}
              max={2}
              step={0.1}
              formatValue={(v) => `${Math.round(v * 100)}%`}
            />

            <SliderOption
              label="Wysokość linii"
              value={accessibility.lineHeight}
              onChange={setLineHeight}
              min={1}
              max={2}
              step={0.1}
              formatValue={(v) => `${Math.round(v * 100)}%`}
            />

            <SliderOption
              label="Odstęp liter"
              value={accessibility.letterSpacing}
              onChange={setLetterSpacing}
              min={0}
              max={0.2}
              step={0.02}
              formatValue={(v) => `${Math.round(v * 100)}%`}
            />
          </div>

          {/* Live Preview */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Podgląd na żywo</h3>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-lg">Przykładowy nagłówek</h4>
              <p className="text-muted-foreground">
                To jest przykładowy tekst, który pokazuje jak będzie wyglądać treść 
                przy aktualnych ustawieniach dostępności.
              </p>
              <a href="#" className="text-primary underline">Przykładowy link</a>
              <div className="pt-2">
                <Button size="sm">Przykładowy przycisk</Button>
              </div>
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setContrast('standard');
              setSaturation(1);
              setTextScale(1);
              setLineHeight(1.5);
              setLetterSpacing(0);
              setInvertColors(false);
              setMonochrome(false);
              setHighlightLinks(false);
              setHighlightHeadings(false);
              setContentScale(1);
            }}
          >
            Przywróć domyślne
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function ToggleOption({ 
  label, 
  active, 
  onChange 
}: { 
  label: string; 
  active: boolean; 
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={cn(
        'p-3 rounded-lg border-2 text-sm font-medium transition-all text-left',
        active 
          ? 'border-primary bg-primary/10 text-primary' 
          : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted'
      )}
    >
      {label}
    </button>
  );
}

function SliderOption({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        <span className="text-sm font-medium">{formatValue(value)}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="py-2"
      />
    </div>
  );
}

// ============ PROFIL SECTION ============
function ProfilSection({ onBack }: { onBack: () => void }) {
  const [nickname, setNickname] = useState('Odkrywca Bydgoszczy');
  
  return (
    <div className="min-h-screen p-4 pt-safe pb-24">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={onBack} className="text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          ← Powrót
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Profil</h1>
            <p className="text-sm text-muted-foreground">Zarządzaj swoimi danymi</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-4">Avatar</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl text-white font-bold">
                OB
              </div>
              <div className="flex-1">
                <Button variant="outline" size="sm" className="mb-2">Zmień avatar</Button>
                <p className="text-xs text-muted-foreground">JPG, PNG do 2MB</p>
              </div>
            </div>
          </div>

          {/* Nickname */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Pseudonim</h3>
            <Input 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Twój pseudonim"
            />
            <p className="text-xs text-muted-foreground mt-2">Widoczny w rankingach</p>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-4">Statystyki</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Award className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Zebrane stemple</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Star className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Ukończone ścieżki</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-6 h-6 text-secondary mx-auto mb-1" />
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs text-muted-foreground">Odwiedzone miejsca</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Clock className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">5h</p>
                <p className="text-xs text-muted-foreground">Czas eksploracji</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Odznaki</h3>
            <div className="flex gap-3 flex-wrap">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center" title="Początkujący odkrywca">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center" title="Pierwsza ścieżka">
                <span className="text-2xl">🗺️</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center opacity-40" title="Zablokowane">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center opacity-40" title="Zablokowane">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={() => toast.success('Profil zapisany!')}>
            Zapisz zmiany
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ============ NAWIGACJA SECTION ============
function NawigacjaSection({ onBack }: { onBack: () => void }) {
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [voiceNav, setVoiceNav] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [proximity, setProximity] = useState(50);

  return (
    <div className="min-h-screen p-4 pt-safe pb-24">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={onBack} className="text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          ← Powrót
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <Navigation className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Nawigacja</h1>
            <p className="text-sm text-muted-foreground">Preferencje GPS i lokalizacji</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* GPS Settings */}
          <div className="bg-card rounded-xl p-4 border space-y-4">
            <h3 className="font-medium">Ustawienia GPS</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Lokalizacja GPS</p>
                  <p className="text-xs text-muted-foreground">Włącz śledzenie pozycji</p>
                </div>
              </div>
              <Switch checked={gpsEnabled} onCheckedChange={setGpsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Nawigacja głosowa</p>
                  <p className="text-xs text-muted-foreground">Instrukcje głosowe</p>
                </div>
              </div>
              <Switch checked={voiceNav} onCheckedChange={setVoiceNav} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Powiadomienia o pobliskich miejscach</p>
                  <p className="text-xs text-muted-foreground">Alert przy zbliżaniu się</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>

          {/* Proximity */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-4">Promień wykrywania</h3>
            <div className="flex justify-between mb-2">
              <Label className="text-sm text-muted-foreground">Odległość aktywacji</Label>
              <span className="text-sm font-medium">{proximity}m</span>
            </div>
            <Slider
              value={[proximity]}
              onValueChange={([v]) => setProximity(v)}
              min={20}
              max={100}
              step={10}
              className="py-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Checkpoint zostanie odblokowany gdy zbliżysz się na tę odległość
            </p>
          </div>

          {/* Map Type */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Typ mapy</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 rounded-lg border-2 border-primary bg-primary/10 text-sm font-medium text-left">
                <Globe className="w-5 h-5 mb-1 text-primary" />
                Standardowa
              </button>
              <button className="p-3 rounded-lg border-2 border-border bg-muted/50 text-sm font-medium text-left text-muted-foreground">
                <Compass className="w-5 h-5 mb-1" />
                Satelitarna
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============ ZGŁOŚ BŁĄD SECTION ============
function ZglosBladSection({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!category || !description) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }
    toast.success('Dziękujemy za zgłoszenie! Zajmiemy się tym.');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="min-h-screen p-4 pt-safe pb-24">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={onBack} className="text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          ← Powrót
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Bug className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Zgłoś błąd</h1>
            <p className="text-sm text-muted-foreground">Pomóż nam ulepszyć aplikację</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Kategoria błędu</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Mapa nie działa', 'Błędne dane', 'Problem z GPS', 'Aplikacja się zawiesza', 'Błąd w quizie', 'Inne'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'p-2 rounded-lg border text-sm text-left transition-all',
                    category === cat 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:bg-muted/50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Opis problemu</h3>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opisz szczegółowo co się stało..."
              rows={4}
            />
          </div>

          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Załącz zrzut ekranu (opcjonalnie)</h3>
            <Button variant="outline" className="w-full">
              <Smartphone className="w-4 h-4 mr-2" />
              Dodaj screenshot
            </Button>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            Wyślij zgłoszenie
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ============ INFORMACJE PRAWNE SECTION ============
function InformacjePrawneSection({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen p-4 pt-safe pb-24">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={onBack} className="text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          ← Powrót
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Scale className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Informacje prawne</h1>
            <p className="text-sm text-muted-foreground">Regulamin i polityki</p>
          </div>
        </div>

        <div className="space-y-3">
          <LegalItem icon={<FileText />} title="Regulamin aplikacji" description="Zasady korzystania z BydGO!" />
          <LegalItem icon={<Shield />} title="Polityka prywatności" description="Jak przetwarzamy Twoje dane" />
          <LegalItem icon={<Globe />} title="Polityka cookies" description="Informacje o plikach cookies" />
          <LegalItem icon={<Mail />} title="RODO" description="Twoje prawa dot. danych osobowych" />
          
          <div className="bg-card rounded-xl p-4 border mt-6">
            <h3 className="font-medium mb-3">Licencje i podziękowania</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Mapy: © OpenStreetMap contributors</p>
              <p>• Ikony: Lucide React</p>
              <p>• Zdjęcia: Urząd Miasta Bydgoszcz</p>
              <p>• Treści historyczne: Miejska Biblioteka Publiczna</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-2">Kontakt prawny</h3>
            <p className="text-sm text-muted-foreground">
              W sprawach prawnych: prawny@bydgo.app
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LegalItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <button className="w-full bg-card rounded-xl p-4 border flex items-center gap-4 hover:bg-muted/50 transition-colors text-left">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

// ============ POMOC SECTION ============
function PomocSection({ onBack }: { onBack: () => void }) {
  const faqs = [
    { q: 'Jak zbierać stemple?', a: 'Podejdź do oznaczonego miejsca na mapie i rozwiąż zadanie lub odpowiedz na pytanie.' },
    { q: 'Czy mogę grać offline?', a: 'Część funkcji wymaga internetu, ale quizy i zebrane stemple są dostępne offline.' },
    { q: 'Jak włączyć tryb seniora?', a: 'Przejdź do Ustawienia ekranu → Ustawienia Seniora i włącz przełącznik.' },
    { q: 'Jak zgłosić błędne dane?', a: 'Użyj opcji "Zgłoś błąd" w menu Konto lub napisz na kontakt@bydgo.app.' },
  ];

  return (
    <div className="min-h-screen p-4 pt-safe pb-24">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={onBack} className="text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          ← Powrót
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Centrum pomocy</h1>
            <p className="text-sm text-muted-foreground">FAQ i kontakt</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* FAQ */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-4">Najczęściej zadawane pytania</h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                  <p className="font-medium text-sm flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    {faq.q}
                  </p>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">kontakt@bydgo.app</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefon</p>
                  <p className="text-xs text-muted-foreground">+48 52 123 45 67</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Strona WWW</p>
                  <p className="text-xs text-muted-foreground">www.bydgo.app</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tutorials */}
          <div className="bg-card rounded-xl p-4 border">
            <h3 className="font-medium mb-3">Instrukcje wideo</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Jak rozpocząć przygodę?
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Zbieranie stempli krok po kroku
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Korzystanie z mapy
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
