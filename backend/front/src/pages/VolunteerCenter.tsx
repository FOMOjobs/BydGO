import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Search, Filter, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Initiative {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'ecology' | 'sport' | 'culture';
  location: string;
  coordinates: [number, number];
  date: string;
  organizer: string;
  participants: number;
  maxParticipants: number;
}

const sampleInitiatives: Initiative[] = [
  {
    id: '1',
    title: 'Sprzątanie Parku Jordana',
    description: 'Wspólne sprzątanie i pielęgnacja zieleni w jednym z najpiękniejszych parków Krakowa. Przygotujemy narzędzia i materiały.',
    category: 'ecology',
    location: 'Park Jordana, Kraków',
    coordinates: [19.9167, 50.0647],
    date: '2024-03-15',
    organizer: 'Zielony Kraków',
    participants: 12,
    maxParticipants: 25
  },
  {
    id: '2',
    title: 'Korepetycje dla dzieci z Nowej Huty',
    description: 'Pomoc w nauce matematyki i języka polskiego dla uczniów szkół podstawowych. Elastyczne godziny, ciepła atmosfera.',
    category: 'education',
    location: 'Centrum Kultury Nowa Huta',
    coordinates: [20.0333, 50.0775],
    date: '2024-03-20',
    organizer: 'Edukacja dla Wszystkich',
    participants: 8,
    maxParticipants: 15
  },
  {
    id: '3',
    title: 'Turniej piłki nożnej dla młodzieży',
    description: 'Organizacja i prowadzenie turnieju piłkarskiego dla dzieci i młodzieży z dzielnic Krakowa. Potrzebujemy sędziów i organizatorów.',
    category: 'sport',
    location: 'Stadion Cracovia',
    coordinates: [19.9461, 50.0465],
    date: '2024-03-25',
    organizer: 'Sportowy Kraków',
    participants: 15,
    maxParticipants: 20
  },
  {
    id: '4',
    title: 'Festiwal Kultury Studentckiej',
    description: 'Pomoc w organizacji koncertów, warsztatów i wystaw. Poszukujemy osób do obsługi technicznej i kontaktu z artystami.',
    category: 'culture',
    location: 'Rynek Główny',
    coordinates: [19.9386, 50.0617],
    date: '2024-04-01',
    organizer: 'Kultura Kraków',
    participants: 20,
    maxParticipants: 30
  }
];

const categoryLabels = {
  education: 'Edukacja',
  ecology: 'Ekologia',
  sport: 'Sport',
  culture: 'Kultura'
};

const categoryColors = {
  education: 'bg-education',
  ecology: 'bg-ecology', 
  sport: 'bg-sport',
  culture: 'bg-culture'
};

const VolunteerCenter = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const filteredInitiatives = sampleInitiatives.filter(initiative => {
    const matchesCategory = selectedCategory === 'all' || initiative.category === selectedCategory;
    const matchesSearch = initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         initiative.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on Kraków
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [19.9449, 50.0647], // Kraków coordinates
      zoom: 11,
      accessToken: 'pk.eyJ1IjoibmluZWpvZS0yMDI0IiwiYSI6ImNtMjRjZ3F2ZjBkeW8yanM2c2c0bGNwaXEifQ.i1ap-69ucCf7JcjAMf3S_Q'
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each initiative
    sampleInitiatives.forEach(initiative => {
      const el = document.createElement('div');
      el.className = `w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-lg ${categoryColors[initiative.category]}`;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(initiative.coordinates)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedInitiative(initiative);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Zgłoszenie wysłane pomyślnie! Organizator skontaktuje się z Tobą wkrótce.`);
    setApplicationForm({ name: '', email: '', message: '' });
    setShowApplication(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Krakowskie Centrum Wolontariatu</h1>
                <p className="text-muted-foreground">Łączymy młodych z inicjatywami społecznymi</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Filters and List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Szukaj inicjatyw</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Wpisz czego szukasz..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Category Filters */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kategorie</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      Wszystkie
                    </Button>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(key)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Initiatives List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredInitiatives.map(initiative => (
                <Card key={initiative.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedInitiative(initiative)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{initiative.title}</CardTitle>
                      <Badge className={`${categoryColors[initiative.category]} text-white`}>
                        {categoryLabels[initiative.category]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-2">
                      {initiative.description.substring(0, 100)}...
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {initiative.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(initiative.date).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Mapa inicjatyw w Krakowie</CardTitle>
                <CardDescription>Kliknij na znacznik, aby zobaczyć szczegóły inicjatywy</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={mapContainer} className="w-full h-[500px] rounded-b-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Initiative Details Modal */}
      {selectedInitiative && (
        <Dialog open={!!selectedInitiative} onOpenChange={() => setSelectedInitiative(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedInitiative.title}
                <Badge className={`${categoryColors[selectedInitiative.category]} text-white`}>
                  {categoryLabels[selectedInitiative.category]}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Organizowane przez {selectedInitiative.organizer}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-foreground">{selectedInitiative.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedInitiative.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(selectedInitiative.date).toLocaleDateString('pl-PL')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedInitiative.participants}/{selectedInitiative.maxParticipants} uczestników</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => setShowApplication(true)} className="flex-1">
                  Zgłoś się jako wolontariusz
                </Button>
                <Button variant="outline" className="flex-1">
                  Skontaktuj się z organizatorem
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Application Form Modal */}
      <Dialog open={showApplication} onOpenChange={setShowApplication}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zgłoszenie do wolontariatu</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby zgłosić się do inicjatywy: {selectedInitiative?.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Imię i nazwisko</Label>
              <Input
                id="name"
                value={applicationForm.name}
                onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={applicationForm.email}
                onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="message">Dlaczego chcesz dołączyć do tej inicjatywy?</Label>
              <Textarea
                id="message"
                value={applicationForm.message}
                onChange={(e) => setApplicationForm({...applicationForm, message: e.target.value})}
                placeholder="Opowiedz nam o swojej motywacji..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">Wyślij zgłoszenie</Button>
              <Button type="button" variant="outline" onClick={() => setShowApplication(false)}>
                Anuluj
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VolunteerCenter;