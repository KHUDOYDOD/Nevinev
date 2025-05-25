import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, TrendingUp, ChevronRight, Users, Shield, DollarSign } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Фон с ультрасовременным 3D-эффектом */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 z-0">
        {/* 3D "лучи" света */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-full h-full" style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%)',
          }}></div>
        </div>
        
        {/* Горизонтальные линии на фоне */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                width: ['0%', '100%', '0%'],
                x: ['-50%', '0%', '50%']
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
              style={{
                marginTop: `${i * 10}vh`
              }}
            />
          ))}
        </div>
        
        {/* Блестящие 3D сферы */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-[50vh] h-[50vh] rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(150,100,255,0.3) 40%, rgba(0,0,80,0) 70%)',
              top: '10%',
              right: '-10%',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 0.9, 0.7],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div
            className="absolute w-[30vh] h-[30vh] rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(200,255,255,0.5), rgba(100,200,255,0.2) 40%, rgba(0,0,80,0) 70%)',
              bottom: '10%',
              left: '5%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
              x: [0, -20, 0],
              y: [0, 20, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </div>
        
        {/* 3D сетка */}
        <div className="absolute inset-0 perspective-[1000px]">
          <motion.div
            className="absolute inset-0"
            animate={{
              rotateX: [0, 5, 0, -5, 0],
              rotateY: [0, -5, 0, 5, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px), 
                                linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              transformStyle: 'preserve-3d'
            }}
          />
        </div>
        
        {/* Плавающие частицы */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-70"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(1px)',
              }}
              animate={{
                y: [0, -Math.random() * 100, 0],
                opacity: [0, 0.7, 0],
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
        
        {/* Центральный светящийся круг */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {/* Основной контент */}
      <div className="relative container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Левая колонка - информация */}
          <div className="lg:w-1/2 text-center lg:text-left relative">
            {/* Плашка */}
            <motion.div
              className="inline-flex items-center rounded-full px-4 py-2 border border-white/20 bg-white/5 backdrop-blur-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="mr-2 h-2 w-2 rounded-full bg-green-400"
                animate={{
                  scale: [1, 1.5, 1],
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
              <span className="text-sm font-medium text-white">TRADEPO | Smart Profit System</span>
            </motion.div>
            
            {/* Заголовок */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                <div className="text-white text-shadow-glow">Инвестируй</div>
                <div className="text-white text-shadow-glow">в свое</div>
                <div className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-pink-300 to-blue-300">
                  будущее сегодня
                </div>
              </h1>
            </motion.div>
            
            {/* Подзаголовок */}
            <motion.p
              className="text-xl text-white mb-10 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Ультрасовременная инвестиционная платформа с фиксированной ставкой до{' '}
              <span className="relative inline-flex items-center">
                <motion.span
                  className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-400"
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
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-700 px-8 py-6 text-white font-bold shadow-lg shadow-purple-700/30 hover:shadow-xl hover:shadow-purple-700/40"
                asChild
              >
                <a href="#calculator" className="flex items-center gap-2 group">
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
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                  
                  {/* Эффект неоновой вспышки */}
                  <motion.span
                    className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 text-white rounded-full px-8 py-6 backdrop-blur-md hover:bg-white/10 hover:border-white/30"
                asChild
              >
                <a href="#how-it-works" className="font-medium">Узнать больше</a>
              </Button>
            </motion.div>
            
            {/* Статистика */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                className="flex items-center gap-3 rounded-full px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/20"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(217, 70, 239, 0)',
                      '0 0 0 4px rgba(217, 70, 239, 0.3)',
                      '0 0 0 0 rgba(217, 70, 239, 0)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  <Users className="h-4 w-4 text-fuchsia-400" />
                </motion.div>
                <span className="text-white">6500+ активных инвесторов</span>
              </motion.div>
              
              <motion.div
                className="flex items-center gap-3 rounded-full px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20"
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
                  <Shield className="h-4 w-4 text-violet-400" />
                </motion.div>
                <span className="text-white">Защита инвестиций</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Правая колонка - 3D инвестиционная карточка */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden border border-white/20 backdrop-blur-2xl shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
              animate={{
                rotateX: [0, 2, 0, -2, 0],
                rotateY: [0, -2, 0, 2, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Эффект объемного стекла */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="absolute inset-0 shadow-inner" />
              
              {/* Блики на стекле */}
              <motion.div
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"
                animate={{
                  x: ['0%', '100%', '0%'],
                  y: ['0%', '100%', '0%'],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative p-8">
                {/* Процентный бейдж */}
                <motion.div
                  className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/20 z-10"
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
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Инвестиционный план</h2>
                  <div className="h-0.5 w-20 bg-gradient-to-r from-fuchsia-500 to-violet-600 mx-auto" />
                </div>
                
                {/* 3D голограмма инвестиционного графика */}
                <div className="relative h-56 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 mb-8 border border-white/10 overflow-hidden perspective-[1000px]">
                  {/* Графическая сетка */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: 'center center'
                  }} />
                  
                  {/* Светящаяся основа для графика */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-fuchsia-500/20 to-transparent" />
                  
                  {/* 3D линия графика */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(217, 70, 239, 0.5)" />
                          <stop offset="100%" stopColor="rgba(217, 70, 239, 0)" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#d946ef" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      
                      {/* Область под графиком */}
                      <motion.path
                        d="M0,150 C40,140 80,120 120,100 C160,80 200,50 240,30 C280,10 320,5 400,0 L400,200 L0,200 Z"
                        fill="url(#chartGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                      />
                      
                      {/* Линия графика с эффектом свечения */}
                      <motion.path
                        d="M0,150 C40,140 80,120 120,100 C160,80 200,50 240,30 C280,10 320,5 400,0"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2 }}
                      />
                      
                      {/* Ключевые точки на графике */}
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                        {/* Точка 1 */}
                        <motion.circle
                          cx="120" cy="100" r="6"
                          fill="#d946ef" stroke="white" strokeWidth="2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 1.5 }}
                        />
                        <motion.circle
                          cx="120" cy="100" r="15"
                          fill="transparent" stroke="#d946ef" strokeWidth="1"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                        />
                        
                        {/* Точка 2 */}
                        <motion.circle
                          cx="240" cy="30" r="6"
                          fill="#d946ef" stroke="white" strokeWidth="2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2 }}
                        />
                        <motion.circle
                          cx="240" cy="30" r="15"
                          fill="transparent" stroke="#d946ef" strokeWidth="1"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                        />
                        
                        {/* Точка 3 */}
                        <motion.circle
                          cx="400" cy="0" r="6"
                          fill="#d946ef" stroke="white" strokeWidth="2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2.5 }}
                        />
                        <motion.circle
                          cx="400" cy="0" r="15"
                          fill="transparent" stroke="#d946ef" strokeWidth="1"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
                        />
                      </motion.g>
                    </svg>
                  </motion.div>
                  
                  {/* Голографические метки */}
                  <motion.div
                    className="absolute top-[100px] left-[120px] -ml-12 -mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.7 }}
                  >
                    <div className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-white text-xs border border-white/20">
                      <div className="font-bold">+5%</div>
                      <div className="text-xs opacity-70">7 дней</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-[30px] left-[240px] -ml-12 -mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.2 }}
                  >
                    <div className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-white text-xs border border-white/20">
                      <div className="font-bold">+10%</div>
                      <div className="text-xs opacity-70">14 дней</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-[0px] left-[400px] -ml-12 -mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.7 }}
                  >
                    <div className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-white text-xs border border-white/20">
                      <div className="font-bold">+15%</div>
                      <div className="text-xs opacity-70">30 дней</div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Три основных показателя */}
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
                        className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20"
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            '0 0 0 0 rgba(217, 70, 239, 0)',
                            '0 0 0 4px rgba(217, 70, 239, 0.3)',
                            '0 0 0 0 rgba(217, 70, 239, 0)'
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity
                        }}
                      >
                        <TrendingUp className="h-5 w-5 text-fuchsia-400" />
                      </motion.div>
                      <p className="text-white/60 text-xs mb-1">Ежедневно</p>
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
                        className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20"
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
                        <DollarSign className="h-5 w-5 text-violet-400" />
                      </motion.div>
                      <p className="text-white/60 text-xs mb-1">Мин. депозит</p>
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
                        className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20"
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
                          repeat: Infinity,
                          delay: 2
                        }}
                      >
                        <Clock className="h-5 w-5 text-indigo-400" />
                      </motion.div>
                      <p className="text-white/60 text-xs mb-1">Вывод</p>
                      <p className="text-2xl font-bold text-white">24ч</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Эффект вращающейся рамки */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"
                    animate={{
                      left: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-violet-500 to-transparent"
                    animate={{
                      top: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.75
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"
                    animate={{
                      right: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1.5
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-violet-500 to-transparent"
                    animate={{
                      bottom: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 2.25
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Используем глобальные стили из index.css */}
    </section>
  );
}