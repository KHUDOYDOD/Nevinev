import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CurrencyFormatter } from "@/components/ui/currency-formatter";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="custom-gradient text-white pt-16 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              {t('hero.subtitle')}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent text-primary font-bold rounded-full hover:bg-accent-light transform hover:-translate-y-1 shadow-lg transition-all"
            >
              <a href="#calculator">
                {t('hero.start_investing')}
              </a>
            </Button>
          </div>
          <div className="lg:w-1/2 relative">
            {/* Investment Dashboard Visualization */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl p-6 mx-auto relative z-10 animate-float">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{t('hero.dashboard.profits')}</h3>
                  <p className="text-2xl font-bold text-green-400">+12.5%</p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">24h</span>
                  <span className="px-3 py-1 bg-primary rounded-full text-sm">7d</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">30d</span>
                </div>
              </div>
              
              <div className="h-40 w-full mb-6 bg-white/5 rounded-lg border border-white/10 flex items-end p-4">
                {/* Chart bars */}
                <div className="w-1/12 h-20 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-16 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-24 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-28 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-32 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-24 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-36 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-28 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-32 bg-primary rounded-t-sm mr-1 animate-pulse-slow"></div>
                <div className="w-1/12 h-36 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-40 bg-primary/40 rounded-t-sm mr-1"></div>
                <div className="w-1/12 h-32 bg-primary/40 rounded-t-sm"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-gray-300 text-xs">{t('hero.dashboard.active_investments')}</p>
                  <p className="text-xl font-bold">
                    <CurrencyFormatter value={2450} />
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-gray-300 text-xs">{t('hero.dashboard.daily_profit')}</p>
                  <p className="text-xl font-bold text-green-400">
                    +<CurrencyFormatter value={306.25} />
                  </p>
                </div>
              </div>
            </div>
            
            {/* Background decorations */}
            <div className="absolute top-10 -right-10 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary opacity-20 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
