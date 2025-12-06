import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Path, Checkpoint } from '@/data/paths';
import { useAppStore, PathCategory } from '@/stores/appStore';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface BydgoszczMapProps {
  paths: Path[];
  onSelectCheckpoint: (path: Path, checkpoint: Checkpoint) => void;
  selectedPathId: string | null;
}

const BYDGOSZCZ_CENTER: L.LatLngExpression = [53.1235, 18.0084];

const CATEGORY_HEX_COLORS: Record<PathCategory, string> = {
  'legendy': '#a855f7', // purple-500
  'pomniki': '#3b82f6', // blue-500
  'ciekawostki': '#f59e0b', // amber-500
  'historia-xx': '#ef4444', // red-500
  'historia-wspolczesna': '#10b981', // emerald-500
};

const createIcon = (type: 'start' | 'checkpoint' | 'end' | 'locked' | 'completed', pathColor: string, order: number) => {
  const bgColor = type === 'locked' ? '#9ca3af' : type === 'completed' ? '#22c55e' : pathColor;
  const size = type === 'start' || type === 'end' ? 36 : 28;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bgColor};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size > 30 ? 14 : 12}px;
      font-weight: bold;
      color: white;
    ">
      ${type === 'locked' ? '🔒' : type === 'completed' ? '✓' : order}
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export function BydgoszczMap({ paths, onSelectCheckpoint, selectedPathId }: BydgoszczMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const { isGpsSimulated, hasStamp, getPathProgress, isCheckpointUnlocked } = useAppStore();

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: BYDGOSZCZ_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when path selection or state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    clearMarkers();

    const pathsToShow = selectedPathId 
      ? paths.filter(p => p.id === selectedPathId)
      : paths;

    pathsToShow.forEach((path) => {
      const pathColor = CATEGORY_HEX_COLORS[path.category] || '#6366f1'; // Use hex colors
      
      // Draw path line if a specific path is selected
      if (selectedPathId === path.id) {
        const coords = path.checkpoints.map(cp => cp.coordinates as L.LatLngExpression);
        polylineRef.current = L.polyline(coords, {
          color: pathColor,
          weight: 3,
          opacity: 0.6,
          dashArray: '10, 10',
        }).addTo(map);

        // Fit bounds to show all checkpoints
        if (coords.length > 0) {
          const bounds = L.latLngBounds(coords);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }

      // Add markers for each checkpoint
      path.checkpoints.forEach((checkpoint) => {
        const isCompleted = hasStamp(path.id, checkpoint.id);
        const isLocked = path.type === 'field' && !isGpsSimulated && !isCompleted;
        const isSequentiallyLocked = !isCheckpointUnlocked(path.id, checkpoint.order);
        const actuallyLocked = isLocked || (isSequentiallyLocked && !isCompleted);

        const isStart = checkpoint.order === 1;
        const isEnd = checkpoint.order === path.checkpoints.length;
        
        const iconType = isCompleted ? 'completed' : actuallyLocked ? 'locked' : isStart ? 'start' : isEnd ? 'end' : 'checkpoint';
        
        const marker = L.marker(checkpoint.coordinates, {
          icon: createIcon(iconType, pathColor, checkpoint.order),
        }).addTo(map);

        markersRef.current.push(marker);

        const progress = getPathProgress(path.id);
        const popupContent = `
          <div style="min-width: 200px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <img src="${path.imageUrl || '/images/spichrze.jpg'}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" />
              <div>
                <p style="font-size: 11px; color: #888; margin: 0;">${path.title}</p>
                <h3 style="font-weight: 600; font-size: 14px; margin: 0;">${checkpoint.title}</h3>
              </div>
            </div>
            <div style="display: flex; gap: 4px; margin-bottom: 8px; flex-wrap: wrap;">
              <span style="
                padding: 2px 8px;
                border-radius: 999px;
                font-size: 10px;
                background: ${path.type === 'field' ? '#fecaca' : '#fef3c7'};
                color: ${path.type === 'field' ? '#991b1b' : '#92400e'};
              ">
                ${path.type === 'field' ? '📍 Terenowe' : '🏠 Wirtualne'}
              </span>
              <span style="
                padding: 2px 8px;
                border-radius: 999px;
                font-size: 10px;
                background: #e5e7eb;
              ">
                ${checkpoint.order}/${path.checkpoints.length}
              </span>
            </div>
            <div style="background: #f3f4f6; border-radius: 4px; height: 4px; margin-bottom: 8px;">
              <div style="background: ${pathColor}; height: 100%; border-radius: 4px; width: ${(progress / path.checkpoints.length) * 100}%;"></div>
            </div>
            ${actuallyLocked 
              ? `<p style="font-size: 11px; color: #9ca3af;">🔒 ${isSequentiallyLocked ? 'Ukończ poprzedni punkt' : 'Włącz symulację GPS'}</p>`
              : isCompleted 
              ? '<p style="font-size: 11px; color: #22c55e;">✓ Ukończone</p>'
              : `<button id="start-btn-${checkpoint.id}" style="width: 100%; padding: 8px 12px; background: ${pathColor}; color: white; border: none; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: 500;">Rozpocznij wyzwanie</button>`
            }
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (!actuallyLocked && !isCompleted) {
            setTimeout(() => {
              const btn = document.getElementById(`start-btn-${checkpoint.id}`);
              if (btn) {
                btn.onclick = () => {
                  map.closePopup();
                  onSelectCheckpoint(path, checkpoint);
                };
              }
            }, 100);
          }
        });
      });
    });
  }, [paths, selectedPathId, isGpsSimulated, hasStamp, getPathProgress, isCheckpointUnlocked, onSelectCheckpoint, clearMarkers]);

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full z-0"
      style={{ background: '#e5e7eb' }}
    />
  );
}
