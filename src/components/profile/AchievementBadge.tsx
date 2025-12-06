import obwarzanekBrown from '@/assets/obwarzanek-brown.png';
import obwarzanekSilver from '@/assets/obwarzanek-silver.png';
import obwarzanekBronze from '@/assets/obwarzanek-bronze.png';
import obwarzanekGold from '@/assets/obwarzanek-gold.png';
import obwarzanekDiamond from '@/assets/obwarzanek-diamond.png';
import { cn } from '@/lib/utils';

export type BadgeTier = 'szewczyk' | 'lajkonik' | 'smok' | 'bugle' | 'ambasador';

interface AchievementBadgeProps {
  tier: BadgeTier;
  activitiesCompleted: number;
  className?: string;
}

const badgeData: Record<BadgeTier, {
  name: string;
  image: string;
  color: string;
  minActivities: number;
  maxActivities?: number;
  description: string;
}> = {
  szewczyk: {
    name: 'Odkrywca Krakowa',
    image: obwarzanekBrown,
    color: 'from-amber-700 to-amber-900',
    minActivities: 1,
    maxActivities: 1,
    description: 'Pierwszy wolontariat ukończony! Mały krok, wielka przygoda 🎉'
  },
  lajkonik: {
    name: 'Galopujący Pomocnik',
    image: obwarzanekSilver,
    color: 'from-slate-400 to-slate-600',
    minActivities: 2,
    maxActivities: 5,
    description: 'Galopujesz jak prawdziwy Lajkonik! 2-5 wolontariatów 🐴'
  },
  smok: {
    name: 'Strażnik Smoka',
    image: obwarzanekBronze,
    color: 'from-orange-600 to-orange-800',
    minActivities: 6,
    maxActivities: 10,
    description: 'Chronisz miasto jak Smok Wawelski! 6-10 wolontariatów 🐉'
  },
  bugle: {
    name: 'Hejnalista Dobroci',
    image: obwarzanekGold,
    color: 'from-yellow-400 to-yellow-600',
    minActivities: 11,
    maxActivities: 20,
    description: 'Grasz jak hejnalista! 11-20 wolontariatów 🎺'
  },
  ambasador: {
    name: 'Ambasador Krakowa',
    image: obwarzanekDiamond,
    color: 'from-blue-400 to-blue-600',
    minActivities: 21,
    description: 'Największy honor! 20+ wolontariatów 👑'
  }
};

export function AchievementBadge({ tier, activitiesCompleted, className }: AchievementBadgeProps) {
  const badge = badgeData[tier];
  
  return (
    <div className={cn("relative group", className)}>
      <div className={`
        relative w-24 h-24 rounded-full 
        bg-gradient-to-br ${badge.color}
        flex items-center justify-center
        shadow-glow hover:scale-110 transition-transform duration-300
        cursor-pointer
        p-2
      `}>
        <img 
          src={badge.image} 
          alt={badge.name}
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
      
      {/* Tooltip on hover */}
      <div className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
        z-50
      ">
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
          <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
          <p className="text-xs mt-2 text-primary font-semibold">
            {activitiesCompleted} {activitiesCompleted === 1 ? 'wolontariat' : 'wolontariatów'}
          </p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
          <div className="border-8 border-transparent border-t-border" />
          <div className="border-8 border-transparent border-t-popover absolute top-0 left-1/2 -translate-x-1/2 -mt-px" />
        </div>
      </div>
    </div>
  );
}

export function getBadgeTier(activitiesCompleted: number): BadgeTier {
  if (activitiesCompleted >= 21) return 'ambasador';
  if (activitiesCompleted >= 11) return 'bugle';
  if (activitiesCompleted >= 6) return 'smok';
  if (activitiesCompleted >= 2) return 'lajkonik';
  return 'szewczyk';
}

export function getAllBadges(): BadgeTier[] {
  return ['szewczyk', 'lajkonik', 'smok', 'bugle', 'ambasador'];
}
