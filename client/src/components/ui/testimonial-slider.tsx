import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';
import { formatDate, getInitials, generateRandomColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    fullName: string;
  } | null;
}

export function TestimonialSlider() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const goToPrevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 8000);
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4">
      <div className="overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((offset) => {
                const index = (currentIndex + offset) % testimonials.length;
                const testimonial = testimonials[index];
                if (!testimonial) return null;

                return (
                  <Card key={`${testimonial.id}-${offset}`} className="bg-white dark:bg-gray-800 shadow-md h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                      <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-4">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center">
                        {testimonial.user ? (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                            style={{ backgroundColor: generateRandomColor(testimonial.user.username) }}
                          >
                            {getInitials(testimonial.user.fullName)}
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">
                            {testimonial.user ? testimonial.user.fullName : 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('home.testimonials.investor')} {formatDate(testimonial.createdAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -left-4 transform -translate-y-1/2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={goToNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex % testimonials.length
                ? 'w-8 bg-primary'
                : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
