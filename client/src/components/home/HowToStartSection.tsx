import { CircleUser, FileStack, CreditCard, Rocket, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowToStartSection() {
  return (
    <section id="how-to-start" className="py-20 bg-gradient-to-b from-gray-900/50 to-background/80 relative overflow-hidden">
      {/* Расширенные декоративные элементы фона */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse animate-duration-very-slow"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse animate-duration-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl animate-float-rotate animate-duration-very-slow"></div>
      <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-green-500/5 rounded-full blur-3xl animate-float animate-duration-slow"></div>
      
      {/* Декоративные частицы */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float animate-duration-slow"></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float-sideways animate-duration-slow"></div>
      <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float-rotate animate-duration-slow"></div>
      <div className="absolute bottom-1/2 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-float animate-duration-very-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Руководство</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">Как начать инвестировать</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Просто выполните пять простых шагов и начните получать прибыль уже через 24 часа
          </p>
        </div>
        
        {/* Шаги процесса - улучшенная версия с анимациями */}
        <div className="relative mb-16">
          {/* Линия, соединяющая шаги с анимацией градиента */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 transform -translate-y-1/2 animate-background-shift animate-duration-very-slow rounded-full shadow-lg shadow-blue-500/10"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Шаг 1: Регистрация */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-scale-in group">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-full mb-4 z-10 relative shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/10 animate-pulse animate-duration-slow"></div>
                <CircleUser className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-all duration-300" />
              </div>
              <span className="text-sm font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 group-hover:from-blue-300 group-hover:to-blue-200 transition-all duration-300">Регистрация</span>
            </div>
            
            {/* Шаг 2: Выбор тарифа */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-scale-in animate-delay-100 group">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-full mb-4 z-10 relative shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/10 to-purple-600/10 animate-pulse animate-duration-slow animate-delay-100"></div>
                <FileStack className="h-10 w-10 text-purple-400 group-hover:text-purple-300 transition-all duration-300" />
              </div>
              <span className="text-sm font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-300 group-hover:from-purple-300 group-hover:to-purple-200 transition-all duration-300">Выбор тарифа</span>
            </div>
            
            {/* Шаг 3: Пополнение баланса */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-scale-in animate-delay-200 group">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 rounded-full mb-4 z-10 relative shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/10 to-cyan-600/10 animate-pulse animate-duration-slow animate-delay-200"></div>
                <CreditCard className="h-10 w-10 text-cyan-400 group-hover:text-cyan-300 transition-all duration-300" />
              </div>
              <span className="text-sm font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300 group-hover:from-cyan-300 group-hover:to-cyan-200 transition-all duration-300">Пополнение баланса</span>
            </div>
            
            {/* Шаг 4: Активация депозита */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-scale-in animate-delay-300 group">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-full mb-4 z-10 relative shadow-lg shadow-red-500/20 group-hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/10 to-red-600/10 animate-pulse animate-duration-slow animate-delay-300"></div>
                <Rocket className="h-10 w-10 text-red-400 group-hover:text-red-300 transition-all duration-300" />
              </div>
              <span className="text-sm font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-300 group-hover:from-red-300 group-hover:to-red-200 transition-all duration-300">Активация депозита</span>
            </div>
            
            {/* Шаг 5: Получение прибыли */}
            <div className="flex flex-col items-center animate-scale-in animate-delay-400 group">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-full mb-4 z-10 relative shadow-lg shadow-green-500/20 group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/10 to-green-600/10 animate-pulse animate-duration-slow animate-delay-400"></div>
                <Coins className="h-10 w-10 text-green-400 group-hover:text-green-300 transition-all duration-300" />
              </div>
              <span className="text-sm font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-300 group-hover:from-green-300 group-hover:to-green-200 transition-all duration-300">Получение прибыли</span>
            </div>
          </div>
        </div>
        
        {/* Блок с подробным описанием - улучшенная версия */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-lg shadow-blue-500/5 animate-fade-in animate-delay-300 relative overflow-hidden group hover:shadow-blue-500/10 transition-all duration-500">
          {/* Декоративные элементы в блоке */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-80 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:opacity-80 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all duration-300 animate-pulse animate-duration-slow">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Пополнение баланса</h3>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-8 shadow-inner">
              <p className="text-lg text-white/80 leading-relaxed">
                Пополните счет удобным для вас способом: банковская карта, банковский перевод или криптовалюта. Средства будут зачислены мгновенно, и вы сможете сразу начать инвестировать.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center shadow-lg animate-float">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path>
                </svg>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center shadow-lg animate-float animate-delay-100">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"></path>
                </svg>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center shadow-lg animate-float animate-delay-200">
                <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.06 11.57c.59-.69.94-1.59.94-2.57 0-2.21-1.79-4-4-4H8v14h7.61c2.08 0 3.76-1.69 3.76-3.76 0-1.19-.55-2.25-1.41-2.94l-.9-.73zM10 7h3c.55 0 1 .45 1 1s-.45 1-1 1h-3V7zm3.5 10H10v-2h3.5c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
                </svg>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="flex gap-3">
                {Array(5).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      i === 2 
                        ? 'w-8 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30' 
                        : 'w-2.5 bg-white/20'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg rounded-full px-10 py-7 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 animate-pulse animate-duration-slow group-hover:animate-none transform hover:scale-105"
              >
                Начать инвестировать
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}