import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  CircleUser, FileStack, CreditCard, Rocket, 
  Coins, ArrowRight, ArrowLeft, CheckCircle, 
  Wallet, CreditCard as CreditCardIcon
} from "lucide-react";

export default function HowToStartSection() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      icon: <CircleUser className="h-10 w-10" />,
      title: "Создайте аккаунт",
      description: "Быстрая регистрация всего за 30 секунд без сложных проверок и подтверждений. Укажите только необходимый минимум информации.",
      color: "from-blue-600 to-blue-400",
      bgLight: "from-blue-600/20 to-blue-400/10",
      textColor: "text-blue-400",
      image: "/assets/registration.png"
    },
    {
      icon: <FileStack className="h-10 w-10" />,
      title: "Выберите инвестиционный план",
      description: "Подберите тариф, который соответствует вашим финансовым целям. Разные варианты доходности для разных возможностей.",
      color: "from-purple-600 to-purple-400",
      bgLight: "from-purple-600/20 to-purple-400/10",
      textColor: "text-purple-400",
      image: "/assets/investment-plan.png"
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: "Пополните баланс",
      description: "Внесите средства любым удобным способом: банковская карта, электронные кошельки или криптовалюта.",
      color: "from-cyan-600 to-cyan-400",
      bgLight: "from-cyan-600/20 to-cyan-400/10",
      textColor: "text-cyan-400",
      image: "/assets/deposit.png"
    },
    {
      icon: <Rocket className="h-10 w-10" />,
      title: "Активируйте инвестицию",
      description: "Запустите работу вашего капитала одним кликом. Ваши деньги начинают приносить прибыль сразу же после активации.",
      color: "from-amber-600 to-amber-400",
      bgLight: "from-amber-600/20 to-amber-400/10",
      textColor: "text-amber-400",
      image: "/assets/activate.png"
    },
    {
      icon: <Coins className="h-10 w-10" />,
      title: "Получайте доход ежедневно",
      description: "Наблюдайте за ростом вашего капитала в реальном времени. Снимайте прибыль в любой момент без ограничений.",
      color: "from-emerald-600 to-emerald-400",
      bgLight: "from-emerald-600/20 to-emerald-400/10",
      textColor: "text-emerald-400",
      image: "/assets/profit.png"
    }
  ];
  
  // Получаем текущий шаг и информацию о нем
  const currentStep = steps[activeStep];
  
  // Вспомогательные методы для навигации
  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (index) => setActiveStep(index);
  
  // Варианты анимации для Framer Motion
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
  };

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-gradient-to-b from-background/80 via-gray-900/30 to-background/90">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Градиентные блобы */}
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] bg-gradient-to-r from-violet-500/10 to-purple-500/5 rounded-full blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
        
        {/* Анимированные частицы */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-primary/50 animate-floating-particle`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок секции */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-6 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm shadow-lg shadow-primary/5">
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Начните зарабатывать прямо сейчас</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-tight">
            <span className="relative inline-block">
              <span className="relative z-10">Как начать</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded-full -z-10 transform skew-x-12"></span>
            </span>{" "}
            получать прибыль
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in animate-delay-100 leading-relaxed">
            Всего 5 простых шагов отделяют вас от стабильного пассивного дохода до 15% в день
          </p>
        </motion.div>
        
        {/* Интерактивная навигация по шагам */}
        <div className="flex justify-center mb-12">
          <div className="hidden md:flex bg-white/5 backdrop-blur-sm p-1.5 rounded-full shadow-inner items-center gap-2">
            {steps.map((step, index) => (
              <motion.button
                key={index}
                className={`relative rounded-full py-2.5 px-4 flex items-center gap-2 transition-all duration-300 ${
                  activeStep === index 
                    ? `bg-gradient-to-r ${currentStep.color} text-white shadow-lg` 
                    : 'hover:bg-white/10 text-white/70'
                }`}
                onClick={() => goToStep(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`flex items-center justify-center h-6 w-6 rounded-full ${
                  activeStep === index ? 'bg-white/20' : `bg-gradient-to-r ${step.bgLight}`
                }`}>
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{index === 0 ? "Регистрация" : index === 1 ? "Тариф" : index === 2 ? "Депозит" : index === 3 ? "Активация" : "Прибыль"}</span>
              </motion.button>
            ))}
          </div>
          
          {/* Мобильная версия навигации */}
          <div className="md:hidden flex justify-center gap-2">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                  activeStep === index 
                    ? `w-8 bg-gradient-to-r ${step.color} shadow-lg` 
                    : 'w-2.5 bg-white/20'
                }`}
                onClick={() => goToStep(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
        
        {/* Главное содержимое со сменяемыми шагами */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая колонка - анимированная иллюстрация */}
          <motion.div 
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Декоративный круг */}
              <div className={`absolute inset-0 bg-gradient-to-r ${currentStep.bgLight} rounded-full blur-3xl opacity-80 transform scale-90`}></div>
              
              {/* Главная иллюстрация */}
              <div className={`relative z-10 bg-gradient-to-br ${currentStep.bgLight} rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden`}>
                <div className="relative">
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-r ${currentStep.color} rounded-full opacity-20 blur-2xl -translate-x-10 -translate-y-20`}></div>
                  <div className={`absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r ${currentStep.color} rounded-full opacity-20 blur-2xl translate-x-10 translate-y-20`}></div>
                  
                  {/* Иконка с кругом */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${currentStep.color} flex items-center justify-center shadow-lg`}>
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        key={activeStep}
                        className="text-white"
                      >
                        {currentStep.icon}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Номер шага с круговым прогрессом */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="45" fill="none" 
                          stroke="rgba(255,255,255,0.1)" 
                          strokeWidth="8" 
                        />
                        <circle 
                          cx="50" cy="50" r="45" fill="none" 
                          stroke="white" 
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * ((activeStep + 1) / steps.length))}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {activeStep + 1}/{steps.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Список проверочных пунктов */}
                  <ul className="space-y-3 mb-8">
                    {[
                      "Быстро и легко",
                      "Без скрытых комиссий",
                      "Поддержка 24/7",
                      activeStep >= 3 ? "Автоматические выплаты" : "Мгновенное зачисление"
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-center gap-3 text-white/90"
                      >
                        <CheckCircle className={`h-5 w-5 ${currentStep.textColor}`} />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Методы оплаты если активен шаг 3 (пополнение) */}
                  {activeStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center gap-6 mb-6"
                    >
                      <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <CreditCardIcon className="h-8 w-8 text-white" />
                      </div>
                      <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Wallet className="h-8 w-8 text-white" />
                      </div>
                      <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Coins className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Анимированные декоративные элементы */}
                  <div className="absolute top-1/4 right-4 w-3 h-3 rounded-full bg-white/30 animate-pulse"></div>
                  <div className="absolute bottom-1/3 left-6 w-2 h-2 rounded-full bg-white/20 animate-float-slow"></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Правая колонка - информация о шаге */}
          <div className="order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="h-full"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentStep.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold">{activeStep + 1}</span>
                    </div>
                    <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${currentStep.color}`}>
                      {currentStep.title}
                    </h3>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-8">
                    <p className="text-lg text-white/80 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                  
                  {/* Дополнительный контент в зависимости от шага */}
                  {activeStep === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mb-8 grid grid-cols-2 gap-4"
                    >
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <p className="text-white/60 text-sm mb-2">Время регистрации</p>
                        <p className="text-2xl font-bold text-white">30 секунд</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <p className="text-white/60 text-sm mb-2">Необходимые данные</p>
                        <p className="text-2xl font-bold text-white">Минимум</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {activeStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mb-8 grid grid-cols-1 gap-4"
                    >
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-white/60 text-sm">Базовый</p>
                          <p className="text-xl font-bold text-white">5%</p>
                        </div>
                        <div className="text-white/80">в день</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute right-0 top-0 bg-gradient-to-l from-purple-500/30 to-transparent w-1/3 h-full"></div>
                        <div className="relative z-10">
                          <p className="text-white/60 text-sm">Премиум</p>
                          <p className="text-xl font-bold text-white">7%</p>
                        </div>
                        <div className="text-white/80 relative z-10">в день</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-white/60 text-sm">VIP</p>
                          <p className="text-xl font-bold text-white">10%</p>
                        </div>
                        <div className="text-white/80">в день</div>
                      </div>
                    </motion.div>
                  )}
                  
                  {activeStep === 4 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mb-8"
                    >
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white/60">Инвестиция: $1000</p>
                          <p className="text-white font-bold">Тариф: Премиум 7%</p>
                        </div>
                        <div className="w-full bg-white/10 h-3 rounded-full mb-2">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full w-[70%]"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-white/60">7 дней</p>
                          <p className="text-emerald-400 font-bold">+$490 (49%)</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Кнопки навигации */}
                  <div className="flex justify-between items-center gap-4">
                    <Button
                      onClick={prevStep}
                      disabled={activeStep === 0}
                      className={`${
                        activeStep === 0 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:scale-105'
                      } bg-white/10 backdrop-blur-sm border border-white/10 text-white flex items-center gap-2 transition-all duration-300 px-6`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Назад
                    </Button>
                    
                    <Button
                      onClick={nextStep}
                      disabled={activeStep === steps.length - 1}
                      className={`${
                        activeStep === steps.length - 1 
                          ? 'hidden' 
                          : 'bg-gradient-to-r from-primary to-secondary hover:scale-105'
                      } text-white flex items-center gap-2 transition-all duration-300 px-6`}
                    >
                      Далее
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    
                    {activeStep === steps.length - 1 && (
                      <Button
                        className="bg-gradient-to-r from-emerald-500 to-emerald-300 text-white font-bold px-8 py-6 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
                      >
                        Начать инвестировать
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}