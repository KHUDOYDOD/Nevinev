const translation = {
  common: {
    login: 'Вход',
    register: 'Регистрация',
    logout: 'Выйти',
    dashboard: 'Личный кабинет',
    admin: 'Админ панель',
    save: 'Сохранить',
    cancel: 'Отмена',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    confirm: 'Подтвердить',
    back: 'Назад',
    next: 'Далее',
    language: 'Язык',
    close: 'Закрыть'
  },
  
  navigation: {
    home: 'Главная',
    tariffs: 'Тарифы',
    howItWorks: 'Как это работает',
    reviews: 'Отзывы',
    contacts: 'Контакты'
  },
  
  home: {
    hero: {
      title: 'Инвестируй умно. Получай прибыль за 24 часа.',
      subtitle: 'До 15% дохода в сутки',
      cta: 'Начать инвестировать',
      learnMore: 'Узнать больше'
    },
    
    stats: {
      users: 'Пользователей',
      invested: 'Инвестировано',
      paid: 'Выплачено',
      newUsers: 'Новые пользователи',
      newDeposits: 'Новые депозиты',
      newWithdrawals: 'Последние выводы',
      progress: 'Прогресс'
    },
    
    calculator: {
      title: 'Рассчитайте вашу прибыль',
      subtitle: 'Используйте наш калькулятор, чтобы узнать потенциальный доход от ваших инвестиций',
      amount: 'Сумма инвестиций ($)',
      tariff: 'Тариф',
      days: 'Срок инвестиции (дней)',
      results: 'Результаты расчета',
      dailyProfit: 'Ежедневная прибыль',
      totalProfit: 'Общая прибыль',
      finalAmount: 'Итоговая сумма',
      invest: 'Инвестировать сейчас'
    },
    
    howItWorks: {
      title: 'Как это работает',
      subtitle: 'Простой процесс инвестирования и получения прибыли',
      step1: {
        title: 'Создайте аккаунт',
        description: 'Быстрая регистрация с минимальным количеством данных для создания вашего личного кабинета.'
      },
      step2: {
        title: 'Пополните баланс',
        description: 'Внесите средства удобным для вас способом и активируйте свой инвестиционный счет.'
      },
      step3: {
        title: 'Выберите тариф',
        description: 'Определите подходящий инвестиционный план согласно вашим целям и возможностям.'
      },
      step4: {
        title: 'Получайте прибыль',
        description: 'Ежедневно наблюдайте за ростом вашего капитала и выводите средства в любой момент.'
      }
    },
    
    tariffs: {
      title: 'Выберите свой тариф',
      subtitle: 'Мы предлагаем различные инвестиционные планы для достижения ваших финансовых целей',
      basic: {
        name: 'Базовый',
        description: 'Идеально для начинающих инвесторов'
      },
      premium: {
        name: 'Премиум',
        description: 'Для активных инвесторов',
        popular: 'Популярный'
      },
      elite: {
        name: 'Элит',
        description: 'Для профессиональных инвесторов'
      },
      perDay: '/ 24ч',
      minDeposit: 'Минимальная инвестиция:',
      features: {
        dailyPayments: 'Ежедневные выплаты',
        withdrawAnytime: 'Вывод в любое время',
        referralProgram: 'Реферальная программа',
        support: 'Техническая поддержка',
        prioritySupport: 'Приоритетная поддержка',
        vipSupport: 'VIP поддержка 24/7',
        personalManager: 'Персональный инвест-менеджер'
      },
      select: 'Выбрать тариф'
    },
    
    advantages: {
      title: 'Преимущества платформы',
      subtitle: 'Почему тысячи инвесторов выбирают TRADEPO для своих инвестиций',
      security: {
        title: 'Безопасность',
        description: 'Современные технологии защиты данных и средств пользователей.'
      },
      highProfitability: {
        title: 'Высокая доходность',
        description: 'Стабильные выплаты до 15% ежедневно от суммы вашего депозита.'
      },
      instantPayments: {
        title: 'Мгновенные выплаты',
        description: 'Автоматический вывод средств на ваши электронные кошельки.'
      },
      support: {
        title: 'Поддержка 24/7',
        description: 'Профессиональная команда поддержки, готовая помочь в любое время.'
      }
    },
    
    testimonials: {
      title: 'Отзывы инвесторов',
      subtitle: 'Узнайте, что говорят о TRADEPO наши пользователи',
      investor: 'Инвестор с'
    },
    
    contact: {
      title: 'Остались вопросы?',
      subtitle: 'Наша команда поддержки всегда готова помочь вам и ответить на любые вопросы',
      telegram: {
        title: 'Telegram',
        description: 'Получите быстрый ответ от нашей службы поддержки в Telegram. Работаем круглосуточно.',
        button: 'Написать в Telegram'
      },
      email: {
        title: 'Email',
        description: 'Отправьте нам электронное письмо с вашим вопросом, и мы ответим в течение 24 часов.',
        button: 'Написать на Email'
      }
    }
  },
  
  auth: {
    login: {
      title: 'Вход в систему',
      subtitle: 'Войдите в свой аккаунт или создайте новый',
      username: 'Имя пользователя',
      email: 'Email',
      password: 'Пароль',
      rememberMe: 'Запомнить меня',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Еще нет аккаунта?',
      createAccount: 'Зарегистрироваться',
      loginButton: 'Войти'
    },
    
    register: {
      title: 'Создание аккаунта',
      subtitle: 'Зарегистрируйтесь, чтобы начать инвестировать',
      username: 'Имя пользователя',
      email: 'Email',
      fullName: 'Полное имя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      referralCode: 'Реферальный код (если есть)',
      terms: 'Я принимаю условия использования и политику конфиденциальности',
      hasAccount: 'Уже есть аккаунт?',
      loginHere: 'Войти здесь',
      registerButton: 'Зарегистрироваться'
    }
  },
  
  dashboard: {
    overview: {
      title: 'Обзор аккаунта',
      balance: 'Баланс',
      deposit: 'Пополнить',
      withdraw: 'Вывести',
      activeDeposits: 'Активные депозиты',
      totalProfit: 'Общая прибыль',
      days: 'дней'
    },
    
    deposits: {
      title: 'Активные депозиты',
      tariff: 'Тариф',
      amount: 'Сумма',
      created: 'Дата создания',
      dailyProfit: 'Ежедневный доход',
      status: 'Статус',
      active: 'Активен',
      completed: 'Завершен',
      noDeposits: 'У вас пока нет активных депозитов',
      createDeposit: 'Создать депозит'
    },
    
    transactions: {
      title: 'История операций',
      date: 'Дата',
      type: 'Тип',
      amount: 'Сумма',
      status: 'Статус',
      deposit: 'Пополнение',
      withdrawal: 'Вывод',
      profit: 'Прибыль',
      referral: 'Реферальный бонус',
      pending: 'Ожидание',
      completed: 'Выполнено',
      rejected: 'Отклонено',
      viewAll: 'Посмотреть все операции',
      noTransactions: 'У вас пока нет операций'
    },
    
    referrals: {
      title: 'Реферальная программа',
      description: 'Приглашайте друзей и получайте 0.1% от их инвестиций.',
      yourLink: 'Ваша реферальная ссылка:',
      copy: 'Копировать',
      copied: 'Скопировано!',
      referrals: 'Рефералов',
      active: 'Активных',
      earned: 'Заработано',
      detailedStats: 'Подробная статистика',
      noReferrals: 'У вас пока нет рефералов'
    },
    
    settings: {
      title: 'Настройки профиля',
      personalInfo: 'Личная информация',
      fullName: 'Полное имя',
      email: 'Email',
      language: 'Язык интерфейса',
      security: 'Безопасность',
      currentPassword: 'Текущий пароль',
      newPassword: 'Новый пароль',
      confirmPassword: 'Подтвердите новый пароль',
      save: 'Сохранить изменения'
    },
    
    withdraw: {
      title: 'Вывод средств',
      amount: 'Сумма вывода',
      availableBalance: 'Доступный баланс:',
      withdrawButton: 'Вывести средства',
      success: 'Заявка на вывод создана успешно',
      pending: 'Ваша заявка будет обработана администратором'
    },
    
    deposit: {
      title: 'Пополнение баланса',
      amount: 'Сумма пополнения',
      selectTariff: 'Выберите тариф',
      minAmount: 'Минимальная сумма:',
      dailyProfit: 'Ежедневная прибыль:',
      depositButton: 'Пополнить',
      success: 'Депозит успешно создан'
    }
  },
  
  admin: {
    dashboard: {
      title: 'Панель управления',
      users: 'Пользователи',
      invested: 'Инвестировано',
      paid: 'Выплачено',
      pendingWithdrawals: 'Ожидает вывода'
    },
    
    users: {
      title: 'Управление пользователями',
      id: 'ID',
      username: 'Имя пользователя',
      email: 'Email',
      fullName: 'Полное имя',
      balance: 'Баланс',
      role: 'Роль',
      joined: 'Дата регистрации',
      actions: 'Действия',
      edit: 'Редактировать',
      viewDeposits: 'Депозиты',
      viewTransactions: 'Транзакции',
      search: 'Поиск пользователя',
      editUser: 'Редактирование пользователя',
      save: 'Сохранить'
    },
    
    deposits: {
      title: 'Управление депозитами',
      id: 'ID',
      user: 'Пользователь',
      tariff: 'Тариф',
      amount: 'Сумма',
      dailyProfit: 'Ежедневная прибыль',
      created: 'Дата создания',
      status: 'Статус',
      actions: 'Действия',
      viewUser: 'Пользователь',
      search: 'Поиск депозита'
    },
    
    withdrawals: {
      title: 'Заявки на вывод',
      id: 'ID',
      user: 'Пользователь',
      amount: 'Сумма',
      created: 'Дата создания',
      actions: 'Действия',
      approve: 'Одобрить',
      reject: 'Отклонить',
      noWithdrawals: 'Нет заявок на вывод',
      confirmApprove: 'Вы уверены, что хотите одобрить этот вывод?',
      confirmReject: 'Вы уверены, что хотите отклонить этот вывод?'
    },
    
    tariffs: {
      title: 'Настройки тарифов',
      name: 'Название',
      minAmount: 'Мин. сумма ($)',
      dailyPercent: 'Доходность (%)',
      referralPercent: 'Реф. бонус (%)',
      active: 'Активен',
      actions: 'Действия',
      edit: 'Редактировать',
      addTariff: 'Добавить тариф',
      editTariff: 'Редактирование тарифа',
      save: 'Сохранить изменения'
    },
    
    content: {
      title: 'Управление контентом',
      key: 'Ключ',
      ru: 'Русский',
      en: 'Английский',
      tj: 'Таджикский',
      kz: 'Казахский',
      uz: 'Узбекский',
      lastUpdated: 'Последнее обновление',
      actions: 'Действия',
      edit: 'Редактировать',
      addContent: 'Добавить контент',
      editContent: 'Редактирование контента',
      save: 'Сохранить'
    },
    
    testimonials: {
      title: 'Управление отзывами',
      id: 'ID',
      user: 'Пользователь',
      rating: 'Оценка',
      text: 'Текст',
      created: 'Дата создания',
      published: 'Опубликован',
      actions: 'Действия',
      publish: 'Опубликовать',
      unpublish: 'Снять с публикации',
      delete: 'Удалить'
    }
  },
  
  footer: {
    description: 'Платформа для умных инвестиций с высокой ежедневной доходностью.',
    navigation: 'Навигация',
    legal: 'Правовая информация',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    rules: 'Правила инвестирования',
    contacts: 'Контакты',
    copyright: '© 2023 TRADEPO.RU. Все права защищены.'
  },
  
  errors: {
    required: 'Это поле обязательно для заполнения',
    minLength: 'Слишком короткое значение',
    maxLength: 'Слишком длинное значение',
    email: 'Введите корректный email',
    passwordMatch: 'Пароли не совпадают',
    invalidCredentials: 'Неверное имя пользователя или пароль',
    userExists: 'Пользователь с таким именем уже существует',
    emailExists: 'Пользователь с таким email уже существует',
    invalidReferralCode: 'Неверный реферальный код',
    insufficientBalance: 'Недостаточно средств на балансе',
    invalidAmount: 'Неверная сумма',
    minDepositAmount: 'Минимальная сумма для этого тарифа: ${{amount}}',
    serverError: 'Ошибка сервера, попробуйте позже'
  }
};

export default translation;
