import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Testimonial = {
  id: number;
  name: string;
  position: string;
  content: string;
  rating: number;
};

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate testimonials from translations
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: t('testimonials.person1.name'),
      position: t('testimonials.person1.position'),
      content: t('testimonials.person1.content'),
      rating: 5,
    },
    {
      id: 2,
      name: t('testimonials.person2.name'),
      position: t('testimonials.person2.position'),
      content: t('testimonials.person2.content'),
      rating: 5,
    },
    {
      id: 3,
      name: t('testimonials.person3.name'),
      position: t('testimonials.person3.position'),
      content: t('testimonials.person3.content'),
      rating: 4.5,
    },
    {
      id: 4,
      name: t('testimonials.person4.name'),
      position: t('testimonials.person4.position'),
      content: t('testimonials.person4.content'),
      rating: 5,
    },
  ];
  
  const totalSlides = testimonials.length;
  
  const goToSlide = (slideIndex: number) => {
    let newIndex = slideIndex;
    
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= totalSlides) {
      newIndex = totalSlides - 1;
    }
    
    setCurrentSlide(newIndex);
    
    if (slideContainerRef.current) {
      const slideWidth = slideContainerRef.current.offsetWidth;
      slideContainerRef.current.style.transform = `translateX(-${newIndex * slideWidth}px)`;
    }
  };
  
  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };
  
  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };
  
  // Set up auto sliding
  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, totalSlides]);
  
  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
        </div>
        
        <div className="testimonial-slider relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div ref={slideContainerRef} className="testimonial-slides flex transition-all duration-500 transform">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="testimonial-slide w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white testimonial-gradient p-6 rounded-xl shadow-sm h-full">
                    <div className="flex items-center mb-4">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.content}</p>
                    <div className="flex text-accent">
                      {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                      {testimonial.rating % 1 !== 0 && (
                        <i className="fas fa-star-half-alt"></i>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="testimonial-prev absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 z-10 rounded-full bg-white hover:bg-primary hover:text-white transition-colors"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="testimonial-next absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 z-10 rounded-full bg-white hover:bg-primary hover:text-white transition-colors"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`slide-indicator h-1.5 w-6 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-primary active w-2' : 'bg-gray-300'
                }`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
