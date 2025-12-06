import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useVolunteerStore } from '@/stores/volunteerStore';
import { VolunteerOpportunity, VolunteerCategory } from '@/types/volunteer.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, Users, Clock, X } from 'lucide-react';

// Mapbox token input component for now (will be replaced with env variable)
const MapboxTokenInput = ({ onTokenSet }: { onTokenSet: (token: string) => void }) => {
  const [token, setToken] = useState('');
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-card p-8 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Mapa wolontariatu</h3>
      <p className="text-muted-foreground mb-4 text-center">
        Aby wyświetlić mapę, wprowadź swój token Mapbox.
        <br />
        Możesz go uzyskać na <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
      </p>
      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="Wprowadź token Mapbox..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="flex-1"
        />
        <Button onClick={() => onTokenSet(token)} disabled={!token}>
          Ustaw
        </Button>
      </div>
    </div>
  );
};

const getCategoryColor = (category: VolunteerCategory): string => {
  const colors = {
    education: '#3B82F6', // Blue
    ecology: '#10B981',   // Green
    sport: '#EF4444',     // Red
    culture: '#8B5CF6',   // Purple
    social: '#F59E0B',    // Orange
    health: '#06B6D4',    // Cyan
  };
  return colors[category] || '#6B7280';
};

interface MapViewProps {
  selectedCategory?: string;
}

export const MapView: React.FC<MapViewProps> = ({ selectedCategory = 'all' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { opportunities } = useVolunteerStore();
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  const filteredOpportunities = selectedCategory === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.category === selectedCategory);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [19.9368, 50.0614], // Kraków center
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for filtered opportunities
    filteredOpportunities.forEach((opportunity) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${getCategoryColor(opportunity.category)};
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      `;

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '1000';
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '1';
      });

      // Add urgency indicator
      if (opportunity.isUrgent) {
        markerElement.style.animation = 'pulse 2s infinite';
        markerElement.innerHTML = '!';
      }

      const marker = new mapboxgl.Marker({ 
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat(opportunity.location.coordinates)
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        setSelectedOpportunity(opportunity);
        map.current?.flyTo({
          center: opportunity.location.coordinates,
          zoom: 15,
          duration: 1000
        });
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (filteredOpportunities.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredOpportunities.forEach(opportunity => {
        bounds.extend(opportunity.location.coordinates);
      });
      
      if (filteredOpportunities.length > 1) {
        map.current.fitBounds(bounds, { 
          padding: 50,
          duration: 1000
        });
      }
    }
  }, [filteredOpportunities]);

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSet={setMapboxToken} />;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-card" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-card max-w-xs">
        <h4 className="font-semibold mb-3">Kategorie wolontariatu</h4>
        <div className="space-y-2">
          {[
            { category: 'education' as VolunteerCategory, label: 'Edukacja' },
            { category: 'ecology' as VolunteerCategory, label: 'Ekologia' },
            { category: 'sport' as VolunteerCategory, label: 'Sport' },
            { category: 'culture' as VolunteerCategory, label: 'Kultura' },
            { category: 'social' as VolunteerCategory, label: 'Pomoc społeczna' },
            { category: 'health' as VolunteerCategory, label: 'Zdrowie' },
          ].map(({ category, label }) => (
            <div key={category} className="flex items-center gap-2 text-sm">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-red-500 flex items-center justify-center text-white text-xs animate-pulse"
            >
              !
            </div>
            <span>Pilne</span>
          </div>
        </div>
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-glow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`category-${selectedOpportunity.category} text-white`}>
                      {selectedOpportunity.category}
                    </Badge>
                    {selectedOpportunity.isUrgent && (
                      <Badge variant="destructive" className="animate-pulse">
                        Pilne!
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{selectedOpportunity.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {selectedOpportunity.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOpportunity(null)}
                  className="hover-bounce"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">{selectedOpportunity.organization}</div>
                      <div className="text-muted-foreground">{selectedOpportunity.location.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Termin</div>
                      <div className="text-muted-foreground">
                        {new Date(selectedOpportunity.date.start).toLocaleDateString('pl-PL')} - 
                        {new Date(selectedOpportunity.date.end).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Zaangażowanie czasowe</div>
                      <div className="text-muted-foreground">{selectedOpportunity.timeCommitment}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Wolontariusze</div>
                      <div className="text-muted-foreground">
                        {selectedOpportunity.currentVolunteers}/{selectedOpportunity.maxVolunteers}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="font-semibold mb-2">Wymagania:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedOpportunity.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Korzyści:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedOpportunity.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-gradient-primary hover:shadow-primary text-white">
                  Aplikuj teraz
                </Button>
                <Button variant="outline" className="flex-1">
                  Skontaktuj się
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
