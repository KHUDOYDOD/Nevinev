import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Default translation resources - these would be loaded from backend in production
const resources = {
  ru: {
    translation: {
      // Navigation
      "nav.home": "Главная",
      "nav.tariffs": "Тарифы",
      "nav.howItWorks": "Как это работает",
      "nav.reviews": "Отзывы",
      "nav.contacts": "Контакты",
      "nav.login": "Вход",
      "nav.dashboard": "Личный кабинет",
      
      // Hero Section
      "hero.title": "Инвестируй умно. Получай прибыль за 24 часа.",
      "hero.subtitle": "До 15% дохода в сутки",
      "hero.button": "Начать инвестировать",
      "hero.learnMore": "Узнать больше",
      
      // Calculator
      "calculator.title": "Рассчитайте вашу прибыль",
      "calculator.description": "Используйте наш калькулятор, чтобы узнать потенциальный доход от ваших инвестиций на платформе TRADEPO.",
      "calculator.investmentAmount": "Сумма инвестиции ($)",
      "calculator.tariff": "Выберите тариф",
      "calculator.tariffBasic": "Базовый",
      "calculator.tariffPremium": "Премиум",
      "calculator.tariffElite": "Элит",
      "calculator.term": "Срок инвестиции (дни)",
      "calculator.yourProfit": "Ваша прибыль за период",
      "calculator.rate": "Ставка",
      "calculator.perDay": "в день",
      "calculator.dailyProfit": "Ежедневная прибыль",
      "calculator.totalProfit": "Общая прибыль",
      "calculator.totalAmount": "Итоговая сумма",
      "calculator.investNow": "Инвестировать сейчас",
      
      // How It Works
      "howItWorks.title": "Как это работает",
      "howItWorks.description": "Простой процесс из 4 шагов для начала инвестирования и получения прибыли",
      "howItWorks.step1.title": "Регистрация",
      "howItWorks.step1.description": "Создайте учетную запись, заполнив простую форму регистрации",
      "howItWorks.step2.title": "Пополнение",
      "howItWorks.step2.description": "Пополните баланс счета любым удобным способом",
      "howItWorks.step3.title": "Инвестирование",
      "howItWorks.step3.description": "Выберите тариф и создайте свой первый депозит",
      "howItWorks.step4.title": "Получение прибыли",
      "howItWorks.step4.description": "Получайте прибыль каждые 24 часа и выводите в любое время",
      
      // Tariffs
      "tariffs.title": "Выберите свой тариф",
      "tariffs.description": "Мы предлагаем три инвестиционных тарифа с разной доходностью. Выберите подходящий для вас.",
      "tariffs.basic.title": "Базовый",
      "tariffs.basic.minDeposit": "Минимальный депозит: $100",
      "tariffs.basic.profit": "Прибыль: 5% каждые 24 часа",
      "tariffs.premium.title": "Премиум",
      "tariffs.premium.popular": "Популярный выбор",
      "tariffs.premium.minDeposit": "Минимальный депозит: $500",
      "tariffs.premium.profit": "Прибыль: 10% каждые 24 часа",
      "tariffs.elite.title": "Элит",
      "tariffs.elite.minDeposit": "Минимальный депозит: $1000",
      "tariffs.elite.profit": "Прибыль: 15% каждые 24 часа",
      "tariffs.features.dailyPayments": "Ежедневные выплаты",
      "tariffs.features.withdrawAnytime": "Вывод в любое время",
      "tariffs.features.referralProgram": "Реферальная программа",
      "tariffs.features.support": "Техническая поддержка",
      "tariffs.features.prioritySupport": "Приоритетная поддержка",
      "tariffs.features.vipSupport": "VIP поддержка 24/7",
      "tariffs.chooseTariff": "Выбрать тариф",
      
      // Stats
      "stats.title": "Наши достижения",
      "stats.description": "Статистика проекта в реальном времени",
      "stats.users": "Пользователей",
      "stats.invested": "Инвестировано",
      "stats.paid": "Выплачено",
      "stats.newUsers": "10 новых пользователей",
      "stats.newDeposits": "10 новых депозитов",
      "stats.newWithdrawals": "10 новых выводов",
      "stats.progress": "Прогресс",
      
      // Benefits
      "benefits.title": "Преимущества платформы",
      "benefits.description": "Почему тысячи инвесторов выбирают TRADEPO",
      "benefits.security.title": "Безопасность",
      "benefits.security.description": "Ваши инвестиции защищены современными технологиями шифрования и многоуровневой защитой",
      "benefits.speed.title": "Скорость",
      "benefits.speed.description": "Мгновенное зачисление депозитов и быстрые выплаты прибыли каждые 24 часа",
      "benefits.highProfit.title": "Высокая доходность",
      "benefits.highProfit.description": "Получайте до 15% прибыли каждые 24 часа. Ваши деньги работают максимально эффективно",
      "benefits.support.title": "Поддержка 24/7",
      "benefits.support.description": "Наша команда поддержки всегда готова помочь вам с любыми вопросами в любое время",
      
      // Testimonials
      "testimonials.title": "Отзывы наших инвесторов",
      "testimonials.description": "Что говорят о нас те, кто уже инвестирует с TRADEPO",
      
      // Contact
      "contact.title": "Свяжитесь с нами",
      "contact.description": "Возникли вопросы? Наша команда поддержки всегда готова помочь",
      "contact.form.title": "Напишите нам",
      "contact.form.name": "Ваше имя",
      "contact.form.email": "Email",
      "contact.form.message": "Сообщение",
      "contact.form.send": "Отправить",
      "contact.info.title": "Контактная информация",
      "contact.info.email": "Email",
      "contact.info.telegram": "Telegram",
      "contact.info.workHours": "Часы работы",
      "contact.info.workHours.value": "24/7 без выходных",
      "contact.follow.title": "Подписывайтесь на нас",
      
      // Footer
      "footer.description": "Инвестиционная платформа с высокой доходностью и ежедневными выплатами.",
      "footer.quickLinks": "Быстрые ссылки",
      "footer.legal": "Юридическая информация",
      "footer.legal.terms": "Условия использования",
      "footer.legal.privacy": "Политика конфиденциальности",
      "footer.legal.investment": "Правила инвестирования",
      "footer.legal.faq": "FAQ",
      "footer.contact": "Контакты",
      "footer.copyright": "© 2023 TRADEPO.RU. Все права защищены.",
      
      // Auth
      "auth.login": "Вход в систему",
      "auth.loginDescription": "Войдите в свой аккаунт для доступа к личному кабинету",
      "auth.register": "Регистрация",
      "auth.registerDescription": "Создайте новый аккаунт на платформе TRADEPO",
      "auth.username": "Имя пользователя",
      "auth.email": "Email",
      "auth.password": "Пароль",
      "auth.confirmPassword": "Подтвердите пароль",
      "auth.fullName": "Полное имя",
      "auth.rememberMe": "Запомнить меня",
      "auth.forgotPassword": "Забыли пароль?",
      "auth.noAccount": "Еще нет аккаунта?",
      "auth.hasAccount": "Уже есть аккаунт?",
      "auth.referralCode": "Реферальный код (если есть)",
      
      // Dashboard
      "dashboard.overview": "Обзор",
      "dashboard.deposits": "Депозиты",
      "dashboard.transactions": "Транзакции",
      "dashboard.calculator": "Калькулятор",
      "dashboard.referral": "Рефералы",
      "dashboard.settings": "Настройки",
      "dashboard.security": "Безопасность",
      "dashboard.adminPanel": "Админ панель",
      "dashboard.balance": "Баланс",
      "dashboard.deposit": "Пополнить",
      "dashboard.withdraw": "Вывести",
      "dashboard.activeDeposits": "Активные депозиты",
      "dashboard.totalProfit": "Общая прибыль",
      "dashboard.depositTitle": "Создание нового депозита",
      "dashboard.withdrawTitle": "Вывод средств",
      "dashboard.history": "История операций",
      "dashboard.viewAll": "Посмотреть все",
      
      // Admin
      "admin.dashboard": "Панель управления",
      "admin.users": "Пользователи",
      "admin.deposits": "Депозиты",
      "admin.transactions": "Транзакции",
      "admin.withdrawals": "Выводы",
      "admin.tariffs": "Тарифы",
      "admin.statistics": "Статистика",
      "admin.content": "Контент",
      "admin.settings": "Настройки",
      "admin.userMode": "Режим пользователя",
      "admin.approve": "Одобрить",
      "admin.reject": "Отклонить",
      "admin.save": "Сохранить изменения",
      "admin.newUsers": "Новые пользователи",
      "admin.allUsers": "Все пользователи",
      "admin.pendingWithdrawals": "Заявки на вывод",
      "admin.allWithdrawals": "Все заявки",
      "admin.tariffSettings": "Настройки тарифов",
      "admin.active": "Активен",
      
      // Common
      "common.loading": "Загрузка...",
      "common.error": "Ошибка",
      "common.success": "Успешно",
      "common.cancel": "Отмена",
      "common.confirm": "Подтвердить",
      "common.save": "Сохранить",
      "common.day": "день",
      "common.days": "дней",
      "common.status": "Статус",
      "common.amount": "Сумма",
      "common.date": "Дата",
      "common.type": "Тип",
      "common.actions": "Действия",
      "common.active": "Активен",
      "common.pending": "Ожидание",
      "common.completed": "Выполнено",
      "common.rejected": "Отклонено",
      "common.language": "Язык",
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.tariffs": "Tariffs",
      "nav.howItWorks": "How it works",
      "nav.reviews": "Reviews",
      "nav.contacts": "Contacts",
      "nav.login": "Login",
      "nav.dashboard": "Dashboard",
      
      // Hero Section
      "hero.title": "Invest Smart. Get Profit in 24 Hours.",
      "hero.subtitle": "Up to 15% income per day",
      "hero.button": "Start Investing",
      "hero.learnMore": "Learn More",
      
      // Calculator
      "calculator.title": "Calculate Your Profit",
      "calculator.description": "Use our calculator to find out the potential return on your investments on the TRADEPO platform.",
      "calculator.investmentAmount": "Investment amount ($)",
      "calculator.tariff": "Choose a tariff",
      "calculator.tariffBasic": "Basic",
      "calculator.tariffPremium": "Premium",
      "calculator.tariffElite": "Elite",
      "calculator.term": "Investment term (days)",
      "calculator.yourProfit": "Your profit for the period",
      "calculator.rate": "Rate",
      "calculator.perDay": "per day",
      "calculator.dailyProfit": "Daily profit",
      "calculator.totalProfit": "Total profit",
      "calculator.totalAmount": "Final amount",
      "calculator.investNow": "Invest Now",
      
      // How It Works
      "howItWorks.title": "How It Works",
      "howItWorks.description": "A simple 4-step process to start investing and earning profit",
      "howItWorks.step1.title": "Registration",
      "howItWorks.step1.description": "Create an account by filling out a simple registration form",
      "howItWorks.step2.title": "Deposit",
      "howItWorks.step2.description": "Fund your account balance using any convenient method",
      "howItWorks.step3.title": "Investing",
      "howItWorks.step3.description": "Choose a tariff and create your first deposit",
      "howItWorks.step4.title": "Getting Profit",
      "howItWorks.step4.description": "Receive profit every 24 hours and withdraw at any time",
      
      // Tariffs
      "tariffs.title": "Choose Your Tariff",
      "tariffs.description": "We offer three investment tariffs with different returns. Choose the one that suits you.",
      "tariffs.basic.title": "Basic",
      "tariffs.basic.minDeposit": "Minimum deposit: $100",
      "tariffs.basic.profit": "Profit: 5% every 24 hours",
      "tariffs.premium.title": "Premium",
      "tariffs.premium.popular": "Popular choice",
      "tariffs.premium.minDeposit": "Minimum deposit: $500",
      "tariffs.premium.profit": "Profit: 10% every 24 hours",
      "tariffs.elite.title": "Elite",
      "tariffs.elite.minDeposit": "Minimum deposit: $1000",
      "tariffs.elite.profit": "Profit: 15% every 24 hours",
      "tariffs.features.dailyPayments": "Daily payments",
      "tariffs.features.withdrawAnytime": "Withdraw anytime",
      "tariffs.features.referralProgram": "Referral program",
      "tariffs.features.support": "Technical support",
      "tariffs.features.prioritySupport": "Priority support",
      "tariffs.features.vipSupport": "VIP support 24/7",
      "tariffs.chooseTariff": "Choose tariff",
      
      // Stats
      "stats.title": "Our Achievements",
      "stats.description": "Real-time project statistics",
      "stats.users": "Users",
      "stats.invested": "Invested",
      "stats.paid": "Paid out",
      "stats.newUsers": "10 new users",
      "stats.newDeposits": "10 new deposits",
      "stats.newWithdrawals": "10 new withdrawals",
      "stats.progress": "Progress",
      
      // Benefits
      "benefits.title": "Platform Benefits",
      "benefits.description": "Why thousands of investors choose TRADEPO",
      "benefits.security.title": "Security",
      "benefits.security.description": "Your investments are protected by modern encryption technologies and multi-level security",
      "benefits.speed.title": "Speed",
      "benefits.speed.description": "Instant deposit crediting and quick profit payments every 24 hours",
      "benefits.highProfit.title": "High profitability",
      "benefits.highProfit.description": "Receive up to 15% profit every 24 hours. Your money works as efficiently as possible",
      "benefits.support.title": "24/7 Support",
      "benefits.support.description": "Our support team is always ready to help you with any questions at any time",
      
      // Testimonials
      "testimonials.title": "Testimonials from our investors",
      "testimonials.description": "What people who are already investing with TRADEPO say about us",
      
      // Contact
      "contact.title": "Contact Us",
      "contact.description": "Have questions? Our support team is always ready to help",
      "contact.form.title": "Write to us",
      "contact.form.name": "Your name",
      "contact.form.email": "Email",
      "contact.form.message": "Message",
      "contact.form.send": "Send",
      "contact.info.title": "Contact Information",
      "contact.info.email": "Email",
      "contact.info.telegram": "Telegram",
      "contact.info.workHours": "Working hours",
      "contact.info.workHours.value": "24/7 without days off",
      "contact.follow.title": "Follow us",
      
      // Footer
      "footer.description": "Investment platform with high returns and daily payments.",
      "footer.quickLinks": "Quick links",
      "footer.legal": "Legal information",
      "footer.legal.terms": "Terms of use",
      "footer.legal.privacy": "Privacy policy",
      "footer.legal.investment": "Investment rules",
      "footer.legal.faq": "FAQ",
      "footer.contact": "Contacts",
      "footer.copyright": "© 2023 TRADEPO.RU. All rights reserved.",
      
      // Auth
      "auth.login": "Log in",
      "auth.loginDescription": "Log in to your account to access your dashboard",
      "auth.register": "Register",
      "auth.registerDescription": "Create a new account on the TRADEPO platform",
      "auth.username": "Username",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm password",
      "auth.fullName": "Full name",
      "auth.rememberMe": "Remember me",
      "auth.forgotPassword": "Forgot password?",
      "auth.noAccount": "Don't have an account?",
      "auth.hasAccount": "Already have an account?",
      "auth.referralCode": "Referral code (if any)",
      
      // Dashboard
      "dashboard.overview": "Overview",
      "dashboard.deposits": "Deposits",
      "dashboard.transactions": "Transactions",
      "dashboard.calculator": "Calculator",
      "dashboard.referral": "Referrals",
      "dashboard.settings": "Settings",
      "dashboard.security": "Security",
      "dashboard.adminPanel": "Admin Panel",
      "dashboard.balance": "Balance",
      "dashboard.deposit": "Deposit",
      "dashboard.withdraw": "Withdraw",
      "dashboard.activeDeposits": "Active deposits",
      "dashboard.totalProfit": "Total profit",
      "dashboard.depositTitle": "Create new deposit",
      "dashboard.withdrawTitle": "Withdraw funds",
      "dashboard.history": "Transaction history",
      "dashboard.viewAll": "View all",
      
      // Admin
      "admin.dashboard": "Dashboard",
      "admin.users": "Users",
      "admin.deposits": "Deposits",
      "admin.transactions": "Transactions",
      "admin.withdrawals": "Withdrawals",
      "admin.tariffs": "Tariffs",
      "admin.statistics": "Statistics",
      "admin.content": "Content",
      "admin.settings": "Settings",
      "admin.userMode": "User mode",
      "admin.approve": "Approve",
      "admin.reject": "Reject",
      "admin.save": "Save changes",
      "admin.newUsers": "New users",
      "admin.allUsers": "All users",
      "admin.pendingWithdrawals": "Pending withdrawals",
      "admin.allWithdrawals": "All withdrawals",
      "admin.tariffSettings": "Tariff settings",
      "admin.active": "Active",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      "common.save": "Save",
      "common.day": "day",
      "common.days": "days",
      "common.status": "Status",
      "common.amount": "Amount",
      "common.date": "Date",
      "common.type": "Type",
      "common.actions": "Actions",
      "common.active": "Active",
      "common.pending": "Pending",
      "common.completed": "Completed",
      "common.rejected": "Rejected",
      "common.language": "Language",
    }
  },
  tj: {
    translation: {
      // Navigation
      "nav.home": "Асосӣ",
      "nav.tariffs": "Тарифҳо",
      "nav.howItWorks": "Чӣ тавр кор мекунад",
      "nav.reviews": "Тақризҳо",
      "nav.contacts": "Тамос",
      "nav.login": "Воридшавӣ",
      "nav.dashboard": "Кабинети шахсӣ",
      // Basic translations only for demonstration
    }
  },
  kz: {
    translation: {
      // Navigation
      "nav.home": "Басты бет",
      "nav.tariffs": "Тарифтер",
      "nav.howItWorks": "Қалай жұмыс істейді",
      "nav.reviews": "Пікірлер",
      "nav.contacts": "Байланыс",
      "nav.login": "Кіру",
      "nav.dashboard": "Жеке кабинет",
      // Basic translations only for demonstration
    }
  },
  uz: {
    translation: {
      // Navigation
      "nav.home": "Asosiy",
      "nav.tariffs": "Tariflar",
      "nav.howItWorks": "Qanday ishlaydi",
      "nav.reviews": "Sharxlar",
      "nav.contacts": "Aloqa",
      "nav.login": "Kirish",
      "nav.dashboard": "Shaxsiy kabinet",
      // Basic translations only for demonstration
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
