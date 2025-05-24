import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <span className="font-bold text-2xl text-white">TRADEPO</span>
              <span className="text-sm text-gray-400 ml-2">
                | Smart Profit System
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-xs">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Telegram"
              >
                <i className="fab fa-telegram-plane text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="VK"
              >
                <i className="fab fa-vk text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">{t("footer.navigation")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("common.home")}
                </a>
              </li>
              <li>
                <a
                  href="#tariffs"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("common.tariffs")}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("common.howItWorks")}
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("common.reviews")}
                </a>
              </li>
              <li>
                <a
                  href="#contacts"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("common.contacts")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">{t("footer.legal")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.termsOfUse")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.privacyPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.investmentRules")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center">
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
