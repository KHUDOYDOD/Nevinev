import { ShieldCheck, Clock, Zap, BarChart3, Award, RefreshCw } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="py-20 bg-gradient-to-b from-background/50 to-background relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Преимущества</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">Почему выбирают нас</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Мы предлагаем надежную платформу для инвестиций с множеством уникальных преимуществ
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in animate-delay-200">
          {/* Высокая доходность */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Высокая доходность</h3>
            <p className="text-muted-foreground">
              Ежедневные выплаты с доходностью до 10% — ваши деньги работают на максимум
            </p>
          </div>
          
          {/* Безопасность и надежность */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-7 w-7 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Безопасность и надежность</h3>
            <p className="text-muted-foreground">
              Безопасные и прозрачные инвестиции с минимальными рисками и гарантией возврата
            </p>
          </div>
          
          {/* Быстрые выплаты */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-7 w-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Быстрые выплаты</h3>
            <p className="text-muted-foreground">
              Мгновенное зачисление средств на счет и быстрый вывод на ваши кошельки или карты
            </p>
          </div>
          
          {/* Мгновенный старт */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="h-7 w-7 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Мгновенный старт</h3>
            <p className="text-muted-foreground">
              Начните инвестировать всего за несколько минут после регистрации
            </p>
          </div>
        </div>
        
        {/* Дополнительные преимущества из скриншота */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 animate-fade-in animate-delay-300">
          {/* Бонусы для постоянных клиентов */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-7 w-7 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Бонусы для постоянных клиентов</h3>
            <p className="text-muted-foreground">
              Увеличивайте свою доходность с нашей программой лояльности для активных инвесторов
            </p>
          </div>
          
          {/* Реинвестирование */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <RefreshCw className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Реинвестирование</h3>
            <p className="text-muted-foreground">
              Автоматически реинвестируйте полученную прибыль для максимизации ваших доходов
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}