import { useState } from 'react';
import { UserCheck, Search, MapPin, Sparkles, FileText, Mail, PartyPopper, Map, Target, Calendar, MousePointer, MessageCircle, Award, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FlashcardsSection = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      icon: UserCheck,
      title: "Zarejestruj się",
      subtitle: "Stwórz darmowe konto w 2 minuty",
      details: [
        { icon: FileText, text: "Wypełnij prosty formularz" },
        { icon: Mail, text: "Potwierdź email" },
        { icon: PartyPopper, text: "Gotowe - możesz zacząć!" }
      ]
    },
    {
      number: 2,
      icon: Search,
      iconSecondary: MapPin,
      title: "Znajdź wolontariat",
      subtitle: "Przeglądaj oferty na mapie lub liście",
      details: [
        { icon: Map, text: "Użyj mapy lub wyszukiwarki" },
        { icon: Target, text: "Filtruj po kategorii i lokalizacji" },
        { icon: Calendar, text: "Sprawdź kalendarz wydarzeń" }
      ]
    },
    {
      number: 3,
      icon: Sparkles,
      title: "Aplikuj i działaj!",
      subtitle: "Jedno kliknięcie i jesteś wolontariuszem",
      details: [
        { icon: MousePointer, text: "Kliknij 'Aplikuj teraz'" },
        { icon: MessageCircle, text: "Czatuj z organizacją" },
        { icon: Award, text: "Zbieraj odznaki i zaświadczenia" }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3 text-foreground">
            Jak to działa?
          </h2>
          <p className="text-lg text-muted-foreground">
            Zacznij pomagać w trzech prostych krokach
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative h-64 sm:h-72 md:h-80 cursor-pointer perspective-1000"
              onMouseEnter={() => setFlippedCard(index)}
              onMouseLeave={() => setFlippedCard(null)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  flippedCard === index ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT SIDE */}
                <div className="absolute inset-0 backface-hidden bg-card rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-border">
                  {/* Number Badge */}
                  <div
                    className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl step-badge-${step.number}`}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative step-bg-${step.number}`}
                  >
                    <step.icon
                      className={`w-12 h-12 step-icon-${step.number}`}
                      strokeWidth={2}
                    />
                    {step.iconSecondary && (
                      <step.iconSecondary
                        className={`w-6 h-6 absolute -bottom-1 -right-1 step-icon-${step.number}`}
                        strokeWidth={2}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-bold mb-3 text-black dark:text-white text-center">
                    {step.title}
                  </h3>
                  <p className="text-black/80 dark:text-white/80 text-center">
                    {step.subtitle}
                  </p>

                  {/* Hover hint */}
                  <p className="absolute bottom-6 text-sm text-black/60 dark:text-white/60">
                    Najedź aby zobaczyć więcej
                  </p>
                </div>

                {/* BACK SIDE */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-xl p-8 flex flex-col justify-center text-white step-back-${step.number}`}
                >
                  <h4 className="text-xl font-bold mb-6 text-center">
                    {step.title}
                  </h4>
                  <ul className="space-y-4">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <detail.icon className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2} />
                        <span className="text-lg">
                          {detail.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-3xl font-bold mb-6 text-foreground">
            Zmieniajże Kraków razem z nami!
          </h3>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Zacznij już teraz!
            <Rocket className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
