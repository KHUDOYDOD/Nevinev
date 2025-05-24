import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="custom-gradient text-white pt-16 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {t('hero.title.first')}<br />
              <span className="text-accent">{t('hero.title.second')}</span> {t('hero.title.third')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              {t('hero.subtitle.first')} <span className="font-bold text-accent">{t('hero.subtitle.second')}</span> {t('hero.subtitle.third')}
            </p>
            <Button
              size="lg"
              className="bg-accent text-primary font-bold rounded-full hover:bg-accent/90 transform hover:-translate-y-1 shadow-lg transition-all"
              asChild
            >
              <a href="#calculator">{t('hero.cta')}</a>
            </Button>
          </div>
          <div className="lg:w-1/2 relative">
            <svg 
              className="rounded-xl shadow-2xl mx-auto relative z-10 animate-float"
              viewBox="0 0 600 400" 
              width="100%" 
              height="100%"
            >
              <rect width="600" height="400" fill="#3554D1" rx="20" />
              <circle cx="450" cy="100" r="80" fill="#00A3FF" opacity="0.5" />
              <circle cx="100" cy="300" r="120" fill="#3554D1" opacity="0.7" />
              
              {/* Chart elements */}
              <polyline 
                points="50,300 100,250 150,260 200,200 250,220 300,180 350,100 400,150 450,120 500,150 550,100" 
                fill="none" 
                stroke="#FFD700" 
                strokeWidth="3"
              />
              
              {/* Coins */}
              <circle cx="150" cy="150" r="30" fill="#FFD700" />
              <circle cx="150" cy="150" r="25" fill="#FFC700" />
              <text x="150" y="155" textAnchor="middle" fill="#fff" fontWeight="bold">$</text>
              
              <circle cx="450" cy="250" r="30" fill="#FFD700" />
              <circle cx="450" cy="250" r="25" fill="#FFC700" />
              <text x="450" y="255" textAnchor="middle" fill="#fff" fontWeight="bold">$</text>
              
              {/* Profit arrow */}
              <polygon points="300,320 350,320 325,270" fill="#00C48C" />
              <rect x="280" y="320" width="90" height="30" fill="#00C48C" rx="5" />
              <text x="325" y="340" textAnchor="middle" fill="#fff" fontWeight="bold">+15%</text>
              
              {/* Data elements */}
              <rect x="100" y="350" width="120" height="20" fill="#ffffff20" rx="5" />
              <rect x="250" y="350" width="150" height="20" fill="#ffffff20" rx="5" />
              <rect x="430" y="350" width="100" height="20" fill="#ffffff20" rx="5" />
            </svg>

            <div className="absolute top-10 -right-10 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary opacity-20 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
