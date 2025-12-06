import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import happyVolunteers from '@/assets/happy-volunteers.jpg';

const photos = [
  {
    url: happyVolunteers,
    overlay: 'Dołącz do nas!',
    subtitle: '500+ wolontariuszy już pomaga'
  },
  {
    url: happyVolunteers,
    overlay: 'Zmień świat razem z nami!',
    subtitle: '40+ inicjatyw czeka na Ciebie'
  },
  {
    url: happyVolunteers,
    overlay: 'Znajdź swoją pasję',
    subtitle: 'Wolontariat w każdej dzielnicy Krakowa'
  }
];

export const PhotoCarousel = () => {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={photos[currentPhoto].url}
            alt="Wolontariusze w akcji"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Text overlay */}
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-3xl font-bold mb-2">
              {photos[currentPhoto].overlay}
            </h3>
            <p className="text-lg">
              {photos[currentPhoto].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPhoto(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentPhoto 
                ? 'bg-white' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Zdjęcie ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
