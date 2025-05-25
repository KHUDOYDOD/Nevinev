import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, Award, Clock, Users, Map, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Запрос на получение отзывов с сервера
  const { data, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Примеры отзывов, если API не возвращает данные
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
      rating: 4,
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

  // Инициализация отзывов
  useEffect(() => {
    if (data && data.length > 0) {
      setTestimonials(data);
    } else if (!isLoading) {
      setTestimonials(defaultTestimonials);
    }
  }, [data, isLoading]);

  // Автоматическое переключение слайдов
  useEffect(() => {
    if (autoplay && testimonials.length > 0) {
      autoplayRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, testimonials, currentIndex]);

  // Функции управления слайдером
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Функция для получения инициалов пользователя
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Функция для создания эффекта свечения звезд рейтинга
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.4, scale: 0.8 }}
            animate={{ 
              opacity: i < rating ? 1 : 0.3, 
              scale: i < rating ? [1, 1.2, 1] : 1,
              rotate: i < rating ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 1.5, 
              repeat: i < rating ? Infinity : 0, 
              repeatType: "reverse",
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="inline-block mr-1"
          >
            <Star 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                i < rating 
                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.7)]" 
                  : "text-gray-300"
              )}
            />
          </motion.span>
        ))}
        <motion.span 
          className="ml-2 font-medium text-amber-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {rating.toFixed(1)}
        </motion.span>
      </div>
    );
  };

  // Анимационные варианты для слайдов
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.5
      }
    })
  };

  // Компонент для визуализации состояния загрузки
  if (isLoading) {
    return (
      <section id="reviews" className="py-20 relative bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-gray-900/20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div 
              className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full w-64 mx-auto mb-6"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div 
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full max-w-md mx-auto"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
          
          <div className="flex justify-center flex-wrap gap-6 max-w-6xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg w-full md:w-80 h-64 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30"
                animate={{ 
                  opacity: [0.5, 0.7, 0.5],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.3 
                }}
              >
                <div className="h-full p-6 flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700 mr-1"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-2 mb-auto">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-[85%]" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-[90%]" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-[80%]" />
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Основной компонент отзывов
  return (
    <section id="reviews" className="py-20 relative bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-gray-900/20 overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            opacity: [0.4, 0.5, 0.4]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-40"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-30"
          animate={{ 
            scale: [1, 1.4, 1],
            y: [0, 40, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок секции */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block px-6 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm shadow-lg">
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Отзывы клиентов
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            <span className="relative inline-block">
              <span className="relative z-10">Что говорят</span>
              <motion.span 
                className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded-full -z-10 transform skew-x-12"
                animate={{ 
                  width: ["0%", "100%"],
                  opacity: [0, 1]
                }}
                transition={{ 
                  duration: 1, 
                  delay: 0.3, 
                  ease: "easeOut" 
                }}
              />
            </span>{" "}
            <span className="relative inline-block">
              <span className="relative z-10">наши инвесторы</span>
              <motion.span 
                className="absolute bottom-2 left-0 w-full h-3 bg-secondary/20 rounded-full -z-10 transform -skew-x-12"
                animate={{ 
                  width: ["0%", "100%"],
                  opacity: [0, 1]
                }}
                transition={{ 
                  duration: 1, 
                  delay: 0.6, 
                  ease: "easeOut" 
                }}
              />
            </span>
          </h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            Более 6500+ довольных клиентов уже получают стабильный доход с нашей платформы
          </motion.p>
        </motion.div>
        
        {/* Карточки статистики */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700/30 flex flex-col items-center"
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ThumbsUp className="h-6 w-6 text-green-500" />
            </motion.div>
            <p className="text-2xl font-bold text-green-500">99.9%</p>
            <p className="text-sm text-muted-foreground text-center">Положительных отзывов</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700/30 flex flex-col items-center"
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            >
              <Users className="h-6 w-6 text-blue-500" />
            </motion.div>
            <p className="text-2xl font-bold text-blue-500">6500+</p>
            <p className="text-sm text-muted-foreground text-center">Активных инвесторов</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700/30 flex flex-col items-center"
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            >
              <Award className="h-6 w-6 text-amber-500" />
            </motion.div>
            <p className="text-2xl font-bold text-amber-500">4.9/5</p>
            <p className="text-sm text-muted-foreground text-center">Средний рейтинг</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700/30 flex flex-col items-center"
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1.5
              }}
            >
              <Clock className="h-6 w-6 text-purple-500" />
            </motion.div>
            <p className="text-2xl font-bold text-purple-500">24/7</p>
            <p className="text-sm text-muted-foreground text-center">Техническая поддержка</p>
          </motion.div>
        </motion.div>
        
        {/* Слайдер отзывов */}
        <div className="relative max-w-6xl mx-auto" ref={containerRef}>
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            {/* Каждый отзыв с анимацией */}
            <div className="relative min-h-[30rem]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                    {[0, 1, 2].map((offset) => {
                      const index = (currentIndex + offset) % testimonials.length;
                      const testimonial = testimonials[index];
                      if (!testimonial) return null;
                      
                      return (
                        <motion.div 
                          key={`${testimonial.id}-${index}`}
                          className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/40 dark:to-gray-800/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 flex flex-col h-full relative overflow-hidden group"
                          whileHover={{ 
                            y: -10,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            transition: { type: "spring", stiffness: 400, damping: 15 }
                          }}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: offset * 0.2 }}
                        >
                          {/* Эффект свечения при наведении */}
                          <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-white/5 to-secondary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0"></div>
                          
                          {/* Иконка кавычки */}
                          <div className="relative z-10">
                            <motion.div 
                              className="absolute -top-1 -left-1 text-primary/10 dark:text-primary/5"
                              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              transition={{ duration: 0.5, delay: offset * 0.3 }}
                            >
                              <Quote className="h-16 w-16" />
                            </motion.div>
                            
                            {/* Рейтинг */}
                            <div className="flex justify-end mb-6 relative z-10">
                              {renderStars(testimonial.rating)}
                            </div>
                            
                            {/* Содержание отзыва */}
                            <motion.div 
                              className="mb-6 relative z-10"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.3 + offset * 0.2 }}
                            >
                              <p className="text-foreground/90 dark:text-foreground/80 leading-relaxed relative z-10">
                                {testimonial.content.replace(/«|»/g, '')}
                              </p>
                            </motion.div>
                            
                            {/* Информация о пользователе */}
                            <div className="mt-auto flex items-center relative z-10">
                              <motion.div 
                                className="relative"
                                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <Avatar className="h-14 w-14 border-2 border-white dark:border-gray-700 shadow-md">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                                    {testimonial.user?.username ? getInitials(testimonial.user.username) : "U"}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              
                              <div className="ml-4">
                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                  {testimonial.user?.username || "Пользователь"}
                                </h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  {testimonial.user?.location && (
                                    <div className="flex items-center mr-2">
                                      <Map className="h-3 w-3 mr-1 text-secondary/70" />
                                      <span>{testimonial.user.location}</span>
                                    </div>
                                  )}
                                  <span className="text-xs text-muted-foreground/70">
                                    • С {new Date(testimonial.createdAt).getFullYear()} г.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Кнопки навигации */}
          <div className="flex justify-between mt-12">
            <div className="flex justify-start">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-gray-700/30 text-primary hover:text-white hover:bg-primary transition-all mr-3 h-12 w-12"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline"
                  size="icon"
                  className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-gray-700/30 text-primary hover:text-white hover:bg-primary transition-all h-12 w-12"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>
            
            {/* Индикаторы */}
            <div className="flex items-center space-x-3">
              {testimonials.map((_, index) => {
                const isActive = Math.floor(currentIndex / 3) === Math.floor(index / 3);
                return (
                  <motion.button 
                    key={index}
                    type="button" 
                    className={cn(
                      "h-3 w-3 rounded-full transition-all duration-300",
                      isActive 
                        ? "bg-primary shadow-lg shadow-primary/30" 
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    )}
                    onClick={() => handleDotClick(index)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    animate={isActive ? { 
                      scale: [1, 1.2, 1],
                      boxShadow: ["0 0 0 0 rgba(var(--primary-rgb), 0)", "0 0 0 4px rgba(var(--primary-rgb), 0.3)", "0 0 0 0 rgba(var(--primary-rgb), 0)"]
                    } : {}}
                    transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
