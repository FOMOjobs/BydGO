import { Navigation } from '@/components/Navigation';
import { AccessibilityBar } from '@/components/AccessibilityBar';
import { HeroSection } from '@/components/HeroSection';
import { MapView } from '@/components/MapView';
import { FlashcardsSection } from '@/components/sections/FlashcardsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { ChatWidget } from '@/components/ChatWidget';
import { useVolunteerStore } from '@/stores/volunteerStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Clock, Map, Grid3x3, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'education': 'edukacja',
    'ecology': 'ekologia',
    'sport': 'sport',
    'culture': 'kultura',
    'social': 'pomoc społeczna',
    'health': 'zdrowie',
  };
  return labels[category] || category;
};

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    'easy': 'łatwy',
    'medium': 'średni',
    'hard': 'trudny',
  };
  return labels[difficulty] || difficulty;
};

const Index = () => {
  const { getFilteredOpportunities, opportunities } = useVolunteerStore();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');

  // Multi-category filtering + search
  const filteredOpportunities = opportunities.filter(opp => {
    // Category filter (multi-select)
    if (selectedCategories.length > 0 && !selectedCategories.includes(opp.category)) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        opp.title.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.location.address.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sorting
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date.start).getTime() - new Date(b.date.start).getTime();
      case 'urgent':
        return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
      case 'popular':
        const aPercentage = a.currentVolunteers / a.maxVolunteers;
        const bPercentage = b.currentVolunteers / b.maxVolunteers;
        return bPercentage - aPercentage;
      case 'spots':
        const aSpotsLeft = a.maxVolunteers - a.currentVolunteers;
        const bSpotsLeft = b.maxVolunteers - b.currentVolunteers;
        return bSpotsLeft - aSpotsLeft;
      default:
        return 0;
    }
  });

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const categories = [
    { id: 'education', label: 'Edukacja', count: opportunities.filter(o => o.category === 'education').length },
    { id: 'ecology', label: 'Ekologia', count: opportunities.filter(o => o.category === 'ecology').length },
    { id: 'sport', label: 'Sport', count: opportunities.filter(o => o.category === 'sport').length },
    { id: 'culture', label: 'Kultura', count: opportunities.filter(o => o.category === 'culture').length },
    { id: 'social', label: 'Pomoc społeczna', count: opportunities.filter(o => o.category === 'social').length },
    { id: 'health', label: 'Zdrowie', count: opportunities.filter(o => o.category === 'health').length },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      <main>
        <HeroSection />
        
        {/* How It Works - Flashcards */}
        <FlashcardsSection />
      
      {/* Main Content Section */}
      <section id="wolontariaty" className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
            Znajdź wolontariat w Krakowie
          </h2>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Szukaj wolontariatu po nazwie, organizacji, lokalizacji..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Kategorie:
              </div>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                  size="sm"
                  className={`hover-bounce h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    selectedCategories.includes(category.id)
                      ? `category-${category.id} text-white shadow-primary`
                      : 'border-gradient'
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.label} ({category.count})
                </Button>
              ))}
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategories([])}
                  className="h-9 text-muted-foreground"
                >
                  Wyczyść
                </Button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sortuj:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Najbliższe</SelectItem>
                  <SelectItem value="popular">Popularne</SelectItem>
                  <SelectItem value="spots">Wolne miejsca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-4 text-sm text-muted-foreground">
            Znaleziono {sortedOpportunities.length} ofert
            {selectedCategories.length > 0 && ` w kategoriach: ${selectedCategories.map(c => categories.find(cat => cat.id === c)?.label).join(', ')}`}
            {searchQuery && ` dla "${searchQuery}"`}
          </div>
          
          {/* View Toggle */}
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Mapa
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="space-y-6">
              {sortedOpportunities.length === 0 ? (
                /* Empty State */
                <Card className="border-2 border-dashed border-muted-foreground/30">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nie znaleziono ofert</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      {searchQuery
                        ? `Brak wyników dla "${searchQuery}". Spróbuj zmienić kryteria wyszukiwania.`
                        : 'Brak ofert spełniających wybrane kryteria. Spróbuj zmienić filtry.'}
                    </p>
                    <div className="flex gap-3">
                      {searchQuery && (
                        <Button onClick={() => setSearchQuery('')} variant="outline">
                          Wyczyść wyszukiwanie
                        </Button>
                      )}
                      {selectedCategories.length > 0 && (
                        <Button onClick={() => setSelectedCategories([])} variant="outline">
                          Wyczyść filtry
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Opportunities Grid */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="hover-lift shadow-card border-0 bg-gradient-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`category-${opportunity.category} text-white font-medium`}>
                          {getCategoryLabel(opportunity.category)}
                        </Badge>
                        {opportunity.currentVolunteers >= opportunity.maxVolunteers * 0.8 && (
                          <Badge className="bg-blue-700 text-white">
                            Popularny
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">{opportunity.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {opportunity.description.substring(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 pb-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {opportunity.organization}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(opportunity.date.start).toLocaleDateString('pl-PL')}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {opportunity.timeCommitment}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          {opportunity.currentVolunteers}/{opportunity.maxVolunteers}
                        </div>
                        <Badge variant={opportunity.difficulty === 'easy' ? 'secondary' : opportunity.difficulty === 'medium' ? 'default' : 'destructive'}>
                          {getDifficultyLabel(opportunity.difficulty)}
                        </Badge>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-primary hover:shadow-primary text-white border-0"
                        onClick={() => navigate('/auth')}
                      >
                        Aplikuj teraz
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opportunity.location.address)}`, '_blank')}
                        title="Otwórz w Google Maps"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="map" className="h-[400px] md:h-[500px] lg:h-[600px]">
              <div className="h-full rounded-lg overflow-hidden shadow-glow">
                <MapView selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : 'all'} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Reviews Section */}
      <ReviewsSection />
      </main>
      
      <ChatWidget />
      <AccessibilityBar />
    </div>
  );
};

export default Index;