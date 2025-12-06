import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, Bell, User, LogOut, Flag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '@/assets/mlody-krakow-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('PL');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Strona główna', href: '/' },
    { label: 'Wolontariaty', href: '/', scrollTo: 'wolontariaty' },
    { label: 'Kalendarz', href: '/calendar' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Młody Kraków" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              link.scrollTo ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(link.scrollTo);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate(link.href);
                    }
                  }}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              )
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-11 w-11">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuItem onClick={() => setLanguage('PL')} className="cursor-pointer">
                  <Flag className="mr-2 h-4 w-4" />
                  Polski {language === 'PL' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('UA')} className="cursor-pointer">
                  <Flag className="mr-2 h-4 w-4" />
                  Українська {language === 'UA' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('EN')} className="cursor-pointer">
                  <Flag className="mr-2 h-4 w-4" />
                  English {language === 'EN' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-11 w-11">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Profile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    Mój profil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Ustawienia
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj się
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={() => navigate('/auth')}>
                  Zaloguj się
                </Button>
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Zarejestruj się
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-11 w-11"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-2">
            {navLinks.map((link) => (
              link.scrollTo ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(link.scrollTo);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
