import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  userId: number;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
  user?: {
    username: string;
    location?: string;
  };
}

const Testimonials = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const { data, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Default testimonials in case API returns empty
  const defaultTestimonials = [
    {
      id: 1,
      userId: 1,
      content: "«Инвестирую на платформе уже полгода. Очень доволен стабильными выплатами и профессиональной поддержкой. Особенно нравится прозрачность работы и быстрый вывод средств.»",
      rating: 5,
      isApproved: true,
      createdAt: "2022-10-15",
      user: {
        username: "Алексей В.",
        location: "Москва"
      }
    },
    {
      id: 2,
      userId: 2,
      content: "«Начала с минимальной суммы на базовом тарифе, через месяц перешла на премиум. Результаты превзошли ожидания — доходность стабильная, интерфейс понятный, служба поддержки отзывчивая.»",
      rating: 5,
      isApproved: true,
      createdAt: "2021-06-22",
      user: {
        username: "Марина К.",
        location: "Санкт-Петербург"
      }
    },
    {
      id: 3,
      userId: 3,
      content: "«Пользуюсь элитным тарифом уже 3 месяца. Ежедневный доход в 15% позволил значительно увеличить первоначальные инвестиции. Сервис работает как часы, все выплаты вовремя.»",
      rating: 5,
      isApproved: true,
      createdAt: "2022-08-10",
      user: {
        username: "Сергей П.",
        location: "Екатеринбург"
      }
    },
    {
      id: 4,
      userId: 4,
      content: "«Привлекла реферальная программа и высокие показатели доходности. После первого месяца убедилась в надежности платформы. Особенно радует детальная статистика и прозрачность операций.»",
      rating: 5,
      isApproved: true,
      createdAt: "2021-11-18",
      user: {
        username: "Анна Д.",
        location: "Казань"
      }
    }
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      setTestimonials(data);
    } else if (!isLoading) {
      setTestimonials(defaultTestimonials);
    }
  }, [data, isLoading]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <section id="reviews" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded max-w-md mx-auto mb-16"></div>
            <div className="flex justify-center">
              <div className="bg-gray-200 h-64 w-full max-w-md rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('testimonials.description')}</p>
        </motion.div>
        
        <div className="testimonial-slider relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <motion.div 
              className="flex transition-all duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full md:w-full flex-shrink-0 px-4">
                  <Card className="testimonial-gradient h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{testimonial.content}</p>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarFallback className="bg-primary text-white">
                            {testimonial.user?.username ? getInitials(testimonial.user.username) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold">{testimonial.user?.username || "Пользователь"}</h4>
                          <p className="text-sm text-gray-500">
                            {testimonial.user?.location && `${testimonial.user.location}, `}
                            {t('testimonials.investor')} {new Date(testimonial.createdAt).getFullYear()} {t('testimonials.year')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation Buttons */}
          <Button 
            variant="outline" 
            size="icon"
            className="testimonial-prev absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full shadow-md z-10 text-primary hover:bg-primary hover:text-white transition"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline"
            size="icon"
            className="testimonial-next absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full shadow-md z-10 text-primary hover:bg-primary hover:text-white transition"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                type="button" 
                className={`slide-indicator h-1.5 w-6 bg-gray-300 rounded-full transition-all duration-300 ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
