import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertLanguagePreferenceSchema,
  insertDepositSchema,
  insertTransactionSchema,
  insertTestimonialSchema,
  insertTariffSchema,
  insertSiteContentSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(
    session({
      secret: "tradepo-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
      store: new SessionStore({
        checkPeriod: 86400000 // 24 hours
      })
    })
  );

  // Set up passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user || null);
    } catch (error) {
      done(error);
    }
  });

  // Error handling middleware for Zod validation errors
  const handleZodError = (err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        error: "Validation error", 
        details: validationError.message 
      });
    }
    next(err);
  };

  app.use(handleZodError);

  // Authentication check middleware
  const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Unauthorized" });
  };

  // Admin check middleware
  const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
      return next();
    }
    res.status(403).json({ error: "Forbidden" });
  };

  // API routes
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Generate a unique referral code
      userData.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Check if referrer exists
      if (req.body.referrerCode) {
        const referrer = await storage.getUserByReferralCode(req.body.referrerCode);
        if (referrer) {
          userData.referrerId = referrer.id;
        }
      }
      
      const newUser = await storage.createUser(userData);
      
      // Set default language preference
      await storage.setLanguagePreference({
        userId: newUser.id,
        language: "ru"
      });
      
      // Log the user in
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to login after registration" });
        }
        return res.status(201).json({ 
          message: "User registered successfully",
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            balance: newUser.balance,
            referralCode: newUser.referralCode
          }
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ error: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ 
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            balance: user.balance,
            referralCode: user.referralCode
          }
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/current-user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      balance: user.balance,
      referralCode: user.referralCode
    });
  });

  // Language preferences
  app.post("/api/language-preference", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const data = insertLanguagePreferenceSchema.parse({
        userId: user.id,
        language: req.body.language
      });
      
      const preference = await storage.setLanguagePreference(data);
      res.json(preference);
    } catch (error) {
      res.status(500).json({ error: "Failed to set language preference" });
    }
  });

  app.get("/api/language-preference", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const preference = await storage.getLanguagePreference(user.id);
      
      if (!preference) {
        return res.json({ language: "ru" }); // Default language
      }
      
      res.json({ language: preference.language });
    } catch (error) {
      res.status(500).json({ error: "Failed to get language preference" });
    }
  });

  // Tariffs
  app.get("/api/tariffs", async (req, res) => {
    try {
      const tariffs = await storage.getTariffs();
      res.json(tariffs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tariffs" });
    }
  });

  app.post("/api/tariffs", isAdmin, async (req, res) => {
    try {
      const tariffData = insertTariffSchema.parse(req.body);
      const tariff = await storage.createTariff(tariffData);
      res.status(201).json(tariff);
    } catch (error) {
      res.status(500).json({ error: "Failed to create tariff" });
    }
  });

  app.put("/api/tariffs/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tariff = await storage.updateTariff(id, req.body);
      res.json(tariff);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tariff" });
    }
  });

  // Deposits
  app.post("/api/deposits", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const depositData = insertDepositSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      // Validate tariff exists
      const tariff = await storage.getTariffById(depositData.tariffId);
      if (!tariff) {
        return res.status(400).json({ error: "Invalid tariff" });
      }
      
      // Check if amount meets minimum requirement
      if (depositData.amount < tariff.minInvestment) {
        return res.status(400).json({ 
          error: `Minimum investment for this tariff is ${tariff.minInvestment}` 
        });
      }
      
      // Check if user has enough balance
      if (user.balance < depositData.amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      const deposit = await storage.createDeposit(depositData);
      res.status(201).json(deposit);
    } catch (error) {
      res.status(500).json({ error: "Failed to create deposit" });
    }
  });

  app.get("/api/deposits/user", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const deposits = await storage.getDepositsByUserId(user.id);
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ error: "Failed to get deposits" });
    }
  });

  app.get("/api/deposits/active", isAdmin, async (req, res) => {
    try {
      const deposits = await storage.getActiveDeposits();
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ error: "Failed to get active deposits" });
    }
  });

  app.put("/api/deposits/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["active", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const deposit = await storage.updateDepositStatus(id, status);
      res.json(deposit);
    } catch (error) {
      res.status(500).json({ error: "Failed to update deposit status" });
    }
  });

  // Transactions
  app.post("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      // For withdrawals, check if user has enough balance
      if (transactionData.type === "withdrawal") {
        if (user.balance < transactionData.amount) {
          return res.status(400).json({ error: "Insufficient balance" });
        }
        
        // Reduce the user's balance
        await storage.updateUserBalance(user.id, -transactionData.amount);
      }
      
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.get("/api/transactions/user", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const transactions = await storage.getTransactionsByUserId(user.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get transactions" });
    }
  });

  app.get("/api/transactions/pending-withdrawals", isAdmin, async (req, res) => {
    try {
      const withdrawals = await storage.getPendingWithdrawals();
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ error: "Failed to get pending withdrawals" });
    }
  });

  app.put("/api/transactions/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "completed", "failed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const transaction = await storage.updateTransactionStatus(id, status);
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction status" });
    }
  });

  // Testimonials
  app.post("/api/testimonials", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const testimonialData = insertTestimonialSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const approvedOnly = req.query.approvedOnly !== "false";
      const testimonials = await storage.getTestimonials(approvedOnly);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to get testimonials" });
    }
  });

  app.put("/api/testimonials/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.approveTestimonial(id);
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve testimonial" });
    }
  });

  // Statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const statistics = await storage.getStatistics();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: "Failed to get statistics" });
    }
  });

  // Site content
  app.get("/api/site-content", async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to get site content" });
    }
  });

  app.get("/api/site-content/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const content = await storage.getSiteContent(key);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to get site content" });
    }
  });

  app.post("/api/site-content", isAdmin, async (req, res) => {
    try {
      const contentData = insertSiteContentSchema.parse(req.body);
      const content = await storage.setSiteContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to set site content" });
    }
  });

  // Admin earnings distribution simulation
  app.post("/api/admin/simulate-earnings", isAdmin, async (req, res) => {
    try {
      const activeDeposits = await storage.getActiveDeposits();
      let processedCount = 0;
      
      for (const deposit of activeDeposits) {
        const tariff = await storage.getTariffById(deposit.tariffId);
        if (!tariff) continue;
        
        const earnings = deposit.amount * (tariff.interestRate / 100);
        
        // Add earnings to user balance
        await storage.updateUserBalance(deposit.userId, earnings);
        
        // Create profit transaction
        await storage.createTransaction({
          userId: deposit.userId,
          type: "profit",
          amount: earnings,
          status: "completed",
          depositId: deposit.id,
          description: `Daily profit from ${tariff.name} plan`
        });
        
        // Handle referral bonuses if applicable
        const user = await storage.getUserById(deposit.userId);
        if (user && user.referrerId) {
          const referralBonus = earnings * (tariff.referralBonus / 100);
          
          await storage.updateUserBalance(user.referrerId, referralBonus);
          
          await storage.createTransaction({
            userId: user.referrerId,
            type: "referral",
            amount: referralBonus,
            status: "completed",
            description: `Referral bonus from ${user.username}`
          });
        }
        
        processedCount++;
      }
      
      res.json({ 
        message: "Earnings simulation completed", 
        processedDeposits: processedCount 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to simulate earnings" });
    }
  });

  // Generate fake activity for demonstration
  app.get("/api/fake-activity", async (req, res) => {
    try {
      // This endpoint is just for demonstration purposes
      // It returns randomized mock data for the activity section
      
      const newUsers = Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        initial: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        name: ["Алексей В.", "Ольга М.", "Михаил К.", "Елена Д.", "Иван С.", "Анна К.", "Сергей Р.", "Мария Л.", "Дмитрий П.", "Татьяна Н."][i],
        timeAgo: Math.floor(Math.random() * 60) + " минут назад"
      }));
      
      const newDeposits = Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        name: ["Александр П.", "Марина К.", "Дмитрий Л.", "Светлана Ф.", "Артем Ю.", "Валентина С.", "Павел Р.", "Екатерина М.", "Николай В.", "Юлия З."][i],
        plan: ["Базовый", "Премиум", "Элит"][Math.floor(Math.random() * 3)],
        amount: Math.floor(Math.random() * 1950) + 150,
        timeAgo: Math.floor(Math.random() * 60) + " минут назад"
      }));
      
      const newWithdrawals = Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        name: ["Николай Г.", "Валентина Р.", "Сергей П.", "Анна К.", "Игорь В.", "Ольга С.", "Максим Д.", "Ирина Ж.", "Артур Т.", "Наталья Б."][i],
        type: Math.random() > 0.3 ? "Прибыль" : "Прибыль + Капитал",
        amount: Math.floor(Math.random() * 1500) + 100,
        timeAgo: Math.floor(Math.random() * 60) + " минут назад"
      }));
      
      res.json({
        newUsers,
        newDeposits,
        newWithdrawals
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get fake activity data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
