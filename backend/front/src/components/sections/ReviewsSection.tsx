import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import obwarzanekIcon from '@/assets/icon-obwarzanek.png';
import smokIcon from '@/assets/icon-smok.png';
import wiezaIcon from '@/assets/icon-wieza.png';
import golabIcon from '@/assets/icon-golab.png';
import obwarzanekOrangeIcon from '@/assets/icon-obwarzanek-orange.png';
import smokPinkIcon from '@/assets/icon-smok-pink.png';

export const ReviewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      name: "Ania Kowalska",
      age: 17,
      avatar: obwarzanekIcon,
      rating: 5,
      badge: "raczacy-lajkonik",
      badgeName: "Rączący Lajkonik",
      volunteersCompleted: 4,
      quote: "Dzięki tej platformie znalazłam wolontariat w schronisku dla zwierząt - spełniło się moje marzenie! Aplikacja jest super prosta, a powiadomienia przypominają mi o wydarzeniach.",
      category: "Ekologia"
    },
    {
      id: 2,
      name: "Michał Nowak",
      age: 19,
      avatar: smokIcon,
      rating: 5,
      badge: "straznik-smoka",
      badgeName: "Strażnik Smoka",
      volunteersCompleted: 8,
      quote: "Jako student mogę łatwo znaleźć wolontariaty dopasowane do mojego grafiku. Zdobyłem już 3 zaświadczenia, które pomogą mi w karierze. Polecam każdemu!",
      category: "Edukacja"
    },
    {
      id: 3,
      name: "Zosia Wiśniewska",
      age: 16,
      avatar: wiezaIcon,
      rating: 5,
      badge: "szewczyk-dratewka",
      badgeName: "Szewczyk Dratewka",
      volunteersCompleted: 1,
      quote: "Pierwszy wolontariat za mną! Byłam trochę zestresowana, ale organizacja była super pomocna, a chat bardzo ułatwił komunikację. Już wybieram następny!",
      category: "Kultura"
    },
    {
      id: 4,
      name: "Kacper Zieliński",
      age: 18,
      avatar: golabIcon,
      rating: 5,
      badge: "mistrz-bugle",
      badgeName: "Mistrz Bugle",
      volunteersCompleted: 15,
      quote: "Mapa wolontariatów to genialne rozwiązanie! Mogę zobaczyć co dzieje się w mojej dzielnicy i dojechać wszędzie wygodnie. Odznaki motywują do dalszego działania!",
      category: "Sport"
    },
    {
      id: 5,
      name: "Maja Lewandowska",
      age: 17,
      avatar: obwarzanekOrangeIcon,
      rating: 5,
      badge: "raczacy-lajkonik",
      badgeName: "Rączący Lajkonik",
      volunteersCompleted: 5,
      quote: "Cała moja klasa korzysta z tej platformy! Nasz koordynator zapisuje nas grupowo i robimy wolontariaty razem. To świetna zabawa i pomagamy innym!",
      category: "Pomoc społeczna"
    },
    {
      id: 6,
      name: "Jakub Wójcik",
      age: 20,
      avatar: smokPinkIcon,
      rating: 5,
      badge: "ambasador-krakowa",
      badgeName: "Ambasador Krakowa",
      volunteersCompleted: 23,
      quote: "Wolontuję już od 2 lat i ta platforma naprawdę ułatwiła mi życie. Wszystko w jednym miejscu - kalendarz, czat, zaświadczenia. Nie wyobrażam sobie bez tego!",
      category: "Wszystkie"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Ekologia': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Edukacja': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Kultura': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Sport': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Pomoc społeczna': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      'Wszystkie': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-foreground">
            Co mówią wolontariusze?
          </h2>
          <p className="text-lg text-muted-foreground">
            Prawdziwe opinie naszej społeczności
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / 3)}%)`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-full md:w-1/3 px-4"
                >
                  <div className="bg-muted/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full border border-border">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{review.quote}"
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      {/* Avatar */}
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {review.name}, {review.age}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            🏅 {review.badgeName}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {review.volunteersCompleted} wolontariatów
                          </span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(review.category)}`}>
                        {review.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition z-10"
            aria-label="Poprzednia opinia"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition z-10"
            aria-label="Następna opinia"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(index);
                }}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 w-3 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Przejdź do opinii ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-primary/10 to-secondary/10 px-8 py-4 rounded-full">
            <div>
              <p className="text-3xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">Średnia ocen</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div>
              <p className="text-3xl font-bold text-secondary">500+</p>
              <p className="text-sm text-muted-foreground">Zadowolonych wolontariuszy</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div>
              <p className="text-3xl font-bold text-accent">1000+</p>
              <p className="text-sm text-muted-foreground">Ukończonych wolontariatów</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Dołącz do naszej społeczności i zostaw swoją opinię!
          </p>
          <Link
            to="/auth"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-lg"
          >
            Rozpocznij wolontariat
          </Link>
        </div>
      </div>
    </section>
  );
};
