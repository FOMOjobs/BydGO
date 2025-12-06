import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Path, Checkpoint, API_URL, WPScenariusz, mapWPScenariuszToPath } from '@/data/paths';
import { BydgoszczMap } from '@/components/map/BydgoszczMap';
import { CheckpointDrawer } from '@/components/scenario/CheckpointDrawer';
import { PathSelector } from '@/components/map/PathSelector';
import { GpsToggle } from '@/components/map/GpsToggle';
import { AppLayout, ActiveView } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import bydgoLogo from '@/assets/bydgo-logo.png';
import { LoginRegisterPopup } from '@/components/auth/LoginRegisterPopup';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import KolekcjaPage from './KolekcjaPage';
import CreatorPage from './CreatorPage';
import KontoPage from './KontoPage';

export default function MapPage() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('map');
  
  const { isLoggedIn, username, logout } = useAppStore();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(!isLoggedIn);

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

  const handleSelectCheckpoint = (path: Path, checkpoint: Checkpoint) => {
    setSelectedPath(path);
    setSelectedCheckpoint(checkpoint);
  };

  const handleCloseDrawer = () => {
    setSelectedPath(null);
    setSelectedCheckpoint(null);
  };

  const handleLogout = () => {
    logout();
    setIsAuthPopupOpen(true);
  };

  return (
    <AppLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'map' && (
        <div className="relative h-[calc(100vh-4rem)]">
          {/* Header */}
          <motion.div 
            className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-background via-background/80 to-transparent p-4 pb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3">
                <img src={bydgoLogo} alt="BydGO!" className="w-10 h-10 object-contain" />
                <div>
                  <h1 className="text-xl font-bold">BydGO!</h1>
                  <p className="text-sm text-muted-foreground">Odkrywaj historię miasta</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {isLoggedIn && username && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {username}
                  </Button>
                )}
                <GpsToggle />
              </div>
            </div>
          </motion.div>

          <BydgoszczMap 
            paths={paths}
            onSelectCheckpoint={handleSelectCheckpoint}
            selectedPathId={selectedPathId}
          />
          <PathSelector 
            paths={paths}
            isLoading={isLoading}
            selectedPathId={selectedPathId}
            onSelectPath={setSelectedPathId}
          />
          <CheckpointDrawer
            path={selectedPath}
            checkpoint={selectedCheckpoint}
            onClose={handleCloseDrawer}
          />
        </div>
      )}

      {activeView === 'kolekcja' && <KolekcjaPage />}
      {activeView === 'kreator' && <CreatorPage />}
      {activeView === 'konto' && <KontoPage />}

      <LoginRegisterPopup 
        isOpen={isAuthPopupOpen} 
        onClose={() => setIsAuthPopupOpen(false)} 
      />
    </AppLayout>
  );
}
