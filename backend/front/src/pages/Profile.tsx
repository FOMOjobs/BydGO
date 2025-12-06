import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { AccessibilityBar } from '@/components/AccessibilityBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AchievementBadge, getBadgeTier, getAllBadges } from '@/components/profile/AchievementBadge';
import { Calendar, MapPin, Mail, Phone, Award, Upload, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type UserType = 'volunteer' | 'organization' | 'school_coordinator';
type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface Profile {
  id: string;
  user_type: UserType;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  phone: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  verification_status: VerificationStatus;
}

interface MinorConsent {
  status: 'pending' | 'approved' | 'rejected';
  parent_name: string;
  parent_email: string;
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [minorConsent, setMinorConsent] = useState<MinorConsent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMinor, setIsMinor] = useState(false);
  
  // Mock data for demonstration
  const activitiesCompleted = 3;
  const totalHours = 12;
  const currentBadge = getBadgeTier(activitiesCompleted);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, navigate]);

  const loadProfile = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Check if minor
      if (profileData.user_type === 'volunteer' && profileData.date_of_birth) {
        const age = new Date().getFullYear() - new Date(profileData.date_of_birth).getFullYear();
        setIsMinor(age < 18);

        if (age < 18) {
          // Fetch minor consent status
          const { data: consentData } = await supabase
            .from('minor_consent')
            .select('status, parent_name, parent_email')
            .eq('volunteer_id', user!.id)
            .single();

          if (consentData) {
            setMinorConsent(consentData);
          }
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Błąd ładowania profilu',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Zweryfikowane ✓
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-primary text-primary">
            <Clock className="h-3 w-3 mr-1" />
            Oczekuje na weryfikację
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Odrzucone
          </Badge>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
              {profile.user_type === 'volunteer' && activitiesCompleted >= 1 && (
                <div className="absolute -bottom-2 -right-2">
                  <AchievementBadge 
                    tier={currentBadge} 
                    activitiesCompleted={activitiesCompleted}
                    className="scale-75"
                  />
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-3xl font-bold">
                {profile.first_name} {profile.last_name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {profile.user_type === 'volunteer' && 'Wolontariusz'}
                  {profile.user_type === 'organization' && 'Organizacja'}
                  {profile.user_type === 'school_coordinator' && 'Koordynator Szkolny'}
                </Badge>
                {getVerificationBadge(profile.verification_status)}
              </div>
            </div>
          </div>

          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edytuj profil
          </Button>
        </div>

        {/* Minor Consent Warning */}
        {isMinor && !minorConsent && (
          <Card className="mb-6 border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Wymagana zgoda rodzica</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Jesteś niepełnoletni/a. Musisz przesłać zgodę rodzica, żeby móc aplikować do wolontariatów.
                  </p>
                  <Button size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Prześlij zgodę rodzica
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {minorConsent && minorConsent.status === 'pending' && (
          <Card className="mb-6 border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Zgoda rodzica wysłana</h3>
                  <p className="text-sm text-muted-foreground">
                    Czekamy na weryfikację zgody od {minorConsent.parent_name}. Wkrótce będziesz mógł/mogła aplikować!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            {profile.user_type === 'volunteer' && (
              <>
                <TabsTrigger value="achievements">Osiągnięcia</TabsTrigger>
                <TabsTrigger value="history">Historia</TabsTrigger>
              </>
            )}
            <TabsTrigger value="settings">Ustawienia</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Stats Cards - Volunteer Only */}
              {profile.user_type === 'volunteer' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Ukończone wolontariaty
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">
                        {activitiesCompleted}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Przepracowane godziny
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-secondary">
                        {totalHours}h
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Aktualny poziom
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <AchievementBadge 
                          tier={currentBadge} 
                          activitiesCompleted={activitiesCompleted}
                          className="scale-75"
                        />
                        <div className="text-lg font-semibold">
                          {currentBadge === 'szewczyk' && 'Szewczyk'}
                          {currentBadge === 'lajkonik' && 'Lajkonik'}
                          {currentBadge === 'smok' && 'Strażnik'}
                          {currentBadge === 'bugle' && 'Mistrz'}
                          {currentBadge === 'ambasador' && 'Ambasador'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Informacje kontaktowe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  
                  {profile.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  )}

                  {profile.date_of_birth && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Data urodzenia</p>
                      <p className="font-medium">
                        {new Date(profile.date_of_birth).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">O mnie</p>
                      <p className="text-sm">{profile.bio}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {profile.user_type === 'volunteer' && (
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Krakowskie Legendy - Odznaki Wolontariusza
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Zbieraj odznaki za swoje zaangażowanie! Każdy wolontariat przybliża Cię do kolejnego poziomu.
                  </p>
                  
                  <div className="flex justify-center gap-8 flex-wrap">
                    {getAllBadges().map((badgeTier, index) => {
                      const isUnlocked = activitiesCompleted >= (
                        badgeTier === 'szewczyk' ? 1 :
                        badgeTier === 'lajkonik' ? 2 :
                        badgeTier === 'smok' ? 6 :
                        badgeTier === 'bugle' ? 11 : 21
                      );
                      
                      return (
                        <div 
                          key={badgeTier}
                          className={`transition-all ${!isUnlocked && 'opacity-30 grayscale'}`}
                        >
                          <AchievementBadge 
                            tier={badgeTier} 
                            activitiesCompleted={activitiesCompleted}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-6" />
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Postęp do następnego poziomu
                    </p>
                    <div className="max-w-md mx-auto">
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, (activitiesCompleted / 6) * 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {activitiesCompleted < 6 
                          ? `${6 - activitiesCompleted} wolontariatów do "Strażnik Smoka"`
                          : activitiesCompleted < 11
                          ? `${11 - activitiesCompleted} wolontariatów do "Mistrz Bugle"`
                          : activitiesCompleted < 21
                          ? `${21 - activitiesCompleted} wolontariatów do "Ambasador Krakowa"`
                          : 'Osiągnięto maksymalny poziom! 🎉'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {profile.user_type === 'volunteer' && (
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historia wolontariatów</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Brak ukończonych wolontariatów. Czas to zmienić! 🚀
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ustawienia konta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ustawienia będą dostępne wkrótce...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AccessibilityBar />
    </div>
  );
}
