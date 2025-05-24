import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, StarHalf } from "lucide-react";

export function TestimonialsSection() {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      name: t('testimonials.person1.name'),
      since: t('testimonials.person1.since'),
      text: t('testimonials.person1.text'),
      rating: 5,
      initials: "АВ"
    },
    {
      name: t('testimonials.person2.name'),
      since: t('testimonials.person2.since'),
      text: t('testimonials.person2.text'),
      rating: 5,
      initials: "МК"
    },
    {
      name: t('testimonials.person3.name'),
      since: t('testimonials.person3.since'),
      text: t('testimonials.person3.text'),
      rating: 4.5,
      initials: "СП"
    },
    {
      name: t('testimonials.person4.name'),
      since: t('testimonials.person4.since'),
      text: t('testimonials.person4.text'),
      rating: 5,
      initials: "АД"
    }
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-accent text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-accent text-accent" />);
    }

    return <div className="flex text-accent">{stars}</div>;
  };

  return (
    <section id="reviews" className="py-16 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
        </div>
        
        <div className="testimonial-slider relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-all duration-500"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                  <div className="bg-white testimonial-gradient p-6 rounded-xl shadow-sm h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-primary flex items-center justify-center text-white font-medium">
                        {testimonial.initials}
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.since}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.text}</p>
                    {renderRating(testimonial.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-1/2 left-0 transform -translate-y-1/2 rounded-full z-10 bg-white"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full z-10 bg-white"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeSlide === index 
                    ? "w-6 bg-primary" 
                    : "w-6 bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
