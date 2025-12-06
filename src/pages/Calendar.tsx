import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { AccessibilityBar } from '@/components/AccessibilityBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Download } from 'lucide-react';
import { useVolunteerStore } from '@/stores/volunteerStore';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { VolunteerCategory } from '@/types/volunteer.types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { opportunities } = useVolunteerStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategories, setSelectedCategories] = useState<VolunteerCategory[]>([]);
  const [myApplications, setMyApplications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadApplications();
    }
  }, [user, authLoading, navigate]);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_applications')
        .select('opportunity_id')
        .eq('volunteer_id', user!.id)
        .in('status', ['pending', 'accepted']);

      if (error) throw error;
      setMyApplications(data?.map(app => app.opportunity_id) || []);
    } catch (error: any) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories: { id: VolunteerCategory; label: string; color: string }[] = [
    { id: 'education', label: 'Edukacja', color: 'education' },
    { id: 'ecology', label: 'Ekologia', color: 'ecology' },
    { id: 'sport', label: 'Sport', color: 'sport' },
    { id: 'culture', label: 'Kultura', color: 'culture' },
    { id: 'social', label: 'Pomoc społeczna', color: 'social' },
    { id: 'health', label: 'Zdrowie', color: 'health' },
  ];

  const toggleCategory = (category: VolunteerCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(opp.category)) {
      return false;
    }
    return true;
  });

  const myEvents = filteredOpportunities.filter(opp => myApplications.includes(opp.id));
  const allEvents = filteredOpportunities;

  const eventsOnSelectedDate = filteredOpportunities.filter(opp => {
    const oppDate = new Date(opp.date.start);
    return isSameDay(oppDate, selectedDate);
  });

  const myEventsOnSelectedDate = myEvents.filter(opp => {
    const oppDate = new Date(opp.date.start);
    return isSameDay(oppDate, selectedDate);
  });

  const datesWithEvents = new Set(
    filteredOpportunities.map(opp => format(new Date(opp.date.start), 'yyyy-MM-dd'))
  );

  const downloadICS = (opp: any) => {
    const start = new Date(opp.date.start);
    const end = new Date(opp.date.end);
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Młody Kraków//Wolontariat//PL
BEGIN:VEVENT
UID:${opp.id}@wolontariat.krakow.pl
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${format(start, "yyyyMMdd'T'HHmmss'Z'")}
DTEND:${format(end, "yyyyMMdd'T'HHmmss'Z'")}
SUMMARY:${opp.title}
DESCRIPTION:${opp.description}\\n\\nOrganizacja: ${opp.organization}
LOCATION:${opp.location.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wolontariat-${opp.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: '📥 Pobrano plik kalendarza',
      description: 'Możesz teraz dodać wydarzenie do swojego kalendarza!',
    });
  };

  const addToGoogleCalendar = (opp: any) => {
    const start = format(new Date(opp.date.start), "yyyyMMdd'T'HHmmss");
    const end = format(new Date(opp.date.end), "yyyyMMdd'T'HHmmss");
    const details = encodeURIComponent(`${opp.description}\n\nOrganizacja: ${opp.organization}`);
    const location = encodeURIComponent(opp.location.address);
    const title = encodeURIComponent(opp.title);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  if (authLoading || loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kalendarz Wolontariatów</h1>
          <p className="text-muted-foreground">
            Zobacz wszystkie wydarzenia i zaplanuj swoją aktywność
          </p>
        </div>

        {/* Category Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtruj po kategorii</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                  >
                    <div className={`h-3 w-3 rounded-full bg-gradient-to-br category-${category.color}`} />
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {format(selectedDate, 'LLLL yyyy', { locale: pl })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={pl}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    hasEvents: (date) => datesWithEvents.has(format(date, 'yyyy-MM-dd'))
                  }}
                  modifiersStyles={{
                    hasEvents: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      color: 'hsl(var(--primary))'
                    }
                  }}
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>• Podkreślone daty mają wydarzenia</p>
                  <p>• Kliknij datę, aby zobaczyć szczegóły</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="my-events">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-events">
                  Moje wydarzenia ({myEventsOnSelectedDate.length})
                </TabsTrigger>
                <TabsTrigger value="all-events">
                  Wszystkie dostępne ({eventsOnSelectedDate.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-events" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {format(selectedDate, 'd MMMM yyyy', { locale: pl })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {myEventsOnSelectedDate.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nie masz żadnych wydarzeń tego dnia. 📅
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {myEventsOnSelectedDate.map(opp => (
                          <Card key={opp.id} className="border-l-4 border-l-primary">
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold text-lg">{opp.title}</h3>
                                  <Badge className={`category-${opp.category} text-white mt-2`}>
                                    {opp.category}
                                  </Badge>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadICS(opp)}
                                  className="gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  .ics
                                </Button>
                              </div>
                              
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {opp.organization} • {opp.location.address}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {opp.timeCommitment}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {opp.currentVolunteers}/{opp.maxVolunteers} wolontariuszy
                                </div>
                              </div>

                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToGoogleCalendar(opp)}
                                  className="flex-1"
                                >
                                  Google Calendar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all-events" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {format(selectedDate, 'd MMMM yyyy', { locale: pl })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {eventsOnSelectedDate.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Brak wydarzeń tego dnia. 🗓️
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {eventsOnSelectedDate.map(opp => (
                          <Card key={opp.id}>
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold text-lg">{opp.title}</h3>
                                  <Badge className={`category-${opp.category} text-white mt-2`}>
                                    {opp.category}
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {opp.description.substring(0, 150)}...
                              </p>

                              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {opp.organization} • {opp.location.address}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {opp.timeCommitment}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {opp.currentVolunteers}/{opp.maxVolunteers} wolontariuszy
                                </div>
                              </div>

                              {myApplications.includes(opp.id) ? (
                                <Badge variant="secondary" className="w-full justify-center py-2">
                                  ✓ Już zaaplikowane
                                </Badge>
                              ) : (
                                <Button className="w-full">
                                  Aplikuj teraz
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AccessibilityBar />
    </div>
  );
}
