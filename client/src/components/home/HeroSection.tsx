import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-primary/90 to-accent/90 text-white pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden relative">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/10 backdrop-blur-lg animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white/10 backdrop-blur-lg animate-float animate-delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-white/5 backdrop-blur-lg animate-float animate-delay-200"></div>
        <div className="absolute -bottom-10 right-1/3 w-64 h-64 rounded-full bg-white/5 backdrop-blur-lg animate-float animate-delay-400"></div>
        
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Графический элемент - сетка */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)",
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0 animate-slide-up">
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-fade-in">
              <span className="text-sm font-medium">TRADEPO | Smart Profit System</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 animate-fade-in">
              <span className="block">Инвестируй умно.</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-secondary/80">
                Получай прибыль за 24 часа.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-lg animate-fade-in animate-delay-100">
              Современная инвестиционная платформа с фиксированной ставкой 
              <span className="font-bold text-white"> до 15% дохода в сутки</span>
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
              <Button
                size="lg"
                className="modern-button bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full px-8 py-6 shadow-lg shadow-secondary/30"
                asChild
              >
                <a href="#calculator">Начать инвестировать</a>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="modern-button bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium rounded-full px-8 py-6"
                asChild
              >
                <a href="#how-it-works">Узнать больше</a>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative animate-slide-up animate-delay-200">
            {/* Основная графика */}
            <div className="relative glassmorphism rounded-2xl shadow-2xl p-4 mx-auto max-w-lg">
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-lg">15%</span>
              </div>
              
              <svg 
                className="w-full h-auto"
                viewBox="0 0 600 400" 
                width="100%" 
                height="100%"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Область графика */}
                <rect width="600" height="300" fill="none" />
                
                {/* Сетка */}
                <g opacity="0.1">
                  <line x1="0" y1="60" x2="600" y2="60" stroke="white" strokeDasharray="5,5" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="white" strokeDasharray="5,5" />
                  <line x1="0" y1="180" x2="600" y2="180" stroke="white" strokeDasharray="5,5" />
                  <line x1="0" y1="240" x2="600" y2="240" stroke="white" strokeDasharray="5,5" />
                  
                  <line x1="120" y1="0" x2="120" y2="300" stroke="white" strokeDasharray="5,5" />
                  <line x1="240" y1="0" x2="240" y2="300" stroke="white" strokeDasharray="5,5" />
                  <line x1="360" y1="0" x2="360" y2="300" stroke="white" strokeDasharray="5,5" />
                  <line x1="480" y1="0" x2="480" y2="300" stroke="white" strokeDasharray="5,5" />
                </g>
                
                {/* График линией */}
                <path 
                  d="M0,300 L60,280 L120,260 L180,230 L240,210 L300,170 L360,130 L420,90 L480,70 L540,40 L600,20" 
                  fill="none" 
                  stroke="rgba(156, 220, 255, 1)" 
                  strokeWidth="3"
                  filter="url(#glow)"
                />
                
                {/* Область под графиком */}
                <path 
                  d="M0,300 L60,280 L120,260 L180,230 L240,210 L300,170 L360,130 L420,90 L480,70 L540,40 L600,20 L600,300 Z" 
                  fill="url(#chartGradient)"
                />
                
                {/* Точки на графике */}
                <circle cx="60" cy="280" r="4" fill="white" />
                <circle cx="120" cy="260" r="4" fill="white" />
                <circle cx="180" cy="230" r="4" fill="white" />
                <circle cx="240" cy="210" r="4" fill="white" />
                <circle cx="300" cy="170" r="4" fill="white" />
                <circle cx="360" cy="130" r="4" fill="white" />
                <circle cx="420" cy="90" r="4" fill="white" />
                <circle cx="480" cy="70" r="4" fill="white" />
                <circle cx="540" cy="40" r="4" fill="white" />
                <circle cx="600" cy="20" r="4" fill="white" />
                
                {/* Большая точка для текущего значения */}
                <circle cx="600" cy="20" r="8" fill="white" className="animate-pulse" />
                
                {/* Золотые монеты с анимацией */}
                <g className="animate-float animate-delay-300">
                  <circle cx="180" cy="150" r="25" fill="url(#coinGradient)" stroke="#FFD700" strokeWidth="2" />
                  <text x="180" y="155" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="14">$</text>
                </g>
                
                <g className="animate-float">
                  <circle cx="480" cy="170" r="25" fill="url(#coinGradient)" stroke="#FFD700" strokeWidth="2" />
                  <text x="480" y="175" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="14">$</text>
                </g>
                
                <defs>
                  <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Статистика под графиком */}
              <div className="grid grid-cols-3 gap-4 mt-4 animate-fade-in animate-delay-300">
                <div className="text-center">
                  <p className="text-xs text-white/80">Ежедневный доход</p>
                  <p className="text-xl font-bold text-white">+15%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/80">Минимальный депозит</p>
                  <p className="text-xl font-bold text-white">$100</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/80">Вывод в течение</p>
                  <p className="text-xl font-bold text-white">24ч</p>
                </div>
              </div>
            </div>
            
            {/* Декоративные элементы */}
            <div className="absolute -top-10 -right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
