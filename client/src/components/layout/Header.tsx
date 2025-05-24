import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { href: "/", label: t("common.home") },
    { href: "#tariffs", label: t("common.tariffs") },
    { href: "#how-it-works", label: t("common.howItWorks") },
    { href: "#reviews", label: t("common.reviews") },
    { href: "#contacts", label: t("common.contacts") },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-2xl text-primary">TRADEPO</span>
          <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
            | Smart Profit System
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`font-medium ${
                location === item.href
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              } transition`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />

          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link href="/dashboard">{t("common.dashboard")}</Link>
              </Button>
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:flex"
                >
                  <Link href="/admin">{t("common.admin")}</Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="hidden sm:flex"
              >
                {t("common.logout")}
              </Button>
            </div>
          ) : (
            <Button asChild className="hidden sm:flex">
              <Link href="/login">{t("common.login")}</Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-2 py-2 text-base font-medium hover:text-primary transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-2 py-2 text-base font-medium hover:text-primary transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("common.dashboard")}
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="px-2 py-2 text-base font-medium hover:text-primary transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("common.admin")}
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start px-2 font-medium"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      {t("common.logout")}
                    </Button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-2 py-2 text-base font-medium text-primary hover:text-primary-dark transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("common.login")}
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
