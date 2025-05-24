const translation = {
  common: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    admin: 'Admin Panel',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    language: 'Language',
    close: 'Close'
  },
  
  navigation: {
    home: 'Home',
    tariffs: 'Tariffs',
    howItWorks: 'How It Works',
    reviews: 'Reviews',
    contacts: 'Contacts'
  },
  
  home: {
    hero: {
      title: 'Invest smartly. Get profit in 24 hours.',
      subtitle: 'Up to 15% income per day',
      cta: 'Start Investing',
      learnMore: 'Learn More'
    },
    
    stats: {
      users: 'Users',
      invested: 'Invested',
      paid: 'Paid Out',
      newUsers: 'New Users',
      newDeposits: 'New Deposits',
      newWithdrawals: 'Recent Withdrawals',
      progress: 'Progress'
    },
    
    calculator: {
      title: 'Calculate Your Profit',
      subtitle: 'Use our calculator to determine your potential income from investments',
      amount: 'Investment Amount ($)',
      tariff: 'Tariff',
      days: 'Investment Period (days)',
      results: 'Calculation Results',
      dailyProfit: 'Daily Profit',
      totalProfit: 'Total Profit',
      finalAmount: 'Final Amount',
      invest: 'Invest Now'
    },
    
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Simple process of investing and receiving profit',
      step1: {
        title: 'Create an Account',
        description: 'Quick registration with minimal data to create your personal account.'
      },
      step2: {
        title: 'Fund Your Account',
        description: 'Deposit funds using your preferred method and activate your investment account.'
      },
      step3: {
        title: 'Choose a Tariff',
        description: 'Select the appropriate investment plan according to your goals and capabilities.'
      },
      step4: {
        title: 'Receive Profit',
        description: 'Daily monitor the growth of your capital and withdraw funds at any time.'
      }
    },
    
    tariffs: {
      title: 'Choose Your Tariff',
      subtitle: 'We offer various investment plans to achieve your financial goals',
      basic: {
        name: 'Basic',
        description: 'Perfect for beginner investors'
      },
      premium: {
        name: 'Premium',
        description: 'For active investors',
        popular: 'Popular'
      },
      elite: {
        name: 'Elite',
        description: 'For professional investors'
      },
      perDay: '/ 24h',
      minDeposit: 'Minimum investment:',
      features: {
        dailyPayments: 'Daily payments',
        withdrawAnytime: 'Withdraw anytime',
        referralProgram: 'Referral program',
        support: 'Technical support',
        prioritySupport: 'Priority support',
        vipSupport: 'VIP support 24/7',
        personalManager: 'Personal investment manager'
      },
      select: 'Select Tariff'
    },
    
    advantages: {
      title: 'Platform Advantages',
      subtitle: 'Why thousands of investors choose TRADEPO for their investments',
      security: {
        title: 'Security',
        description: 'Modern technologies for protecting user data and funds.'
      },
      highProfitability: {
        title: 'High Profitability',
        description: 'Stable payments up to 15% daily from your deposit amount.'
      },
      instantPayments: {
        title: 'Instant Payments',
        description: 'Automatic withdrawal of funds to your electronic wallets.'
      },
      support: {
        title: '24/7 Support',
        description: 'Professional support team ready to help you at any time.'
      }
    },
    
    testimonials: {
      title: 'Investor Reviews',
      subtitle: 'Find out what TRADEPO users are saying',
      investor: 'Investor since'
    },
    
    contact: {
      title: 'Any Questions?',
      subtitle: 'Our support team is always ready to help you and answer any questions',
      telegram: {
        title: 'Telegram',
        description: 'Get a quick response from our support service in Telegram. We work 24/7.',
        button: 'Write in Telegram'
      },
      email: {
        title: 'Email',
        description: 'Send us an email with your question, and we will respond within 24 hours.',
        button: 'Write to Email'
      }
    }
  },
  
  auth: {
    login: {
      title: 'Login to System',
      subtitle: 'Log in to your account or create a new one',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      noAccount: 'Don\'t have an account?',
      createAccount: 'Register',
      loginButton: 'Login'
    },
    
    register: {
      title: 'Create Account',
      subtitle: 'Register to start investing',
      username: 'Username',
      email: 'Email',
      fullName: 'Full Name',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      referralCode: 'Referral Code (if any)',
      terms: 'I accept the terms of use and privacy policy',
      hasAccount: 'Already have an account?',
      loginHere: 'Login here',
      registerButton: 'Register'
    }
  },
  
  dashboard: {
    overview: {
      title: 'Account Overview',
      balance: 'Balance',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      activeDeposits: 'Active Deposits',
      totalProfit: 'Total Profit',
      days: 'days'
    },
    
    deposits: {
      title: 'Active Deposits',
      tariff: 'Tariff',
      amount: 'Amount',
      created: 'Created Date',
      dailyProfit: 'Daily Income',
      status: 'Status',
      active: 'Active',
      completed: 'Completed',
      noDeposits: 'You don\'t have any active deposits yet',
      createDeposit: 'Create Deposit'
    },
    
    transactions: {
      title: 'Transaction History',
      date: 'Date',
      type: 'Type',
      amount: 'Amount',
      status: 'Status',
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      profit: 'Profit',
      referral: 'Referral Bonus',
      pending: 'Pending',
      completed: 'Completed',
      rejected: 'Rejected',
      viewAll: 'View All Transactions',
      noTransactions: 'You don\'t have any transactions yet'
    },
    
    referrals: {
      title: 'Referral Program',
      description: 'Invite friends and get 0.1% of their investments.',
      yourLink: 'Your referral link:',
      copy: 'Copy',
      copied: 'Copied!',
      referrals: 'Referrals',
      active: 'Active',
      earned: 'Earned',
      detailedStats: 'Detailed Statistics',
      noReferrals: 'You don\'t have any referrals yet'
    },
    
    settings: {
      title: 'Profile Settings',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      email: 'Email',
      language: 'Interface Language',
      security: 'Security',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      save: 'Save Changes'
    },
    
    withdraw: {
      title: 'Withdraw Funds',
      amount: 'Withdrawal Amount',
      availableBalance: 'Available Balance:',
      withdrawButton: 'Withdraw Funds',
      success: 'Withdrawal request created successfully',
      pending: 'Your request will be processed by the administrator'
    },
    
    deposit: {
      title: 'Fund Your Account',
      amount: 'Deposit Amount',
      selectTariff: 'Select Tariff',
      minAmount: 'Minimum amount:',
      dailyProfit: 'Daily profit:',
      depositButton: 'Deposit',
      success: 'Deposit created successfully'
    }
  },
  
  admin: {
    dashboard: {
      title: 'Control Panel',
      users: 'Users',
      invested: 'Invested',
      paid: 'Paid',
      pendingWithdrawals: 'Awaiting Withdrawal'
    },
    
    users: {
      title: 'User Management',
      id: 'ID',
      username: 'Username',
      email: 'Email',
      fullName: 'Full Name',
      balance: 'Balance',
      role: 'Role',
      joined: 'Registration Date',
      actions: 'Actions',
      edit: 'Edit',
      viewDeposits: 'Deposits',
      viewTransactions: 'Transactions',
      search: 'Search User',
      editUser: 'Edit User',
      save: 'Save'
    },
    
    deposits: {
      title: 'Deposit Management',
      id: 'ID',
      user: 'User',
      tariff: 'Tariff',
      amount: 'Amount',
      dailyProfit: 'Daily Profit',
      created: 'Created Date',
      status: 'Status',
      actions: 'Actions',
      viewUser: 'User',
      search: 'Search Deposit'
    },
    
    withdrawals: {
      title: 'Withdrawal Requests',
      id: 'ID',
      user: 'User',
      amount: 'Amount',
      created: 'Created Date',
      actions: 'Actions',
      approve: 'Approve',
      reject: 'Reject',
      noWithdrawals: 'No withdrawal requests',
      confirmApprove: 'Are you sure you want to approve this withdrawal?',
      confirmReject: 'Are you sure you want to reject this withdrawal?'
    },
    
    tariffs: {
      title: 'Tariff Settings',
      name: 'Name',
      minAmount: 'Min. Amount ($)',
      dailyPercent: 'Yield (%)',
      referralPercent: 'Ref. Bonus (%)',
      active: 'Active',
      actions: 'Actions',
      edit: 'Edit',
      addTariff: 'Add Tariff',
      editTariff: 'Edit Tariff',
      save: 'Save Changes'
    },
    
    content: {
      title: 'Content Management',
      key: 'Key',
      ru: 'Russian',
      en: 'English',
      tj: 'Tajik',
      kz: 'Kazakh',
      uz: 'Uzbek',
      lastUpdated: 'Last Updated',
      actions: 'Actions',
      edit: 'Edit',
      addContent: 'Add Content',
      editContent: 'Edit Content',
      save: 'Save'
    },
    
    testimonials: {
      title: 'Review Management',
      id: 'ID',
      user: 'User',
      rating: 'Rating',
      text: 'Text',
      created: 'Created Date',
      published: 'Published',
      actions: 'Actions',
      publish: 'Publish',
      unpublish: 'Unpublish',
      delete: 'Delete'
    }
  },
  
  footer: {
    description: 'Platform for smart investments with high daily returns.',
    navigation: 'Navigation',
    legal: 'Legal Information',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    rules: 'Investment Rules',
    contacts: 'Contacts',
    copyright: '© 2023 TRADEPO.RU. All rights reserved.'
  },
  
  errors: {
    required: 'This field is required',
    minLength: 'Value is too short',
    maxLength: 'Value is too long',
    email: 'Enter a valid email',
    passwordMatch: 'Passwords do not match',
    invalidCredentials: 'Invalid username or password',
    userExists: 'User with this username already exists',
    emailExists: 'User with this email already exists',
    invalidReferralCode: 'Invalid referral code',
    insufficientBalance: 'Insufficient balance',
    invalidAmount: 'Invalid amount',
    minDepositAmount: 'Minimum deposit amount for this tariff is ${{amount}}',
    serverError: 'Server error, please try again later'
  }
};

export default translation;
