import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore'; // Import useAppStore

interface LoginRegisterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginRegisterPopup({ isOpen, onClose }: LoginRegisterPopupProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);


  const { login } = useAppStore(); // Get the login action from the store

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch('https://bydgo.lisowska26.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming the API returns a token and user_display_name on success
        login(data.token, data.user_display_name);
        onClose(); // Close the popup on successful login
      } else {
        // Handle specific error messages from the API if available
        let errorMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
        if (data && data.code === 'jwt_auth_failed') {
          errorMessage = 'Nieprawidłowa nazwa użytkownika lub hasło.';
        } else if (data && data.message) {
          errorMessage = data.message;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Błąd połączenia z serwerem. Sprawdź swoje połączenie internetowe.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegistrationSuccess(false);
    setIsRegistering(true);

    if (passwordInput !== confirmPasswordInput) {
      setError('Hasła nie są takie same.');
      setIsRegistering(false);
      return;
    }

    try {
      const response = await fetch('https://bydgo.lisowska26.com/wp-json/app/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameInput,
          email: emailInput,
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrationSuccess(true);
        setUsernameInput('');
        setEmailInput('');
        setPasswordInput('');
        setConfirmPasswordInput('');
        setActiveTab('login');
      } else {
        let errorMessage = 'Wystąpił nieoczekiwany błąd podczas rejestracji.';
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.data && data.data.params) {
          // Attempt to extract more specific errors from 'params' field
          const paramErrors = Object.values(data.data.params).join(', ');
          errorMessage = `Błąd walidacji: ${paramErrors}`;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Błąd połączenia z serwerem. Sprawdź swoje połączenie internetowe.');
    } finally {
      setIsRegistering(false);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-2xl font-bold text-center mb-6">Witaj w BydGO!</h2>

            <div className="flex justify-center mb-6 border-b border-border">
              <button
                onClick={() => { setActiveTab('login'); setError(null); setRegistrationSuccess(false); }}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2",
                  activeTab === 'login' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Logowanie
              </button>
              <button
                onClick={() => { setActiveTab('register'); setError(null); setRegistrationSuccess(false); }}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2",
                  activeTab === 'register' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Rejestracja
              </button>
            </div>

            {registrationSuccess && (
                <p className="text-green-500 text-sm text-center mb-4">Rejestracja zakończona sukcesem! Możesz się teraz zalogować.</p>
            )}

            {activeTab === 'login' && (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nazwa użytkownika / E-mail"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Hasło"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Zaloguj się
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Nie masz konta?{" "}
                  <button type="button" onClick={() => setActiveTab('register')} className="text-primary hover:underline">
                    Zarejestruj się
                  </button>
                </p>
              </form>
            )}

            {activeTab === 'register' && (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Hasło"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Potwierdź hasło"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center"
                  disabled={isRegistering}
                >
                  {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Zarejestruj się
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Masz już konto?{" "}
                  <button type="button" onClick={() => setActiveTab('login')} className="text-primary hover:underline">
                    Zaloguj się
                  </button>
                </p>
              </form>
            )}
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
