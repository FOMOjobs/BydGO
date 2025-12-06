import { MapPin, Locate } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/stores/appStore';
import { motion } from 'framer-motion';

export function GpsToggle() {
  const { isGpsSimulated, toggleGpsSimulation } = useAppStore();

  return (
    <motion.div 
      className="gps-toggle"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2">
        {isGpsSimulated ? (
          <Locate className="w-4 h-4 text-success" />
        ) : (
          <MapPin className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-xs whitespace-nowrap">
          DEV: Symuluj GPS
        </span>
      </div>
      <Switch
        checked={isGpsSimulated}
        onCheckedChange={toggleGpsSimulation}
        className="data-[state=checked]:bg-success"
      />
    </motion.div>
  );
}
