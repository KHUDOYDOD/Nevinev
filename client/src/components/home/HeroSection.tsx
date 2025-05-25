import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-primary/90 via-primary/70 to-accent/90 text-white pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden relative">
      {/* Фоновые анимированные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Анимированные круги */}
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/10 backdrop-blur-lg animate-float-rotate animate-duration-slow"></div>
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-white/10 backdrop-blur-lg animate-float-sideways animate-delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 rounded-full bg-white/5 backdrop-blur-lg animate-float animate-delay-200"></div>
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 rounded-full bg-white/5 backdrop-blur-lg animate-float-rotate animate-delay-400"></div>
        
        {/* Градиентные наложения */}
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(156,220,255,0.15),_transparent_70%)]"></div>
        
        {/* Сетка в качестве фона */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)",
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Анимированные частицы */}
        <div className="absolute left-1/4 top-1/4 w-2 h-2 bg-white rounded-full animate-float-rotate animate-duration-slow"></div>
        <div className="absolute right-1/4 top-1/3 w-2 h-2 bg-white rounded-full animate-float animate-duration-very-slow"></div>
        <div className="absolute left-1/3 bottom-1/4 w-2 h-2 bg-white rounded-full animate-float-sideways animate-duration-slow"></div>
        <div className="absolute right-1/3 bottom-1/3 w-2 h-2 bg-white rounded-full animate-float-rotate animate-duration-very-slow"></div>
        
        {/* Световые лучи */}
        <div className="absolute top-0 left-1/4 w-1/2 h-40 bg-secondary/20 blur-[100px] animate-pulse animate-duration-very-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-40 bg-primary/20 blur-[100px] animate-pulse animate-duration-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            {/* Верхняя плашка */}
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20 animate-scale-in-fast">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse mr-2"></span>
                <span className="text-sm font-medium">TRADEPO | Smart Profit System</span>
              </div>
            </div>
            
            {/* Заголовок с анимированным текстом */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 animate-slide-up">
              <div className="overflow-hidden">
                <span className="block mb-2 animate-slide-right animate-delay-100">Инвестируй</span>
              </div>
              <div className="overflow-hidden">
                <span className="block mb-2 animate-slide-right animate-delay-200">в свое</span>
              </div>
              <div className="overflow-hidden">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-secondary via-purple-400 to-secondary/80 animate-background-shift animate-slide-right animate-delay-300">
                  будущее сегодня
                </span>
              </div>
            </h1>
            
            {/* Подзаголовок с анимацией */}
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-lg animate-fade-in animate-delay-400">
              Ультрасовременная инвестиционная платформа с фиксированной ставкой до 
              <span className="relative inline-block mx-1">
                <span className="font-bold text-white animate-blink-shadow">15%</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              </span> 
              ежедневного дохода
            </p>
            
            {/* Анимированные кнопки */}
            <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-500">
              <Button
                size="lg"
                className="relative overflow-hidden modern-button bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-bold rounded-full px-8 py-6 shadow-lg shadow-secondary/30 animate-glow"
                asChild
              >
                <a href="#calculator" className="relative z-10 flex items-center">
                  <span className="animate-pulse mr-2">💰</span>
                  <span>Начать инвестировать</span>
                </a>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="modern-button bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium rounded-full px-8 py-6 border border-white/30"
                asChild
              >
                <a href="#how-it-works" className="flex items-center">
                  <span className="mr-2">🔍</span>
                  <span>Узнать больше</span>
                </a>
              </Button>
            </div>
            
            {/* Плавающие индикаторы статистики */}
            <div className="hidden md:flex items-center mt-10 space-x-4 animate-fade-in animate-delay-700">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">6500+ активных инвесторов</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">99.9% безопасности</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animate-fade-in animate-delay-200">
            {/* Основная интерактивная графика */}
            <div className="relative glassmorphism rounded-2xl shadow-2xl p-6 mx-auto max-w-lg border border-white/20">
              {/* Плавающие индикаторы */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-lg animate-pulse border-4 border-white/20">
                <span className="text-white font-bold text-lg animate-blink-shadow">15%</span>
              </div>
              
              <div className="absolute -bottom-5 -left-5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20 animate-float">
                <div className="flex items-center">
                  <span className="text-sm font-medium">Доход каждые 24ч</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                </div>
              </div>
              
              {/* Интерактивный график с анимацией */}
              <svg 
                className="w-full h-auto"
                viewBox="0 0 600 400" 
                width="100%" 
                height="100%"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
                  </linearGradient>
                  <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(156, 220, 255, 1)" />
                    <stop offset="100%" stopColor="rgba(150, 120, 255, 1)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.3)" />
                  </filter>
                  <clipPath id="chartClip">
                    <rect width="600" height="300" rx="8" />
                  </clipPath>
                </defs>
                
                {/* Фон графика с закругленными углами */}
                <rect width="600" height="300" fill="rgba(255,255,255,0.05)" rx="8" filter="url(#shadow)" />
                
                {/* Сетка с анимацией */}
                <g opacity="0.2" clipPath="url(#chartClip)">
                  <line x1="0" y1="60" x2="600" y2="60" stroke="white" strokeDasharray="3,3" className="animate-dash" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="white" strokeDasharray="3,3" className="animate-dash animate-delay-200" />
                  <line x1="0" y1="180" x2="600" y2="180" stroke="white" strokeDasharray="3,3" className="animate-dash animate-delay-400" />
                  <line x1="0" y1="240" x2="600" y2="240" stroke="white" strokeDasharray="3,3" className="animate-dash animate-delay-600" />
                  
                  <line x1="120" y1="0" x2="120" y2="300" stroke="white" strokeDasharray="3,3" className="animate-dash animate-delay-100" />
                  <line x1="240" y1="0" x2="240" y2="300" stroke="white" strokeDasharray="3,3" className="animate-dash animate-delay-300" />
                  <line x1="360" y1="0" x2="360" y2="300" stroke="white" strokeDasharray="3,3" className="animate-dash animate-delay-500" />
                  <line x1="480" y1="0" x2="480" y2="300" stroke="white" strokeDasharray="3,3" className="animate-dash animate-delay-700" />
                </g>
                
                {/* График линией с градиентом и свечением */}
                <path 
                  d="M0,250 L60,240 L120,230 L180,210 L240,190 L300,160 L360,120 L420,90 L480,70 L540,40 L600,20" 
                  fill="none" 
                  stroke="url(#chartLine)" 
                  strokeWidth="4"
                  filter="url(#glow)"
                  strokeLinecap="round"
                  clipPath="url(#chartClip)"
                />
                
                {/* Область под графиком */}
                <path 
                  d="M0,250 L60,240 L120,230 L180,210 L240,190 L300,160 L360,120 L420,90 L480,70 L540,40 L600,20 L600,300 L0,300 Z" 
                  fill="url(#chartGradient)"
                  clipPath="url(#chartClip)"
                />
                
                {/* Анимированные точки на графике с эффектом пульсации */}
                <g className="animate-pulse animate-duration-slow">
                  <circle cx="60" cy="240" r="3" fill="white" />
                  <circle cx="120" cy="230" r="3" fill="white" />
                  <circle cx="180" cy="210" r="3" fill="white" />
                  <circle cx="240" cy="190" r="3" fill="white" />
                  <circle cx="300" cy="160" r="3" fill="white" />
                  <circle cx="360" cy="120" r="3" fill="white" />
                  <circle cx="420" cy="90" r="3" fill="white" />
                  <circle cx="480" cy="70" r="3" fill="white" />
                  <circle cx="540" cy="40" r="3" fill="white" />
                </g>
                
                {/* Текущая точка с анимацией */}
                <g>
                  <circle cx="600" cy="20" r="6" fill="white" className="animate-pulse" />
                  <circle cx="600" cy="20" r="12" fill="white" fillOpacity="0.3" className="animate-pulse animate-delay-200" />
                  <circle cx="600" cy="20" r="18" fill="white" fillOpacity="0.1" className="animate-pulse animate-delay-400" />
                </g>
                
                {/* Индикатор текущего значения */}
                <g className="animate-float animate-duration-slow">
                  <rect x="560" y="-15" width="60" height="25" rx="12.5" fill="white" fillOpacity="0.2" />
                  <text x="590" y="5" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">+237%</text>
                </g>
                
                {/* Золотые монеты с улучшенной анимацией */}
                <g className="animate-float-rotate animate-delay-300 animate-duration-slow" filter="url(#glow)">
                  <circle cx="180" cy="150" r="30" fill="url(#coinGradient)" stroke="#FFD700" strokeWidth="2" />
                  <text x="180" y="155" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="18">$</text>
                </g>
                
                <g className="animate-float animate-duration-very-slow" filter="url(#glow)">
                  <circle cx="480" cy="170" r="30" fill="url(#coinGradient)" stroke="#FFD700" strokeWidth="2" />
                  <text x="480" y="175" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="18">$</text>
                </g>
                
                <defs>
                  <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Обновленная статистика с анимациями */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 animate-scale-in animate-delay-600">
                  <div className="text-center">
                    <p className="text-xs text-white/80 mb-1">Ежедневный доход</p>
                    <p className="text-xl font-bold text-white animate-blink-shadow">+15%</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 animate-scale-in animate-delay-700">
                  <div className="text-center">
                    <p className="text-xs text-white/80 mb-1">Минимальный депозит</p>
                    <p className="text-xl font-bold text-white">$100</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 animate-scale-in animate-delay-800">
                  <div className="text-center">
                    <p className="text-xs text-white/80 mb-1">Вывод средств</p>
                    <p className="text-xl font-bold text-white">24ч</p>
                  </div>
                </div>
              </div>
              
              {/* Дополнительный блок с выгодами */}
              <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 animate-scale-in animate-delay-900">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-2">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm">Моментальная регистрация</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-2">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm">Защита инвестиций</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Декоративные градиентные элементы */}
            <div className="absolute -top-10 -right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse animate-duration-very-slow"></div>
            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse animate-duration-slow"></div>
          </div>
        </div>
      </div>
      
      {/* Плавающие пузырьки внизу секции */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden h-20 pointer-events-none">
        <div className="w-4 h-4 rounded-full bg-white/30 absolute bottom-0 left-[10%] animate-float-rotate" style={{animationDuration: '15s'}}></div>
        <div className="w-6 h-6 rounded-full bg-white/20 absolute bottom-5 left-[20%] animate-float" style={{animationDuration: '12s'}}></div>
        <div className="w-3 h-3 rounded-full bg-white/30 absolute bottom-10 left-[30%] animate-float-sideways" style={{animationDuration: '10s'}}></div>
        <div className="w-5 h-5 rounded-full bg-white/20 absolute bottom-2 left-[40%] animate-float-rotate" style={{animationDuration: '14s'}}></div>
        <div className="w-4 h-4 rounded-full bg-white/30 absolute bottom-8 left-[50%] animate-float" style={{animationDuration: '11s'}}></div>
        <div className="w-3 h-3 rounded-full bg-white/20 absolute bottom-4 left-[60%] animate-float-sideways" style={{animationDuration: '9s'}}></div>
        <div className="w-6 h-6 rounded-full bg-white/30 absolute bottom-10 left-[70%] animate-float-rotate" style={{animationDuration: '16s'}}></div>
        <div className="w-4 h-4 rounded-full bg-white/20 absolute bottom-6 left-[80%] animate-float" style={{animationDuration: '13s'}}></div>
        <div className="w-5 h-5 rounded-full bg-white/30 absolute bottom-2 left-[90%] animate-float-sideways" style={{animationDuration: '12s'}}></div>
      </div>
      
      {/* Полупрозрачный градиент внизу для плавного перехода к следующей секции */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
