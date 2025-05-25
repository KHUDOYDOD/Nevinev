import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Clock, Shield, Users } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-24 overflow-hidden relative min-h-screen flex items-center">
      {/* Фоновый градиент - более яркий и насыщенный */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 z-0"></div>
      
      {/* Графический эффект сетки для более технологичного вида */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Анимированные элементы фона */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Большие круги на фоне с более яркими цветами */}
        <motion.div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-300 opacity-50 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-indigo-400 opacity-40 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [-20, 0, -20],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        
        <motion.div 
          className="absolute -bottom-40 left-1/4 w-80 h-80 rounded-full bg-purple-400 opacity-30 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [10, -10, 10],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        
        {/* Добавляем яркие акценты */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-400 opacity-20 blur-3xl"
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 3
          }}
        />
        
        {/* Светящиеся линии */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M0,50 Q250,180 500,50 T1000,50"
              fill="none" 
              stroke="url(#gradientLine)" 
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 0.2, 0],
                y: [0, 20, 0]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <defs>
              <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
                <stop offset="50%" stopColor="rgba(56, 189, 248, 0.5)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Плавающие частицы разного размера и с разными эффектами */}
        {Array.from({ length: 30 }).map((_, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full ${
              index % 3 === 0 
                ? "bg-white" 
                : index % 3 === 1 
                  ? "bg-blue-200" 
                  : "bg-indigo-200"
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Левая колонка - Текстовый контент */}
          <motion.div 
            className="lg:w-1/2 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Верхняя плашка */}
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full mr-2"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                TRADEPO | Smart Profit System
              </span>
            </motion.div>
            
            {/* Заголовок с анимацией */}
            <div className="mb-8">
              <motion.h1 
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Инвестируй
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  в свое
                </motion.div>
                
                <motion.div 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-pink-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  будущее сегодня
                </motion.div>
              </motion.h1>
            </div>
            
            {/* Подзаголовок */}
            <motion.p 
              className="text-xl mb-10 max-w-lg text-white font-medium drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Ультрасовременная инвестиционная платформа с фиксированной ставкой до&nbsp;
              <span className="relative inline-flex items-center">
                <span className="font-bold text-2xl bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">10%</span>
                <motion.span 
                  className="absolute -top-1 -right-2 w-2 h-2 bg-green-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </span>
              &nbsp;ежедневного дохода
            </motion.p>
            
            {/* Кнопки действий */}
            <motion.div 
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-full px-8 py-6 shadow-lg shadow-green-500/30 relative overflow-hidden group"
                  asChild
                >
                  <a href="#calculator" className="flex items-center">
                    <motion.span 
                      className="mr-2 text-xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 1 }}
                    >
                      👆
                    </motion.span>
                    <span className="relative z-10">Начать инвестировать</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></span>
                  </a>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium rounded-full px-8 py-6 border border-white/30"
                  asChild
                >
                  <a href="#how-it-works" className="flex items-center">
                    <span className="mr-2">🔍</span>
                    <span>Узнать больше</span>
                  </a>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Счетчики */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <motion.div 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Users className="h-5 w-5 text-green-300" />
                </motion.div>
                <span>6500+ активных инвесторов</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.3
                  }}
                >
                  <Shield className="h-5 w-5 text-blue-300" />
                </motion.div>
                <span>99.9% безопасности</span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Правая колонка - Инвестиционная карточка */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Индикатор процента */}
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white/20 z-20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <motion.span 
                  className="text-white font-bold text-xl"
                  animate={{ 
                    textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.5)", "0 0 0px rgba(255,255,255,0)"]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  15%
                </motion.span>
              </motion.div>
              
              {/* График инвестиций */}
              <div className="mb-8 relative bg-white/5 rounded-2xl p-4 overflow-hidden border border-white/10">
                {/* Сетка */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border-b border-r border-white/5"></div>
                  ))}
                </div>
                
                {/* График */}
                <div className="relative h-40">
                  <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" className="relative z-10">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(74, 222, 128, 0.3)" />
                        <stop offset="100%" stopColor="rgba(74, 222, 128, 0)" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    {/* Линия графика */}
                    <motion.path 
                      d="M0,80 C20,70 40,60 60,55 C80,50 100,50 120,45 C140,40 160,30 180,25 C200,20 220,15 240,10 C260,5 280,5 300,5" 
                      fill="none" 
                      stroke="url(#lineGradient)" 
                      strokeWidth="2"
                      filter="url(#glow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    
                    {/* Область под графиком */}
                    <motion.path 
                      d="M0,80 C20,70 40,60 60,55 C80,50 100,50 120,45 C140,40 160,30 180,25 C200,20 220,15 240,10 C260,5 280,5 300,5 L300,100 L0,100 Z" 
                      fill="url(#chartGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                    
                    {/* Монеты на графике */}
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                    >
                      <motion.circle 
                        cx="60" 
                        cy="55" 
                        r="8" 
                        fill="#ffc107" 
                        stroke="#fff" 
                        strokeWidth="1"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <text x="60" y="59" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">$</text>
                    </motion.g>
                    
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 2 }}
                    >
                      <motion.circle 
                        cx="240" 
                        cy="10" 
                        r="8" 
                        fill="#ffc107" 
                        stroke="#fff" 
                        strokeWidth="1"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <text x="240" y="14" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">$</text>
                    </motion.g>
                  </svg>
                </div>
              </div>
              
              {/* Показатели */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-xs text-white/70 mb-1">Ежедневный доход</p>
                  <div className="flex items-center justify-center">
                    <motion.div 
                      className="mr-1"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </motion.div>
                    <p className="text-xl font-bold text-white">+15%</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-xs text-white/70 mb-1">Минимальный депозит</p>
                  <div className="flex items-center justify-center">
                    <motion.div 
                      className="mr-1"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    >
                      <DollarSign className="h-4 w-4 text-blue-300" />
                    </motion.div>
                    <p className="text-xl font-bold text-white">$100</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <p className="text-xs text-white/70 mb-1">Вывод средств</p>
                  <div className="flex items-center justify-center">
                    <motion.div 
                      className="mr-1"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    >
                      <Clock className="h-4 w-4 text-purple-300" />
                    </motion.div>
                    <p className="text-xl font-bold text-white">24ч</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Дополнительные функции */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <motion.div 
                    className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ["rgba(74, 222, 128, 0.2)", "rgba(74, 222, 128, 0.3)", "rgba(74, 222, 128, 0.2)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </motion.div>
                  <span className="text-sm text-white">Моментальная регистрация</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <motion.div 
                    className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center mr-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ["rgba(96, 165, 250, 0.2)", "rgba(96, 165, 250, 0.3)", "rgba(96, 165, 250, 0.2)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </motion.div>
                  <span className="text-sm text-white">Защита инвестиций</span>
                </motion.div>
              </div>
              
              {/* Индикатор дохода */}
              <motion.div 
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <div className="flex items-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <Clock className="h-4 w-4 text-green-300 mr-2" />
                  </motion.div>
                  <span className="text-sm font-medium text-white">Доход каждые 24ч</span>
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full ml-2"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}