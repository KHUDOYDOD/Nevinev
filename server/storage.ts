import { 
  users, 
  type User, 
  type InsertUser, 
  type Tariff, 
  type Deposit, 
  type Transaction,
  type Content
} from "@shared/schema";

interface Referral {
  id: number;
  userId: number;
  referredUserId: number;
  hasDeposits: boolean;
}

interface Statistics {
  totalUsers: number;
  totalInvested: number;
  totalPaid: number;
  newUsers24h: number;
  newDeposits24h: number;
  newWithdrawals24h: number;
  lastUpdated: Date;
}

// Comprehensive storage interface with all CRUD methods needed
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  updateUserBalance(id: number, amount: number): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getRecentUsers(limit: number): Promise<User[]>;
  getUserTotalProfit(id: number): Promise<number>;
  
  // Tariff methods
  getAllTariffs(): Promise<Tariff[]>;
  getTariff(id: number): Promise<Tariff | undefined>;
  createTariff(tariff: any): Promise<Tariff>;
  updateTariff(id: number, data: Partial<Tariff>): Promise<Tariff>;
  
  // Deposit methods
  getDeposit(id: number): Promise<Deposit | undefined>;
  getDepositsByUserId(userId: number): Promise<Deposit[]>;
  getActiveDepositsByUserId(userId: number): Promise<Deposit[]>;
  getAllDeposits(): Promise<Deposit[]>;
  getRecentDeposits(limit: number): Promise<Deposit[]>;
  createDeposit(deposit: any): Promise<Deposit>;
  updateDepositStatus(id: number, status: string): Promise<Deposit>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getRecentTransactionsByUserId(userId: number, limit: number): Promise<Transaction[]>;
  getAllWithdrawals(): Promise<Transaction[]>;
  getRecentWithdrawals(limit: number): Promise<Transaction[]>;
  getPendingWithdrawals(limit: number): Promise<Transaction[]>;
  getPendingWithdrawalsCount(): Promise<number>;
  getPendingWithdrawalsTotal(): Promise<number>;
  createTransaction(transaction: any): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction>;
  
  // Referral methods
  getReferralsByUserId(userId: number): Promise<Referral[]>;
  getReferralEarnings(userId: number): Promise<number>;
  
  // Content methods
  getAllContent(): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  getContentByKey(key: string): Promise<Content | undefined>;
  createContent(content: any): Promise<Content>;
  updateContent(id: number, data: Partial<Content>): Promise<Content>;
  
  // Statistics methods
  getStatistics(): Promise<Statistics>;
  incrementNewUsers24h(): Promise<void>;
  incrementNewDeposits24h(): Promise<void>;
  incrementNewWithdrawals24h(): Promise<void>;
  incrementTotalInvested(amount: number): Promise<void>;
  incrementTotalPaid(amount: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tariffs: Map<number, Tariff>;
  private deposits: Map<number, Deposit>;
  private transactions: Map<number, Transaction>;
  private content: Map<number, Content>;
  private referrals: Map<number, Referral>;
  private statistics: Statistics;
  
  currentId: number;
  private tariffId: number;
  private depositId: number;
  private transactionId: number;
  private contentId: number;
  private referralId: number;

  constructor() {
    this.users = new Map();
    this.tariffs = new Map();
    this.deposits = new Map();
    this.transactions = new Map();
    this.content = new Map();
    this.referrals = new Map();
    
    this.currentId = 1;
    this.tariffId = 1;
    this.depositId = 1;
    this.transactionId = 1;
    this.contentId = 1;
    this.referralId = 1;
    
    this.statistics = {
      totalUsers: 0,
      totalInvested: 0,
      totalPaid: 0,
      newUsers24h: 0,
      newDeposits24h: 0,
      newWithdrawals24h: 0,
      lastUpdated: new Date()
    };
    
    // Initialize with admin user
    this.createUser({
      username: "Admin",
      email: "admin@tradepo.ru",
      password: "$2a$10$B5Ac7O4WHo2h9UD7A/RwF.ZQqH1eW7JWgSS1Kkd7rdUlCJNDt/qfi", // "X12345x"
      fullName: "Administrator",
      role: "admin",
      balance: 0,
      language: "ru",
      referralCode: "ADMIN123",
      referrerId: null,
      createdAt: new Date()
    });
    
    // Initialize with default tariffs
    this.createTariff({
      name: "Базовый",
      nameEn: "Basic",
      dailyRate: 5,
      minDeposit: 100,
      referralBonus: 0.1,
      isActive: true
    });
    
    this.createTariff({
      name: "Премиум",
      nameEn: "Premium",
      dailyRate: 10,
      minDeposit: 500,
      referralBonus: 0.1,
      isActive: true
    });
    
    this.createTariff({
      name: "Элитный",
      nameEn: "Elite",
      dailyRate: 15,
      minDeposit: 1000,
      referralBonus: 0.1,
      isActive: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUserByReferralCode(code: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === code,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { 
      ...insertUser, 
      id,
      createdAt: insertUser.createdAt || new Date()
    } as User;
    
    this.users.set(id, user);
    this.statistics.totalUsers++;
    this.incrementNewUsers24h();
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  async updateUserBalance(id: number, amount: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { 
      ...user, 
      balance: typeof user.balance === 'string' 
        ? parseFloat(user.balance) + amount 
        : user.balance + amount 
    };
    
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getRecentUsers(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async getUserTotalProfit(id: number): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === id && tx.type === 'profit' && tx.status === 'completed')
      .reduce((total, tx) => total + (typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount), 0);
  }
  
  // Tariff methods
  async getAllTariffs(): Promise<Tariff[]> {
    return Array.from(this.tariffs.values());
  }
  
  async getTariff(id: number): Promise<Tariff | undefined> {
    return this.tariffs.get(id);
  }
  
  async createTariff(tariff: any): Promise<Tariff> {
    const id = this.tariffId++;
    const newTariff = { ...tariff, id } as Tariff;
    
    this.tariffs.set(id, newTariff);
    
    return newTariff;
  }
  
  async updateTariff(id: number, data: Partial<Tariff>): Promise<Tariff> {
    const tariff = await this.getTariff(id);
    if (!tariff) {
      throw new Error("Tariff not found");
    }
    
    const updatedTariff = { ...tariff, ...data };
    this.tariffs.set(id, updatedTariff);
    
    return updatedTariff;
  }
  
  // Deposit methods
  async getDeposit(id: number): Promise<Deposit | undefined> {
    return this.deposits.get(id);
  }
  
  async getDepositsByUserId(userId: number): Promise<Deposit[]> {
    return Array.from(this.deposits.values())
      .filter(deposit => deposit.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getActiveDepositsByUserId(userId: number): Promise<Deposit[]> {
    return Array.from(this.deposits.values())
      .filter(deposit => deposit.userId === userId && deposit.status === "active");
  }
  
  async getAllDeposits(): Promise<Deposit[]> {
    return Array.from(this.deposits.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getRecentDeposits(limit: number): Promise<Deposit[]> {
    return Array.from(this.deposits.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async createDeposit(deposit: any): Promise<Deposit> {
    const id = this.depositId++;
    const newDeposit = { 
      ...deposit, 
      id,
      isActive: true,
      createdAt: new Date()
    } as Deposit;
    
    this.deposits.set(id, newDeposit);
    
    return newDeposit;
  }
  
  async updateDepositStatus(id: number, status: string): Promise<Deposit> {
    const deposit = await this.getDeposit(id);
    if (!deposit) {
      throw new Error("Deposit not found");
    }
    
    const updatedDeposit = { 
      ...deposit, 
      isActive: status === 'active'
    };
    
    this.deposits.set(id, updatedDeposit);
    
    return updatedDeposit;
  }
  
  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getRecentTransactionsByUserId(userId: number, limit: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async getAllWithdrawals(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.type === 'withdraw')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getRecentWithdrawals(limit: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.type === 'withdraw')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async getPendingWithdrawals(limit: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.type === 'withdraw' && tx.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async getPendingWithdrawalsCount(): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.type === 'withdraw' && tx.status === 'pending')
      .length;
  }
  
  async getPendingWithdrawalsTotal(): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.type === 'withdraw' && tx.status === 'pending')
      .reduce((total, tx) => total + (typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount), 0);
  }
  
  async createTransaction(transaction: any): Promise<Transaction> {
    const id = this.transactionId++;
    const newTransaction = { 
      ...transaction, 
      id,
      createdAt: new Date()
    } as Transaction;
    
    this.transactions.set(id, newTransaction);
    
    return newTransaction;
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<Transaction> {
    const transaction = await this.getTransaction(id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    
    const updatedTransaction = { ...transaction, status };
    this.transactions.set(id, updatedTransaction);
    
    return updatedTransaction;
  }
  
  // Referral methods
  async getReferralsByUserId(userId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values())
      .filter(ref => ref.userId === userId)
      .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
  }
  
  async getReferralEarnings(userId: number): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId && tx.type === 'referral' && tx.status === 'completed')
      .reduce((total, tx) => total + (typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount), 0);
  }
  
  // Content methods
  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }
  
  async getContent(id: number): Promise<Content | undefined> {
    return this.content.get(id);
  }
  
  async getContentByKey(key: string): Promise<Content | undefined> {
    return Array.from(this.content.values())
      .find(content => content.key === key);
  }
  
  async createContent(content: any): Promise<Content> {
    const id = this.contentId++;
    const newContent = { ...content, id } as Content;
    
    this.content.set(id, newContent);
    
    return newContent;
  }
  
  async updateContent(id: number, data: Partial<Content>): Promise<Content> {
    const content = await this.getContent(id);
    if (!content) {
      throw new Error("Content not found");
    }
    
    const updatedContent = { ...content, ...data };
    this.content.set(id, updatedContent);
    
    return updatedContent;
  }
  
  // Statistics methods
  async getStatistics(): Promise<Statistics> {
    return this.statistics;
  }
  
  async incrementNewUsers24h(): Promise<void> {
    this.statistics.newUsers24h++;
    this.statistics.lastUpdated = new Date();
  }
  
  async incrementNewDeposits24h(): Promise<void> {
    this.statistics.newDeposits24h++;
    this.statistics.lastUpdated = new Date();
  }
  
  async incrementNewWithdrawals24h(): Promise<void> {
    this.statistics.newWithdrawals24h++;
    this.statistics.lastUpdated = new Date();
  }
  
  async incrementTotalInvested(amount: number): Promise<void> {
    this.statistics.totalInvested += amount;
    this.statistics.lastUpdated = new Date();
  }
  
  async incrementTotalPaid(amount: number): Promise<void> {
    this.statistics.totalPaid += amount;
    this.statistics.lastUpdated = new Date();
  }
}

export const storage = new MemStorage();
