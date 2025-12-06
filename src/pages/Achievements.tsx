import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Lock } from "lucide-react";
import { AchievementBadge, getBadgeTier, getAllBadges } from "@/components/profile/AchievementBadge";
import type { BadgeTier } from "@/components/profile/AchievementBadge";

interface Certificate {
  id: string;
  opportunity_title: string;
  organization_name: string;
  issue_date: string;
  hours_completed: number;
}

const badgeRequirements: Record<BadgeTier, { min: number; max?: number; name: string; description: string }> = {
  szewczyk: { min: 1, max: 1, name: 'Odkrywca Bydgoszczy', description: 'Pierwszy krok w grze miejskiej!' },
  lajkonik: { min: 2, max: 5, name: 'Tropiciel Spichrzów', description: 'Już kilka wyzwań za sobą' },
  smok: { min: 6, max: 10, name: 'Strażnik Brdy', description: 'Chronisz historię jak prawdziwy bohater' },
  bugle: { min: 11, max: 20, name: 'Szyfrant Rejewskiego', description: 'Rozszyfrowujesz tajemnice miasta' },
  ambasador: { min: 21, name: 'Ambasador Bydgoszczy', description: 'Legenda gry miejskiej!' },
};

export default function Achievements() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('volunteer_id', user?.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const activitiesCompleted = certificates.length;
  const currentTier = getBadgeTier(activitiesCompleted);
  const allBadges = getAllBadges();
  const unlockedBadges = allBadges.filter(
    badge => activitiesCompleted >= badgeRequirements[badge].min
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Twoje Osiągnięcia</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Odblokowano: <span className="font-bold text-primary">{unlockedBadges.length}</span> / {allBadges.length}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Ładowanie osiągnięć...</div>
          </div>
        ) : (
          <>
            {/* Current Achievement */}
            <Card className="mb-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
              <CardContent className="py-12 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <AchievementBadge 
                      tier={currentTier} 
                      activitiesCompleted={activitiesCompleted}
                      className="transform scale-150"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {badgeRequirements[currentTier].name}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-4">
                      {badgeRequirements[currentTier].description}
                    </p>
                    <div className="inline-block bg-primary/10 px-6 py-2 rounded-full">
                      <span className="text-2xl font-bold text-primary">
                        {activitiesCompleted}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {activitiesCompleted === 1 ? 'wyzwanie' : 'wyzwań'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Achievements Grid */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Wszystkie Osiągnięcia</h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                {allBadges.map((badge) => {
                  const isUnlocked = activitiesCompleted >= badgeRequirements[badge].min;
                  const requirement = badgeRequirements[badge];
                  
                  return (
                    <Card 
                      key={badge}
                      className={`relative transition-all ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-card to-card hover:shadow-xl border-2 border-primary/20' 
                          : 'bg-muted/50 opacity-60'
                      }`}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="relative">
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80 rounded-full">
                              <Lock className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <AchievementBadge 
                            tier={badge} 
                            activitiesCompleted={activitiesCompleted}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">
                            {requirement.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {requirement.description}
                          </p>
                          <div className="text-xs font-semibold">
                            {requirement.max
                              ? `${requirement.min}-${requirement.max} wyzwań`
                              : `${requirement.min}+ wyzwań`
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Progress to next badge */}
            {currentTier !== 'ambasador' && (
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="py-8 text-center">
                  <h3 className="text-xl font-bold mb-4">Następny Poziom</h3>
                  {(() => {
                    const nextBadgeIndex = allBadges.indexOf(currentTier) + 1;
                    const nextBadge = allBadges[nextBadgeIndex];
                    const nextRequirement = badgeRequirements[nextBadge];
                    const remaining = nextRequirement.min - activitiesCompleted;
                    
                    return (
                      <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {activitiesCompleted} / {nextRequirement.min}
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {nextRequirement.name}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-primary h-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min((activitiesCompleted / nextRequirement.min) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Jeszcze {remaining} {remaining === 1 ? 'wyzwanie' : 'wyzwań'}!
                        </p>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
