import { 
  User, InsertUser, 
  LanguagePreference, InsertLanguagePreference,
  Tariff, InsertTariff,
  Deposit, InsertDeposit,
  Transaction, InsertTransaction,
  Testimonial, InsertTestimonial,
  Statistic, InsertStatistic,
  SiteContent, InsertSiteContent,
  tariffEnum, depositStatusEnum, transactionTypeEnum, transactionStatusEnum
} from "@shared/schema";
import crypto from 'crypto';

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  updateUserBalance(userId: number, amount: number): Promise<User>;
  
  // Language preferences
  setLanguagePreference(pref: InsertLanguagePreference): Promise<LanguagePreference>;
  getLanguagePreference(userId: number): Promise<LanguagePreference | undefined>;
  
  // Tariffs
  createTariff(tariff: InsertTariff): Promise<Tariff>;
  getTariffs(): Promise<Tariff[]>;
  getTariffById(id: number): Promise<Tariff | undefined>;
  updateTariff(id: number, tariff: Partial<Tariff>): Promise<Tariff>;
  
  // Deposits
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  getDepositById(id: number): Promise<Deposit | undefined>;
  getDepositsByUserId(userId: number): Promise<Deposit[]>;
  getActiveDeposits(): Promise<Deposit[]>;
  updateDepositStatus(id: number, status: 'active' | 'completed' | 'cancelled'): Promise<Deposit>;
  
  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getPendingWithdrawals(): Promise<Transaction[]>;
  updateTransactionStatus(id: number, status: 'pending' | 'completed' | 'failed'): Promise<Transaction>;
  
  // Testimonials
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getTestimonials(approvedOnly?: boolean): Promise<Testimonial[]>;
  approveTestimonial(id: number): Promise<Testimonial>;
  
  // Statistics
  getStatistics(): Promise<Statistic>;
  updateStatistics(stats: Partial<Statistic>): Promise<Statistic>;
  incrementUsers(): Promise<Statistic>;
  incrementDeposits(amount: number): Promise<Statistic>;
  incrementWithdrawals(amount: number): Promise<Statistic>;
  
  // Site content
  setSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  getSiteContent(key: string): Promise<SiteContent | undefined>;
  getAllSiteContent(): Promise<SiteContent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private languagePrefs: Map<number, LanguagePreference>;
  private tariffs: Map<number, Tariff>;
  private deposits: Map<number, Deposit>;
  private transactions: Map<number, Transaction>;
  private testimonials: Map<number, Testimonial>;
  private statistics: Statistic;
  private siteContent: Map<string, SiteContent>;
  
  private userIdCounter: number;
  private languagePrefIdCounter: number;
  private tariffIdCounter: number;
  private depositIdCounter: number;
  private transactionIdCounter: number;
  private testimonialIdCounter: number;
  private siteContentIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.languagePrefs = new Map();
    this.tariffs = new Map();
    this.deposits = new Map();
    this.transactions = new Map();
    this.testimonials = new Map();
    this.siteContent = new Map();
    
    this.userIdCounter = 1;
    this.languagePrefIdCounter = 1;
    this.tariffIdCounter = 1;
    this.depositIdCounter = 1;
    this.transactionIdCounter = 1;
    this.testimonialIdCounter = 1;
    this.siteContentIdCounter = 1;
    
    // Initialize statistics
    this.statistics = {
      id: 1,
      totalUsers: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      updatedAt: new Date()
    };
    
    // Initialize default tariffs
    this.initializeTariffs();
    
    // Initialize admin user
    this.initializeAdmin();
    
    // Initialize default site content
    this.initializeSiteContent();
  }
  
  private initializeTariffs() {
    const tariffs: InsertTariff[] = [
      {
        type: 'basic',
        name: 'Базовый',
        interestRate: 5,
        minInvestment: 100,
        referralBonus: 0.1,
        isActive: true
      },
      {
        type: 'premium',
        name: 'Премиум',
        interestRate: 10,
        minInvestment: 500,
        referralBonus: 0.15,
        isActive: true
      },
      {
        type: 'elite',
        name: 'Элит',
        interestRate: 15,
        minInvestment: 1000,
        referralBonus: 0.2,
        isActive: true
      }
    ];
    
    tariffs.forEach(tariff => this.createTariff(tariff));
  }
  
  private initializeAdmin() {
    const adminUser: InsertUser = {
      username: 'Admin',
      email: 'admin@tradepo.ru',
      password: 'X12345x',
      role: 'admin',
      referralCode: this.generateReferralCode()
    };
    
    this.createUser(adminUser);
  }
  
  private initializeSiteContent() {
    const contentItems: InsertSiteContent[] = [
      {
        key: 'hero_title',
        valueRu: 'Инвестируй умно. Получай прибыль за 24 часа.',
        valueEn: 'Invest smart. Get profit in 24 hours.',
        valueTj: 'Сармоягузории оқилона. Дар 24 соат фоида гиред.',
        valueKz: 'Ақылды инвестиция. 24 сағат ішінде пайда табыңыз.',
        valueUz: 'Aqlli investitsiya. 24 soat ichida foyda oling.'
      },
      {
        key: 'hero_subtitle',
        valueRu: 'До 15% дохода в сутки',
        valueEn: 'Up to 15% income per day',
        valueTj: 'То 15% даромад дар як рӯз',
        valueKz: 'Күніне 15% дейін табыс',
        valueUz: 'Kuniga 15% gacha daromad'
      },
      {
        key: 'hero_button',
        valueRu: 'Начать инвестировать',
        valueEn: 'Start investing',
        valueTj: 'Сармоягузориро оғоз кунед',
        valueKz: 'Инвестициялауды бастау',
        valueUz: 'Investitsiyani boshlang'
      }
    ];
    
    contentItems.forEach(item => this.setSiteContent(item));
  }
  
  private generateReferralCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  // User operations
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const referralCode = userData.referralCode || this.generateReferralCode();
    
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      referralCode,
      balance: 0,
      createdAt: now
    };
    
    this.users.set(id, user);
    
    // Update statistics
    this.incrementUsers();
    
    return user;
  }
  
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.referralCode === referralCode);
  }
  
  async updateUserBalance(userId: number, amount: number): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser: User = {
      ...user,
      balance: user.balance + amount
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Language preferences
  async setLanguagePreference(pref: InsertLanguagePreference): Promise<LanguagePreference> {
    // First check if user already has a preference
    const existingPref = await this.getLanguagePreference(pref.userId);
    
    if (existingPref) {
      const updatedPref: LanguagePreference = {
        ...existingPref,
        language: pref.language
      };
      this.languagePrefs.set(existingPref.id, updatedPref);
      return updatedPref;
    }
    
    const id = this.languagePrefIdCounter++;
    const languagePref: LanguagePreference = {
      id,
      ...pref
    };
    
    this.languagePrefs.set(id, languagePref);
    return languagePref;
  }
  
  async getLanguagePreference(userId: number): Promise<LanguagePreference | undefined> {
    return Array.from(this.languagePrefs.values()).find(pref => pref.userId === userId);
  }
  
  // Tariffs
  async createTariff(tariffData: InsertTariff): Promise<Tariff> {
    const id = this.tariffIdCounter++;
    
    const tariff: Tariff = {
      ...tariffData,
      id
    };
    
    this.tariffs.set(id, tariff);
    return tariff;
  }
  
  async getTariffs(): Promise<Tariff[]> {
    return Array.from(this.tariffs.values());
  }
  
  async getTariffById(id: number): Promise<Tariff | undefined> {
    return this.tariffs.get(id);
  }
  
  async updateTariff(id: number, tariffData: Partial<Tariff>): Promise<Tariff> {
    const tariff = await this.getTariffById(id);
    if (!tariff) {
      throw new Error('Tariff not found');
    }
    
    const updatedTariff: Tariff = {
      ...tariff,
      ...tariffData
    };
    
    this.tariffs.set(id, updatedTariff);
    return updatedTariff;
  }
  
  // Deposits
  async createDeposit(depositData: InsertDeposit): Promise<Deposit> {
    const id = this.depositIdCounter++;
    const now = new Date();
    
    const deposit: Deposit = {
      ...depositData,
      id,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };
    
    this.deposits.set(id, deposit);
    
    // Update user balance
    await this.updateUserBalance(depositData.userId, -depositData.amount);
    
    // Create transaction record
    await this.createTransaction({
      userId: depositData.userId,
      type: 'deposit',
      amount: depositData.amount,
      status: 'completed',
      depositId: id,
      description: `Deposit created for tariff ID ${depositData.tariffId}`
    });
    
    // Update statistics
    await this.incrementDeposits(depositData.amount);
    
    return deposit;
  }
  
  async getDepositById(id: number): Promise<Deposit | undefined> {
    return this.deposits.get(id);
  }
  
  async getDepositsByUserId(userId: number): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(deposit => deposit.userId === userId);
  }
  
  async getActiveDeposits(): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(deposit => deposit.status === 'active');
  }
  
  async updateDepositStatus(id: number, status: 'active' | 'completed' | 'cancelled'): Promise<Deposit> {
    const deposit = await this.getDepositById(id);
    if (!deposit) {
      throw new Error('Deposit not found');
    }
    
    const updatedDeposit: Deposit = {
      ...deposit,
      status: status,
      updatedAt: new Date()
    };
    
    this.deposits.set(id, updatedDeposit);
    return updatedDeposit;
  }
  
  // Transactions
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    const transaction: Transaction = {
      ...transactionData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.transactions.set(id, transaction);
    
    // If it's a withdrawal and status is completed, update statistics
    if (transactionData.type === 'withdrawal' && transactionData.status === 'completed') {
      await this.incrementWithdrawals(transactionData.amount);
    }
    
    return transaction;
  }
  
  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getPendingWithdrawals(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => 
        transaction.type === 'withdrawal' && 
        transaction.status === 'pending'
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async updateTransactionStatus(id: number, status: 'pending' | 'completed' | 'failed'): Promise<Transaction> {
    const transaction = await this.getTransactionById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    const updatedTransaction: Transaction = {
      ...transaction,
      status: status,
      updatedAt: new Date()
    };
    
    this.transactions.set(id, updatedTransaction);
    
    // If this is a withdrawal being completed, update user balance and statistics
    if (transaction.type === 'withdrawal' && status === 'completed' && transaction.status !== 'completed') {
      await this.incrementWithdrawals(transaction.amount);
    }
    
    // If this is a withdrawal being rejected, refund the user
    if (transaction.type === 'withdrawal' && status === 'failed' && transaction.status !== 'failed') {
      await this.updateUserBalance(transaction.userId, transaction.amount);
    }
    
    return updatedTransaction;
  }
  
  // Testimonials
  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const now = new Date();
    
    const testimonial: Testimonial = {
      ...testimonialData,
      id,
      isApproved: false,
      createdAt: now
    };
    
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async getTestimonials(approvedOnly: boolean = true): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values());
    
    if (approvedOnly) {
      testimonials = testimonials.filter(testimonial => testimonial.isApproved);
    }
    
    return testimonials.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async approveTestimonial(id: number): Promise<Testimonial> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    
    const updatedTestimonial: Testimonial = {
      ...testimonial,
      isApproved: true
    };
    
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  // Statistics
  async getStatistics(): Promise<Statistic> {
    return this.statistics;
  }
  
  async updateStatistics(statsData: Partial<Statistic>): Promise<Statistic> {
    this.statistics = {
      ...this.statistics,
      ...statsData,
      updatedAt: new Date()
    };
    
    return this.statistics;
  }
  
  async incrementUsers(): Promise<Statistic> {
    return this.updateStatistics({
      totalUsers: this.statistics.totalUsers + 1
    });
  }
  
  async incrementDeposits(amount: number): Promise<Statistic> {
    return this.updateStatistics({
      totalDeposits: this.statistics.totalDeposits + amount
    });
  }
  
  async incrementWithdrawals(amount: number): Promise<Statistic> {
    return this.updateStatistics({
      totalWithdrawals: this.statistics.totalWithdrawals + amount
    });
  }
  
  // Site content
  async setSiteContent(contentData: InsertSiteContent): Promise<SiteContent> {
    // Check if content with this key already exists
    const existingContent = await this.getSiteContent(contentData.key);
    
    if (existingContent) {
      const updatedContent: SiteContent = {
        ...existingContent,
        ...contentData,
        updatedAt: new Date()
      };
      
      this.siteContent.set(contentData.key, updatedContent);
      return updatedContent;
    }
    
    const id = this.siteContentIdCounter++;
    const now = new Date();
    
    const content: SiteContent = {
      ...contentData,
      id,
      updatedAt: now
    };
    
    this.siteContent.set(contentData.key, content);
    return content;
  }
  
  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    return this.siteContent.get(key);
  }
  
  async getAllSiteContent(): Promise<SiteContent[]> {
    return Array.from(this.siteContent.values());
  }
}

export const storage = new MemStorage();
