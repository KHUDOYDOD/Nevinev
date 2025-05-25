import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Shield, Users, DollarSign, Clock } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0f2c] via-[#131c4a] to-[#162054] py-20 flex items-center">
      {/* Фон с высококонтрастными элементами */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Сетка */}
        <div 
          className="absolute inset-0 z-0 opacity-10" 
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        
        {/* Яркие градиентные круги */}
        <motion.div 
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-400 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5
          }}
        />
        
        <motion.div 
          className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-gradient-to-bl from-cyan-400 to-blue-600 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        
        {/* Анимированные частицы */}
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, index) => (
            <motion.div
              key={index}
              className={`absolute rounded-full ${
                index % 4 === 0 ? "bg-blue-400" : 
                index % 4 === 1 ? "bg-indigo-400" : 
                index % 4 === 2 ? "bg-purple-400" : 
                "bg-white"
              }`}
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(1px)"
              }}
              animate={{
                y: [0, -Math.random() * 100, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
        
        {/* Светящиеся линии */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.3)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <motion.path
            d="M-100,200 C100,100 300,300 500,200 S700,100 900,200 1100,300 1300,200"
            fill="none"
            stroke="url(#lineGrad1)"
            strokeWidth="1"
            strokeDasharray="5,5"
            animate={{
              y: [0, 20, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            filter="url(#glow)"
          />
          
          <motion.path
            d="M-100,400 C100,500 300,400 500,500 S700,600 900,500 1100,400 1300,500"
            fill="none"
            stroke="url(#lineGrad2)"
            strokeWidth="1"
            strokeDasharray="5,5"
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
            filter="url(#glow)"
          />
        </svg>
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Левая колонка с информацией */}
          <div className="lg:w-1/2 text-center lg:text-left">
            {/* Плашка сверху */}
            <motion.div 
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/20 mb-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center">
                <motion.div 
                  className="mr-2 h-2 w-2 rounded-full bg-green-400"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                    boxShadow: [
                      '0 0 0 0 rgba(74, 222, 128, 0.4)',
                      '0 0 0 10px rgba(74, 222, 128, 0)',
                      '0 0 0 0 rgba(74, 222, 128, 0.4)'
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                  TRADEPO | Smart Profit System
                </span>
              </div>
            </motion.div>
            
            {/* Заголовок */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4">
                <div className="text-white drop-shadow-md">Инвестируй</div>
                <div className="text-white drop-shadow-md">в свое</div>
                <div className="bg-gradient-to-r from-green-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  будущее сегодня
                </div>
              </h1>
              <motion.div 
                className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2 mb-8"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 80, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </motion.div>
            
            {/* Подзаголовок */}
            <motion.p 
              className="text-xl text-gray-200 mb-10 max-w-lg mx-auto lg:mx-0 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Ультрасовременная инвестиционная платформа с фиксированной ставкой до{' '}
              <span className="relative inline-flex items-center font-bold text-2xl bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent px-1">
                <motion.span
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(74, 222, 128, 0.5)',
                      '0 0 20px rgba(74, 222, 128, 0.8)',
                      '0 0 5px rgba(74, 222, 128, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  10%
                </motion.span>
                <motion.span 
                  className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-green-400"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [1, 0.5, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(74, 222, 128, 0.4)',
                      '0 0 0 10px rgba(74, 222, 128, 0)',
                      '0 0 0 0 rgba(74, 222, 128, 0.4)'
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
              </span>{' '}
              ежедневного дохода
            </motion.p>
            
            {/* Кнопки */}
            <motion.div 
              className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-8 py-6 text-white shadow-lg shadow-green-500/20 transition-transform hover:shadow-xl hover:shadow-green-500/30 active:scale-95"
                asChild
              >
                <a href="#calculator" className="flex items-center gap-2 font-bold">
                  <span className="relative z-10">Начать инвестировать</span>
                  <motion.div
                    animate={{
                      x: [0, 5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                  <span className="absolute inset-0 translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000 group-hover:translate-x-[-200%] ease-in-out" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 hover:text-white rounded-full px-8 py-6"
                asChild
              >
                <a href="#how-it-works" className="font-medium flex items-center gap-2">
                  <span>Узнать больше</span>
                </a>
              </Button>
            </motion.div>
            
            {/* Статистика */}
            <motion.div 
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div 
                className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <motion.div 
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(99, 102, 241, 0)',
                      '0 0 0 4px rgba(99, 102, 241, 0.3)',
                      '0 0 0 0 rgba(99, 102, 241, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity 
                  }}
                >
                  <Users className="h-4 w-4 text-indigo-400" />
                </motion.div>
                <span className="text-white font-medium">6500+ активных инвесторов</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <motion.div 
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(139, 92, 246, 0)',
                      '0 0 0 4px rgba(139, 92, 246, 0.3)',
                      '0 0 0 0 rgba(139, 92, 246, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <Shield className="h-4 w-4 text-purple-400" />
                </motion.div>
                <span className="text-white font-medium">Защита инвестиций</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Правая колонка с карточкой инвестиций */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Декоративные элементы */}
              <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 opacity-60 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 opacity-60 blur-2xl" />
              
              {/* Бейдж с процентом */}
              <motion.div 
                className="absolute -top-5 -right-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg border-2 border-white/20 z-10"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 3, 0, -3, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity 
                }}
              >
                <motion.span 
                  className="font-bold text-xl"
                  animate={{ 
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 10px rgba(255,255,255,0.8)',
                      '0 0 0px rgba(255,255,255,0)'
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                >
                  +15%
                </motion.span>
              </motion.div>
              
              {/* Заголовок карточки */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Инвестиционный план</h2>
                <p className="text-gray-300">Начните зарабатывать уже сегодня</p>
              </div>
              
              {/* График инвестиций */}
              <div className="bg-gradient-to-b from-white/5 to-white/0 rounded-2xl p-4 mb-8 border border-white/10 relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full" style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                
                <div className="h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(52, 211, 153, 0.5)" />
                        <stop offset="100%" stopColor="rgba(52, 211, 153, 0)" />
                      </linearGradient>
                      <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <filter id="chartGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    {/* Область под графиком */}
                    <motion.path 
                      d="M0,120 C40,100 80,90 120,70 C160,50 200,40 240,20 C280,10 320,5 400,0 L400,150 L0,150 Z" 
                      fill="url(#chartGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.5 }}
                    />
                    
                    {/* Линия графика */}
                    <motion.path 
                      d="M0,120 C40,100 80,90 120,70 C160,50 200,40 240,20 C280,10 320,5 400,0" 
                      fill="none" 
                      stroke="url(#chartLine)" 
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="url(#chartGlow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    
                    {/* Точки на графике */}
                    <motion.circle 
                      cx="120" cy="70" r="6" 
                      fill="#34d399" stroke="#fff" strokeWidth="2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                    />
                    
                    <motion.circle 
                      cx="240" cy="20" r="6" 
                      fill="#34d399" stroke="#fff" strokeWidth="2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 2 }}
                    />
                    
                    <motion.circle 
                      cx="400" cy="0" r="6" 
                      fill="#34d399" stroke="#fff" strokeWidth="2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 2.3 }}
                    />
                  </svg>
                  
                  {/* Метки на графике */}
                  <motion.div 
                    className="absolute top-[70px] left-[120px] -ml-10 -mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.7 }}
                  >
                    <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs">
                      День 7
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-[20px] left-[240px] -ml-10 -mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.2 }}
                  >
                    <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs">
                      День 14
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-[0px] left-[400px] -ml-10 -mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.5 }}
                  >
                    <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs">
                      День 30
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Показатели */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div 
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400/20 to-teal-400/20"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(74, 222, 128, 0)',
                          '0 0 0 4px rgba(74, 222, 128, 0.3)',
                          '0 0 0 0 rgba(74, 222, 128, 0)'
                        ]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity 
                      }}
                    >
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </motion.div>
                    <p className="text-gray-400 text-xs mb-1">Ежедневно</p>
                    <p className="text-2xl font-bold text-white">+15%</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(96, 165, 250, 0)',
                          '0 0 0 4px rgba(96, 165, 250, 0.3)',
                          '0 0 0 0 rgba(96, 165, 250, 0)'
                        ]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: 1
                      }}
                    >
                      <DollarSign className="h-5 w-5 text-blue-400" />
                    </motion.div>
                    <p className="text-gray-400 text-xs mb-1">Мин. депозит</p>
                    <p className="text-2xl font-bold text-white">$100</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(139, 92, 246, 0)',
                          '0 0 0 4px rgba(139, 92, 246, 0.3)',
                          '0 0 0 0 rgba(139, 92, 246, 0)'
                        ]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: 2
                      }}
                    >
                      <Clock className="h-5 w-5 text-purple-400" />
                    </motion.div>
                    <p className="text-gray-400 text-xs mb-1">Вывод</p>
                    <p className="text-2xl font-bold text-white">24ч</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Преимущества */}
              <div className="space-y-4 mb-8">
                <motion.div 
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400/20 to-teal-400/20">
                    <motion.div 
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                  <span className="text-white">Моментальная регистрация</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20">
                    <motion.div 
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#60a5fa" strokeWidth="2"/>
                        <path d="M12 16V12" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 8H12.01" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </motion.div>
                  </div>
                  <span className="text-white">Круглосуточная поддержка</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20">
                    <motion.div 
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#c084fc" strokeWidth="2"/>
                        <path d="M7.5 12L10.5 15L16.5 9" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                  <span className="text-white">Защита инвестиций</span>
                </motion.div>
              </div>
              
              {/* Нижний бейдж */}
              <motion.div 
                className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <TrendingUp className="h-5 w-5 text-white" />
                  </motion.div>
                  <span className="text-white font-medium">Доход начисляется каждые 24ч</span>
                  <motion.div 
                    className="h-2 w-2 rounded-full bg-green-400"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(74, 222, 128, 0.4)',
                        '0 0 0 4px rgba(74, 222, 128, 0)',
                        '0 0 0 0 rgba(74, 222, 128, 0.4)'
                      ]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity 
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}