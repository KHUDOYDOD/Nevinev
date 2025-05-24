import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Container } from "@/components/ui/container";

export function Footer() {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="font-bold text-2xl text-white">TRADEPO</span>
              <span className="text-sm text-gray-400 ml-2">| Smart Profit System</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-telegram-plane text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-vk text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/#tariffs" className="text-gray-400 hover:text-white transition">
                  {t('nav.tariffs')}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition">
                  {t('nav.how_it_works')}
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="text-gray-400 hover:text-white transition">
                  {t('nav.reviews')}
                </Link>
              </li>
              <li>
                <Link href="/#contacts" className="text-gray-400 hover:text-white transition">
                  {t('nav.contacts')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  {t('footer.investment_rules')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} TRADEPO.RU. {t('footer.all_rights_reserved')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login?lang=ru" className="text-gray-400 hover:text-white transition text-sm">
              Русский
            </Link>
            <Link href="/login?lang=en" className="text-gray-400 hover:text-white transition text-sm">
              English
            </Link>
            <Link href="/login?lang=tj" className="text-gray-400 hover:text-white transition text-sm">
              Тоҷикӣ
            </Link>
            <Link href="/login?lang=kz" className="text-gray-400 hover:text-white transition text-sm">
              Қазақша
            </Link>
            <Link href="/login?lang=uz" className="text-gray-400 hover:text-white transition text-sm">
              O'zbekcha
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
