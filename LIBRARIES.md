
# Библиотеки проекта TRADEPO

## Frontend

### UI компоненты
- React (`react`, `react-dom`) - библиотека для создания пользовательских интерфейсов
- Radix UI - набор доступных, ненавязчивых компонентов для React
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-alert-dialog`
  - `@radix-ui/react-aspect-ratio`
  - `@radix-ui/react-avatar`
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-collapsible`
  - `@radix-ui/react-context-menu`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-hover-card`
  - `@radix-ui/react-label`
  - `@radix-ui/react-menubar`
  - `@radix-ui/react-navigation-menu`
  - `@radix-ui/react-popover`
  - `@radix-ui/react-progress`
  - `@radix-ui/react-radio-group`
  - `@radix-ui/react-scroll-area`
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slider`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-switch`
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-toast`
  - `@radix-ui/react-toggle`
  - `@radix-ui/react-toggle-group`
  - `@radix-ui/react-tooltip`
- Lucide React (`lucide-react`) - набор иконок
- React Icons (`react-icons`) - библиотека иконок
- Framer Motion (`framer-motion`) - библиотека для анимаций
- Class Variance Authority (`class-variance-authority`) - утилита для условных классов
- Tailwind CSS - CSS фреймворк для стилизации
  - `tailwind-merge` - утилита для объединения Tailwind классов
  - `tailwindcss-animate` - анимации для Tailwind
  - `tw-animate-css` - интеграция animate.css с Tailwind

### Маршрутизация и навигация
- Wouter (`wouter`) - минималистичный роутер для React

### Управление формами
- React Hook Form (`react-hook-form`) - библиотека для управления формами
- Zod (`zod`) - библиотека для валидации данных
  - `@hookform/resolvers` - интеграция Zod с React Hook Form
  - `zod-validation-error` - обработка ошибок валидации Zod

### Локализация
- i18next (`i18next`) - библиотека для интернационализации
  - `i18next-browser-languagedetector` - автоопределение языка пользователя
  - `react-i18next` - интеграция i18next с React

### Управление состоянием и запросами
- TanStack Query (`@tanstack/react-query`) - библиотека для управления запросами и кешированием

### Компоненты дат
- date-fns (`date-fns`) - библиотека для работы с датами
- React Day Picker (`react-day-picker`) - календарь и выбор даты

### Графики и визуализация
- Recharts (`recharts`) - библиотека для создания графиков
- Embla Carousel (`embla-carousel-react`) - карусель для React

### Прочие UI библиотеки
- cmdk (`cmdk`) - библиотека для создания командных палитр
- Vaul (`vaul`) - библиотека для создания выдвижных панелей
- Next Themes (`next-themes`) - управление темами
- input-otp (`input-otp`) - компонент для ввода одноразовых паролей
- React Resizable Panels (`react-resizable-panels`) - панели с изменяемым размером

## Backend

### Серверные технологии
- Express (`express`) - веб-фреймворк для Node.js
- WebSocket (`ws`) - реализация WebSocket для Node.js

### Аутентификация и безопасность
- JSON Web Token (`jsonwebtoken`) - библиотека для работы с JWT
- Passport (`passport`, `passport-local`) - аутентификация для Express
- bcryptjs (`bcryptjs`) - хеширование паролей

### Базы данных
- Drizzle ORM (`drizzle-orm`) - ORM для работы с базами данных
  - `drizzle-zod` - интеграция Drizzle с Zod
  - `drizzle-kit` - инструменты для работы с Drizzle
- Neon PostgreSQL (`@neondatabase/serverless`) - serverless Postgres

### Сессии
- Express Session (`express-session`) - управление сессиями
- Connect PG Simple (`connect-pg-simple`) - хранение сессий в PostgreSQL
- Memorystore (`memorystore`) - хранение сессий в памяти

## Инструменты разработки

### Сборка и запуск
- TypeScript (`typescript`) - типизированный JavaScript
- ESBuild (`esbuild`) - быстрый бандлер
- Vite (`vite`) - инструмент сборки и разработки
  - `@vitejs/plugin-react` - плагин Vite для React
  - `@replit/vite-plugin-cartographer` - плагин для Replit
  - `@replit/vite-plugin-runtime-error-modal` - модальное окно с ошибками для Replit
- TSX (`tsx`) - инструмент для запуска TypeScript файлов

### CSS и стили
- PostCSS (`postcss`) - инструмент для трансформации CSS
- Autoprefixer (`autoprefixer`) - автоматическое добавление вендорных префиксов
- Tailwind CSS
  - `@tailwindcss/typography` - типографика для Tailwind
  - `@tailwindcss/vite` - интеграция Tailwind с Vite

### Типы
- `@types/react`
- `@types/react-dom`
- `@types/node`
- `@types/express`
- `@types/express-session`
- `@types/passport`
- `@types/passport-local`
- `@types/connect-pg-simple`
- `@types/jsonwebtoken`
- `@types/ws`
# Используемые библиотеки и зависимости

## Frontend (React/TypeScript)

### Основные зависимости
- **react** (^18.2.0) - Библиотека для создания пользовательских интерфейсов
- **react-dom** (^18.2.0) - DOM-специфичные методы для React
- **react-router-dom** (^6.8.1) - Маршрутизация для React приложений
- **typescript** (^4.9.5) - Статическая типизация для JavaScript

### UI и стили
- **@tailwindcss/forms** (^0.5.3) - Стили форм для Tailwind CSS
- **tailwindcss** (^3.2.7) - CSS фреймворк
- **@radix-ui/react-*** - Набор доступных UI компонентов
  - react-accordion (^1.1.2)
  - react-alert-dialog (^1.0.5)
  - react-avatar (^1.0.4)
  - react-checkbox (^1.0.4)
  - react-dialog (^1.0.5)
  - react-dropdown-menu (^2.0.6)
  - react-hover-card (^1.0.7)
  - react-label (^2.0.2)
  - react-menubar (^1.0.4)
  - react-navigation-menu (^1.1.4)
  - react-popover (^1.0.7)
  - react-progress (^1.0.3)
  - react-radio-group (^1.1.3)
  - react-scroll-area (^1.0.5)
  - react-select (^2.0.0)
  - react-separator (^1.0.3)
  - react-slider (^1.1.2)
  - react-switch (^1.0.3)
  - react-tabs (^1.0.4)
  - react-toast (^1.1.5)
  - react-toggle (^1.0.3)
  - react-toggle-group (^1.0.4)
  - react-tooltip (^1.0.7)

### Интернационализация
- **react-i18next** (^12.2.0) - Интернационализация для React
- **i18next** (^22.4.13) - Фреймворк для интернационализации

### Иконки и изображения
- **lucide-react** (^0.321.0) - Набор иконок для React
- **@heroicons/react** (^2.0.16) - Иконки от команды Heroicons

### Формы и валидация
- **react-hook-form** (^7.43.5) - Библиотека для работы с формами
- **@hookform/resolvers** (^2.9.11) - Резолверы для валидации форм
- **zod** (^3.20.6) - Схема валидации TypeScript-first

### Состояние и запросы
- **@tanstack/react-query** (^4.28.0) - Управление серверным состоянием
- **zustand** (^4.3.6) - Управление состоянием приложения

### Анимации
- **framer-motion** (^10.0.1) - Библиотека анимаций для React

### Утилиты
- **clsx** (^1.2.1) - Утилита для условных CSS классов
- **class-variance-authority** (^0.4.0) - Создание вариантов CSS классов
- **tailwind-merge** (^1.10.0) - Слияние Tailwind CSS классов
- **date-fns** (^2.29.3) - Современная JavaScript библиотека для работы с датами

## Backend (Node.js/Express)

### Основные зависимости
- **express** (^4.18.2) - Веб-фреймворк для Node.js
- **cors** (^2.8.5) - Middleware для настройки CORS
- **helmet** (^6.0.1) - Защита Express приложений
- **morgan** (^1.10.0) - HTTP логгер middleware

### База данных
- **drizzle-orm** (^0.29.0) - TypeScript ORM для SQL баз данных
- **better-sqlite3** (^8.11.0) - Быстрый SQLite3 драйвер для Node.js

### Валидация и безопасность
- **zod** (^3.20.6) - Схема валидации TypeScript-first
- **bcryptjs** (^2.4.3) - Хеширование паролей
- **jsonwebtoken** (^9.0.0) - JSON Web Token реализация

### Утилиты
- **dotenv** (^16.0.3) - Загрузка переменных окружения из .env файла
- **uuid** (^9.0.0) - Генерация UUID

## Инструменты разработки

### Сборка и разработка
- **vite** (^4.1.4) - Быстрый инструмент сборки
- **@vitejs/plugin-react** (^3.1.0) - Vite плагин для React
- **tsx** (^3.12.3) - TypeScript исполнитель для Node.js

### TypeScript
- **@types/node** (^18.14.6) - TypeScript типы для Node.js
- **@types/react** (^18.0.28) - TypeScript типы для React
- **@types/react-dom** (^18.0.11) - TypeScript типы для React DOM
- **@types/express** (^4.17.17) - TypeScript типы для Express
- **@types/cors** (^2.8.13) - TypeScript типы для CORS
- **@types/bcryptjs** (^2.4.2) - TypeScript типы для bcryptjs
- **@types/jsonwebtoken** (^9.0.1) - TypeScript типы для jsonwebtoken
- **@types/uuid** (^9.0.1) - TypeScript типы для uuid

### Линтинг и форматирование
- **eslint** (^8.35.0) - Линтер для JavaScript/TypeScript
- **@typescript-eslint/eslint-plugin** (^5.54.0) - ESLint плагин для TypeScript
- **@typescript-eslint/parser** (^5.54.0) - ESLint парсер для TypeScript
- **eslint-plugin-react-hooks** (^4.6.0) - ESLint правила для React Hooks
- **eslint-plugin-react-refresh** (^0.3.4) - ESLint плагин для React Refresh

### CSS и PostCSS
- **postcss** (^8.4.21) - Инструмент для трансформации CSS
- **autoprefixer** (^10.4.13) - PostCSS плагин для автопрефиксов

## Скрипты package.json

- **dev** - Запуск в режиме разработки
- **build** - Сборка для продакшена
- **start** - Запуск продакшен сервера
- **preview** - Предварительный просмотр сборки
- **lint** - Проверка кода линтером

Все библиотеки выбраны для обеспечения современной, безопасной и высокопроизводительной разработки веб-приложения с поддержкой интернационализации и адаптивного дизайна.
