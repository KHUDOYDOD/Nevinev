import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, TrendingUp, ChevronsUp, DollarSign, Calendar, ArrowRightCircle } from "lucide-react";

type Tariff = {
  id: number;
  name: string;
  dailyRate: number;
  minAmount: number;
};

export default function CalculatorSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Fetch tariffs from API
  const { data: tariffs, isLoading } = useQuery<Tariff[]>({
    queryKey: ['/api/tariffs'],
  });
  
  const [selectedTariffIndex, setSelectedTariffIndex] = useState(1); // Default to middle (Premium)
  const [amount, setAmount] = useState(500);
  const [days, setDays] = useState(30);
  
  // Update amount if selected tariff changes to ensure minimum amount
  useEffect(() => {
    if (tariffs && tariffs[selectedTariffIndex]) {
      const minAmount = tariffs[selectedTariffIndex].minAmount;
      if (amount < minAmount) {
        setAmount(minAmount);
      }
    }
  }, [selectedTariffIndex, tariffs]);
  
  const selectedTariff = tariffs && tariffs[selectedTariffIndex];
  const rate = selectedTariff ? selectedTariff.dailyRate : 10; // Default 10%
  
  const dailyProfit = amount * (rate / 100);
  const totalProfit = dailyProfit * days;
  const finalAmount = amount + totalProfit;
  
  // Handle login modal
  const handleInvestClick = () => {
    // This function would be used to navigate or open login modal
    const loginBtn = document.getElementById('login-button');
    if (loginBtn) {
      loginBtn.click();
    }
  };
  
  if (isLoading) {
    return (
      <section id="calculator" className="py-20 bg-gradient-to-b from-background/80 via-gray-900/30 to-background/90 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm shadow-lg">
              <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Инвестиционный калькулятор</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Рассчитайте свою прибыль
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Используйте наш инвестиционный калькулятор для планирования инвестиций
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto backdrop-blur-sm bg-white/5 rounded-3xl shadow-2xl p-8 border border-white/10 relative">
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-center">Загрузка данных калькулятора...</h3>
                <div className="w-64 h-2 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 rounded-full overflow-hidden relative">
                  <div className="absolute h-full w-full left-0 top-0 animate-shine" 
                    style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', backgroundSize: '200% 100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Создаем варианты для анимаций
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.3, duration: 0.5 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    }
  };
  
  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: { 
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };
  
  const shineVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  // Склонение дней
  const getDaysText = (days: number) => {
    if (days % 10 === 1 && days % 100 !== 11) {
      return 'день';
    } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
      return 'дня';
    } else {
      return 'дней';
    }
  };

  return (
    <section id="calculator" className="py-24 relative overflow-hidden bg-gradient-to-b from-background/80 via-gray-900/30 to-background/90">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Градиентные блобы */}
        <motion.div 
          className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] bg-gradient-to-r from-violet-500/10 to-purple-500/5 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 50, 0],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        
        {/* Анимированные частицы */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/50"
              initial={{ 
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3
              }}
              animate={{ 
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{ scale: 0.5 + Math.random() * 1.5 }}
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
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Инвестиционный калькулятор</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-tight">
            <span className="relative inline-block">
              <span className="relative z-10">Рассчитайте</span>
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
              <span className="relative z-10">свою прибыль</span>
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
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            Выберите сумму и срок инвестиции и мгновенно узнайте ожидаемый доход
          </motion.p>
        </motion.div>
        
        {/* Главный калькулятор */}
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/10 overflow-hidden relative"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5 }}
          >
            {/* Декоративные элементы */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/30 rounded-full blur-3xl opacity-20"></div>
            
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Левая колонка - элементы формы */}
              <motion.div 
                className="lg:w-1/2"
                variants={itemVariants}
              >
                {/* Сумма инвестиции */}
                <motion.div 
                  className="mb-8 group"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-lg"
                      variants={floatVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <DollarSign className="h-5 w-5 text-primary" />
                    </motion.div>
                    <label className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:from-primary group-hover:to-primary/80 transition-all duration-500">
                      Сумма инвестиции ($)
                    </label>
                  </div>
                  
                  <motion.div 
                    className="relative mb-4 overflow-hidden rounded-2xl"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 animate-pulse"></div>
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 relative">
                      <div className="relative">
                        <span className="absolute left-4 top-4 text-foreground/70 text-xl">$</span>
                        <Input
                          type="number"
                          value={amount}
                          min={selectedTariff?.minAmount || 100}
                          max={10000}
                          className="pl-10 h-16 text-2xl font-bold bg-transparent border-none focus:ring-0 shadow-none"
                          onChange={(e) => setAmount(Number(e.target.value))}
                        />
                        <motion.span 
                          className="absolute right-4 top-4 text-sm text-foreground/60 bg-primary/10 px-2 py-1 rounded-md"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {rate}% в день
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-2 relative"
                    variants={itemVariants}
                  >
                    <Slider
                      value={[amount]}
                      min={selectedTariff?.minAmount || 100}
                      max={10000}
                      step={100}
                      className="z-10"
                      onValueChange={(value) => setAmount(value[0])}
                    />
                    
                    <motion.div 
                      className="absolute h-3 inset-x-0 top-[6px] bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-full -z-10"
                      animate={{ 
                        backgroundPosition: ['0% center', '100% center', '0% center'] 
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      style={{ backgroundSize: '200% 100%' }}
                    >
                      <motion.div 
                        className="absolute inset-0 w-full h-full"
                        variants={shineVariants}
                        initial="initial"
                        animate="animate"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          backgroundSize: '200% 100%'
                        }}
                      />
                    </motion.div>
                    
                    <div className="flex justify-between mt-2 text-sm text-foreground/60">
                      <span>{selectedTariff?.minAmount || 100}$</span>
                      <span>10,000$</span>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Выбор тарифа */}
                <motion.div 
                  className="mb-8 group"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center shadow-lg"
                      variants={floatVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <ChevronsUp className="h-5 w-5 text-secondary" />
                    </motion.div>
                    <label className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:from-secondary group-hover:to-secondary/80 transition-all duration-500">
                      Выберите тарифный план
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {tariffs?.map((tariff, index) => (
                      <motion.button
                        key={tariff.id}
                        variants={cardVariants}
                        whileHover="hover"
                        className={`py-4 px-2 backdrop-blur-md rounded-2xl text-base font-semibold transition-all duration-500 relative overflow-hidden ${
                          selectedTariffIndex === index
                            ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20'
                            : 'bg-white/5 border border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedTariffIndex(index)}
                      >
                        {selectedTariffIndex === index && (
                          <motion.div 
                            className="absolute inset-0 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div 
                              className="absolute inset-0 w-full h-full"
                              variants={shineVariants}
                              initial="initial"
                              animate="animate"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                backgroundSize: '200% 100%'
                              }}
                            />
                            <motion.div 
                              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity
                              }}
                            />
                          </motion.div>
                        )}
                        
                        <div className="flex flex-col items-center gap-2 relative z-10">
                          <span className={selectedTariffIndex === index ? "text-white" : "text-foreground/90"}>
                            {tariff.name}
                          </span>
                          <motion.div 
                            className={`text-xl font-bold ${selectedTariffIndex === index ? "text-white" : "text-primary"}`}
                            animate={{ 
                              scale: selectedTariffIndex === index ? [1, 1.1, 1] : 1
                            }}
                            transition={{ 
                              duration: 1.5,
                              repeat: selectedTariffIndex === index ? Infinity : 0,
                              repeatType: "reverse"
                            }}
                          >
                            {tariff.dailyRate}%
                          </motion.div>
                          <span className="text-xs opacity-80">в день</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                
                {/* Срок инвестирования */}
                <motion.div 
                  className="mb-6 group"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-violet-500/10 flex items-center justify-center shadow-lg"
                      variants={floatVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <Calendar className="h-5 w-5 text-violet-400" />
                    </motion.div>
                    <label className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:from-violet-400 group-hover:to-violet-400/80 transition-all duration-500">
                      Срок инвестирования (дней)
                    </label>
                  </div>
                  
                  <motion.div 
                    className="relative mb-4 overflow-hidden rounded-2xl"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-secondary/5 to-violet-500/5 animate-pulse"></div>
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 relative">
                      <Input
                        type="number"
                        value={days}
                        min={1}
                        max={365}
                        className="h-16 text-2xl font-bold bg-transparent border-none focus:ring-0 shadow-none"
                        onChange={(e) => setDays(Number(e.target.value))}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-2 relative"
                    variants={itemVariants}
                  >
                    <Slider
                      value={[days]}
                      min={1}
                      max={365}
                      step={1}
                      className="z-10"
                      onValueChange={(value) => setDays(value[0])}
                    />
                    
                    <motion.div 
                      className="absolute h-3 inset-x-0 top-[6px] bg-gradient-to-r from-violet-500/30 via-secondary/30 to-violet-500/30 rounded-full -z-10"
                      animate={{ 
                        backgroundPosition: ['0% center', '100% center', '0% center'] 
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      style={{ backgroundSize: '200% 100%' }}
                    >
                      <motion.div 
                        className="absolute inset-0 w-full h-full"
                        variants={shineVariants}
                        initial="initial"
                        animate="animate"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          backgroundSize: '200% 100%'
                        }}
                      />
                    </motion.div>
                    
                    <div className="flex justify-between mt-2 text-sm text-foreground/60">
                      <span>1 день</span>
                      <span>365 дней</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Правая колонка - результаты */}
              <motion.div 
                className="lg:w-1/2"
                variants={itemVariants}
              >
                <motion.div 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full relative overflow-hidden"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Декоративные элементы */}
                  <motion.div 
                    className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  <motion.div 
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 2
                    }}
                  />
                  
                  {/* Заголовок и график */}
                  <div className="relative z-10">
                    <motion.div 
                      className="flex items-center gap-3 mb-6"
                      variants={itemVariants}
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Ваша прибыль
                      </h3>
                    </motion.div>
                    
                    {/* График доходности - упрощенная версия */}
                    <motion.div 
                      className="w-full h-28 mb-6 relative"
                      variants={itemVariants}
                    >
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="border-b border-r border-white/5"></div>
                        ))}
                      </div>
                      
                      <motion.div 
                        className="absolute bottom-0 left-0 w-full h-full flex items-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      >
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <motion.path
                            d="M0,100 C20,80 40,75 60,60 C80,45 90,20 100,0"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.7 }}
                          />
                          
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="var(--primary)" />
                              <stop offset="100%" stopColor="var(--secondary)" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Маркеры на графике */}
                        <motion.div 
                          className="absolute left-1/4 bottom-1/3 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2, duration: 0.4 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </motion.div>
                        
                        <motion.div 
                          className="absolute left-3/4 bottom-[70%] w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.4, duration: 0.4 }}
                        >
                          <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        </motion.div>
                      </motion.div>
                      
                      <motion.div 
                        className="absolute -top-2 -right-2 bg-primary/90 text-white text-sm font-bold rounded-full px-3 py-1 shadow-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                        transition={{ 
                          delay: 1.5, 
                          duration: 0.5,
                          y: {
                            delay: 2,
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }
                        }}
                      >
                        +{rate}% в день
                      </motion.div>
                    </motion.div>
                    
                    {/* Результаты расчета */}
                    <div className="space-y-4">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={`daily-${dailyProfit}`}
                          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg overflow-hidden"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          exit={{ opacity: 0, y: 20 }}
                          layout
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">Ежедневная прибыль</p>
                              <motion.p 
                                className="text-3xl font-extrabold text-success bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300"
                                key={dailyProfit}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                +{dailyProfit.toFixed(2)}$
                              </motion.p>
                            </div>
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            >
                              <TrendingUp className="h-6 w-6 text-green-400" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                      
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={`total-${totalProfit}`}
                          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg overflow-hidden"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          exit={{ opacity: 0, y: 20 }}
                          layout
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">Общая прибыль за {days} {getDaysText(days)}</p>
                              <motion.p 
                                className="text-3xl font-extrabold text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                                key={totalProfit}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                +{totalProfit.toFixed(2)}$
                              </motion.p>
                            </div>
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 0.5
                              }}
                            >
                              <ChevronsUp className="h-6 w-6 text-primary" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                      
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={`final-${finalAmount}`}
                          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg overflow-hidden"
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          exit={{ opacity: 0, y: 20 }}
                          layout
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">Итоговая сумма</p>
                              <div className="flex items-baseline">
                                <motion.p 
                                  className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
                                  key={finalAmount}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {finalAmount.toFixed(2)}$
                                </motion.p>
                                <span className="ml-2 text-sm font-medium text-foreground/60">
                                  (инвестиция + прибыль)
                                </span>
                              </div>
                            </div>
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-br from-foreground/20 to-foreground/10 rounded-full flex items-center justify-center"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 1
                              }}
                            >
                              <DollarSign className="h-6 w-6 text-foreground/80" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    
                    {/* Кнопка действия */}
                    <motion.div 
                      className="mt-6"
                      variants={itemVariants}
                    >
                      {isAuthenticated ? (
                        <motion.div variants={buttonVariants} whileHover="hover">
                          <Button
                            className="w-full py-8 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden group"
                            asChild
                          >
                            <a href="/dashboard">
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                Инвестировать сейчас
                                <motion.span 
                                  animate={{ 
                                    x: [0, 5, 0] 
                                  }}
                                  transition={{ 
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                  }}
                                >
                                  <ArrowRightCircle className="h-6 w-6" />
                                </motion.span>
                              </span>
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></span>
                            </a>
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div variants={buttonVariants} whileHover="hover">
                          <Button
                            className="w-full py-8 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden group"
                            onClick={handleInvestClick}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              Инвестировать сейчас
                              <motion.span 
                                animate={{ 
                                  x: [0, 5, 0] 
                                }}
                                transition={{ 
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              >
                                <ArrowRightCircle className="h-6 w-6" />
                              </motion.span>
                            </span>
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></span>
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
