import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Jak mogę zacząć wolontariat?",
      answer: "To proste! Zarejestruj się na platformie, przeglądaj dostępne oferty i aplikuj jednym kliknięciem. Jeśli jesteś małoletni/a (poniżej 18 lat), będziesz potrzebować zgody rodzica. Po zaakceptowaniu aplikacji otrzymasz email z potwierdzeniem i wszystkimi szczegółami."
    },
    {
      question: "Czy muszę płacić za korzystanie z platformy?",
      answer: "Nie! Platforma jest całkowicie darmowa dla wszystkich - wolontariuszy, organizacji i koordynatorów szkolnych. Naszą misją jest ułatwienie dostępu do wolontariatu wszystkim młodym mieszkańcom Krakowa."
    },
    {
      question: "Ile czasu muszę poświęcić na wolontariat?",
      answer: "To zależy od Ciebie! Oferujemy wolontariaty od jednorazowych akcji trwających 2-3 godziny, po regularne projekty wymagające kilku godzin tygodniowo. Każda oferta ma jasno określony czas trwania - wybieraj według swojego kalendarza."
    },
    {
      question: "Czy otrzymam zaświadczenie o wolontariacie?",
      answer: "Tak! Po ukończeniu każdego wolontariatu organizacja automatycznie wygeneruje dla Ciebie zaświadczenie PDF z kodem QR do weryfikacji. Wszystkie zaświadczenia są przechowywane w Twoim profilu w sekcji \"Moje zaświadczenia\"."
    },
    {
      question: "Jak zdobywam odznaki i osiągnięcia?",
      answer: "Odznaki odblokowujesz automatycznie wykonując wolontariaty! System składa się z 5 poziomów inspirowanych legendami Krakowa - od \"Szewczyka Dratewki\" (pierwszy wolontariat) do \"Ambasadora Krakowa\" (20+ wolontariatów)."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-foreground">
            Najczęściej zadawane pytania
          </h2>
          <p className="text-lg text-muted-foreground">
            Wszystko, co musisz wiedzieć o wolontariacie
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-xl overflow-hidden transition-all hover:border-primary/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-muted/50 hover:bg-muted transition"
              >
                <span className="font-semibold text-lg text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="p-5 bg-card border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* More Questions CTA */}
        <div className="mt-8 text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
          <p className="text-lg font-semibold text-foreground mb-2">
            📚 Masz więcej pytań?
          </p>
          <p className="text-muted-foreground mb-4">
            Znajdziesz odpowiedzi na wszystkie pytania na naszej stronie FAQ
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/faq"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Pełne FAQ
            </Link>
            <a
              href="mailto:pomoc@wolontariat.krakow.pl"
              className="inline-block bg-card text-primary px-6 py-2 rounded-lg font-semibold border-2 border-primary hover:bg-primary hover:text-primary-foreground transition"
            >
              Napisz do nas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
