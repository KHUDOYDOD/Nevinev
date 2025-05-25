import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings, Shield } from "lucide-react";

export default function Navigation() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/#tariffs", label: t("nav.tariffs") },
    { href: "/#how-it-works", label: t("nav.howItWorks") },
    { href: "/#reviews", label: t("nav.reviews") },
    { href: "/#contacts", label: t("nav.contacts") },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-md z-50 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-2xl text-primary">{t("general.appName")}</span>
          <span className="text-sm text-gray-500 ml-2 hidden sm:inline dark:text-gray-400">
            | {t("general.appTagline")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={cn(
                "font-medium transition-colors hover:text-primary",
                location === link.href ? "text-primary" : "text-gray-600 dark:text-gray-300"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user.fullName ? user.fullName.substring(0, 1) : "U"}
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/dashboard">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {t("dashboard.settings")}
                  </DropdownMenuItem>
                </Link>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        {t("admin.dashboard")}
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-primary focus:outline-none dark:text-gray-300"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 dark:bg-gray-800">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "font-medium transition-colors py-2",
                  location === link.href
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary dark:text-gray-300"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={closeMobileMenu}>
                <Button className="w-full mt-2 font-medium text-white bg-primary hover:bg-primary/90 rounded-lg">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
