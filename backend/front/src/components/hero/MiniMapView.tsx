import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useVolunteerStore } from '@/stores/volunteerStore';
import { VolunteerCategory } from '@/types/volunteer.types';

// Fix Leaflet default icon paths in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCategoryIcon = (category: VolunteerCategory) => {
  const icons = {
    education: { emoji: '📚', color: '#5B4B9C' },
    ecology: { emoji: '🌱', color: '#8BC53F' },
    sport: { emoji: '⚽', color: '#FF9500' },
    culture: { emoji: '🎭', color: '#E91E8C' },
    social: { emoji: '🤝', color: '#FF6B9D' },
    health: { emoji: '❤️', color: '#EF4444' }
  } as const;

  const icon = icons[category];

  return L.divIcon({
    html: `
      <div style="
        background-color: ${icon.color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        ${icon.emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

export const MiniMapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { opportunities } = useVolunteerStore();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const krakowCenter: L.LatLngExpression = [50.0614, 19.9366];
    const map = L.map(mapRef.current, {
      center: krakowCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add markers for the next 10 upcoming opportunities
    const upcoming = opportunities
      .filter((opp) => new Date(opp.date.start) > new Date())
      .slice(0, 10);

    upcoming.forEach((opp) => {
      const marker = L.marker(opp.location.coordinates as L.LatLngExpression, {
        icon: createCategoryIcon(opp.category),
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <div class="font-bold text-sm mb-1">${opp.title}</div>
          <div class="text-xs text-gray-600 mb-1">${opp.organization}</div>
          <div class="text-xs text-gray-500 mb-2">📅 ${new Date(opp.date.start).toLocaleDateString('pl-PL')}</div>
          <button 
            onclick="window.location.href='/opportunities/${opp.id}'" 
            class="w-full bg-rose-500 text-white py-1 px-3 rounded text-xs font-semibold">
            Zobacz więcej
          </button>
        </div>
      `);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" />
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg z-[1000]">
        <p className="text-sm font-semibold text-gray-800">📍 Mini mapa wolontariatu</p>
      </div>
    </div>
  );
};
