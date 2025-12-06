import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart } from 'lucide-react';

type UserType = 'volunteer' | 'organization' | 'school_coordinator';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<UserType>('volunteer');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: '❌ Błąd logowania',
          description: error.message === 'Invalid login credentials' 
            ? 'Nieprawidłowy email lub hasło' 
            : error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: '✅ Zalogowano pomyślnie!',
          description: 'Witamy z powrotem! 🎉',
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Ups! Coś poszło nie tak',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (signupPassword !== signupPasswordConfirm) {
      toast({
        variant: 'destructive',
        title: '❌ Błąd',
        description: 'Hasła nie są identyczne',
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: '❌ Błąd',
        description: 'Hasło musi mieć minimum 6 znaków',
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            date_of_birth: userType === 'volunteer' ? dateOfBirth : null,
          },
        },
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: '❌ Błąd rejestracji',
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: '✅ Udało się! Konto utworzone!',
          description: 'Możesz się teraz zalogować 🎉',
        });
        
        // Auto-login since email is auto-confirmed
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: signupEmail,
          password: signupPassword,
        });

        if (!loginError) {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '❌ Ups! Coś poszło nie tak',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in and redirect
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-white fill-white" />
            <h1 className="text-3xl font-bold text-white">
              Młody <span className="text-secondary">Kraków</span>
            </h1>
          </div>
          <p className="text-white/90">Dołącz do społeczności wolontariuszy!</p>
        </div>

        <Card className="border-0 shadow-glow">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Logowanie</TabsTrigger>
              <TabsTrigger value="signup">Rejestracja</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Zaloguj się</CardTitle>
                <CardDescription>Wpisz swoje dane, żeby się zalogować</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="twoj@email.pl"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Hasło</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button variant="outline" type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Zaloguj się
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Dołącz do nas!</CardTitle>
                <CardDescription>Utwórz nowe konto</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-3">
                    <Label>Kim jesteś?</Label>
                    <RadioGroup value={userType} onValueChange={(v) => setUserType(v as UserType)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="volunteer" id="volunteer" />
                        <Label htmlFor="volunteer" className="cursor-pointer font-normal">
                          Wolontariusz
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="organization" id="organization" />
                        <Label htmlFor="organization" className="cursor-pointer font-normal">
                          Organizacja
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="school_coordinator" id="coordinator" />
                        <Label htmlFor="coordinator" className="cursor-pointer font-normal">
                          Koordynator Szkolny
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Imię</Label>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder="Jan"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Nazwisko</Label>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder="Kowalski"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {userType === 'volunteer' && (
                    <div className="space-y-2">
                      <Label htmlFor="dob">Data urodzenia</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        required
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="twoj@email.pl"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Hasło (min. 6 znaków)</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password-confirm">Potwierdź hasło</Label>
                    <Input
                      id="signup-password-confirm"
                      type="password"
                      placeholder="••••••"
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>

                  {(userType === 'organization' || userType === 'school_coordinator') && (
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                      <p className="text-muted-foreground">
                        ⏳ Twoje konto będzie czekać na weryfikację. Skontaktujemy się z Tobą wkrótce!
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Zapisz się!
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/')} className="text-white hover:text-white/80">
            ← Wróć do strony głównej
          </Button>
        </div>
      </div>
    </div>
  );
}
