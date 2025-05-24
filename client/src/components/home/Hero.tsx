import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="custom-gradient text-white pt-16 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {t("hero.title").split(".").map((part, index) => (
                <span key={index} className="block">
                  {index === 1 ? (
                    <span className="text-accent">{part}</span>
                  ) : (
                    part
                  )}
                  {index === 0 && "."}
                </span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              <span className="font-bold text-accent">
                {t("hero.subtitle")}
              </span>
            </p>
            <Button
              asChild
              className="bg-accent text-primary font-bold rounded-full hover:bg-accent-light transition transform hover:-translate-y-1 shadow-lg px-8 py-4 h-auto"
            >
              <a href="#calculator">{t("hero.button")}</a>
            </Button>
          </motion.div>
          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1400&h=1000"
              alt="Investment platform Tradepo"
              className="rounded-xl shadow-2xl mx-auto relative z-10 animate-float"
            />
            <div className="absolute top-10 -right-10 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary opacity-20 rounded-full blur-3xl -z-0"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
