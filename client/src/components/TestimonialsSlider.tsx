import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestimonialItem } from "@/types";

// Sample testimonials
const testimonials: TestimonialItem[] = [
  {
    name: "Алексей В.",
    location: "Москва",
    rating: 5,
    text: "Инвестирую на платформе уже полгода. Очень доволен стабильными выплатами и профессиональной поддержкой. Особенно нравится прозрачность работы и быстрый вывод средств.",
    initials: "АВ"
  },
  {
    name: "Марина К.",
    location: "Санкт-Петербург",
    rating: 5,
    text: "Начала с минимальной суммы на базовом тарифе, через месяц перешла на премиум. Результаты превзошли ожидания — доходность стабильная, интерфейс понятный, служба поддержки отзывчивая.",
    initials: "МК"
  },
  {
    name: "Сергей П.",
    location: "Казань",
    rating: 4.5,
    text: "Пользуюсь элитным тарифом уже 3 месяца. Ежедневный доход в 15% позволил значительно увеличить первоначальные инвестиции. Сервис работает как часы, все выплаты вовремя.",
    initials: "СП"
  },
  {
    name: "Анна Д.",
    location: "Екатеринбург",
    rating: 5,
    text: "Привлекла реферальная программа и высокие показатели доходности. После первого месяца убедилась в надежности платформы. Особенно радует детальная статистика и прозрачность операций.",
    initials: "АД"
  }
];

export default function TestimonialsSlider() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === testimonials.length - slidesToShow ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? testimonials.length - slidesToShow : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="text-amber-500 h-4 w-4 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="text-amber-500 h-4 w-4">
          <defs>
            <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-star-${i}`} className="text-gray-300 h-4 w-4" />);
    }

    return stars;
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="overflow-hidden">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 px-4",
                slidesToShow === 1 ? "w-full" : slidesToShow === 2 ? "w-1/2" : "w-1/3"
              )}
            >
              <Card className="testimonial-gradient h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 dark:text-gray-300">{testimonial.text}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary text-white rounded-full overflow-hidden flex items-center justify-center mr-3">
                      <span className="font-medium">{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full p-0"
        variant="outline"
        size="icon"
      >
        <ChevronLeftIcon className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full p-0"
        variant="outline"
        size="icon"
      >
        <ChevronRightIcon className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>

      {/* Indicator dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: testimonials.length - slidesToShow + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
