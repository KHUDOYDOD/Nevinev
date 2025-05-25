
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
