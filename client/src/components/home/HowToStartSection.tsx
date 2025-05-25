import { CircleUser, FileStack, CreditCard, Rocket, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowToStartSection() {
  return (
    <section id="how-to-start" className="py-20 bg-gradient-to-b from-gray-900/50 to-background/80 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      
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
        
        {/* Шаги процесса */}
        <div className="relative mb-16">
          {/* Линия, соединяющая шаги */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 transform -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Шаг 1: Регистрация */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-fade-in">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full mb-4 z-10 relative animate-pulse animate-duration-slow">
                <CircleUser className="h-8 w-8 text-blue-400" />
              </div>
              <span className="text-sm text-center">Регистрация</span>
            </div>
            
            {/* Шаг 2: Выбор тарифа */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-fade-in animate-delay-100">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full mb-4 z-10 relative">
                <FileStack className="h-8 w-8 text-purple-400" />
              </div>
              <span className="text-sm text-center">Выбор тарифа</span>
            </div>
            
            {/* Шаг 3: Пополнение баланса */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-fade-in animate-delay-200">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-full mb-4 z-10 relative">
                <CreditCard className="h-8 w-8 text-cyan-400" />
              </div>
              <span className="text-sm text-center">Пополнение баланса</span>
            </div>
            
            {/* Шаг 4: Активация депозита */}
            <div className="flex flex-col items-center mb-8 md:mb-0 animate-fade-in animate-delay-300">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full mb-4 z-10 relative">
                <Rocket className="h-8 w-8 text-red-400" />
              </div>
              <span className="text-sm text-center">Активация депозита</span>
            </div>
            
            {/* Шаг 5: Получение прибыли */}
            <div className="flex flex-col items-center animate-fade-in animate-delay-400">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full mb-4 z-10 relative">
                <Coins className="h-8 w-8 text-green-400" />
              </div>
              <span className="text-sm text-center">Получение прибыли</span>
            </div>
          </div>
        </div>
        
        {/* Блок с подробным описанием */}
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 animate-fade-in animate-delay-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 font-bold">3</span>
            </div>
            <h3 className="text-2xl font-bold">Пополнение баланса</h3>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Пополните счет удобным для вас способом: банковская карта, банковский перевод или криптовалюта.
          </p>
          
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array(5).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === 2 ? 'bg-blue-500 scale-125' : 'bg-gray-500/50'}`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full px-8 py-6 shadow-lg animate-pulse animate-duration-slow"
            >
              Начать инвестировать
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}