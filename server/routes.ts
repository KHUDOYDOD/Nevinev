import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

// JWT Secret key - in production would be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "tradepo-secret-key";

// Token expiration time
const TOKEN_EXPIRY = '7d';

// Helper function to generate referral code
function generateReferralCode(length = 8) {
  return nanoid(length).toUpperCase();
}

// Helper function to calculate daily profit
function calculateDailyProfit(amount: number, dailyRate: number) {
  return amount * (dailyRate / 100);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const authenticateUser = async (req: any, res: any, next: any) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await storage.getUser(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  };

  // Admin middleware
  const authenticateAdmin = async (req: any, res: any, next: any) => {
    try {
      await authenticateUser(req, res, () => {
        if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Forbidden - Admin access required" });
        }
        next();
      });
    } catch (error) {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
  };

  // ----- AUTH ROUTES -----
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, fullName, language, referralCode } = req.body;
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate referral code
      const newReferralCode = generateReferralCode();
      
      // Check if referral code is valid
      let referrerId = null;
      if (referralCode) {
        const referrer = await storage.getUserByReferralCode(referralCode);
        if (referrer) {
          referrerId = referrer.id;
        }
      }
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        fullName: fullName || null,
        role: "user",
        balance: 0,
        language: language || "ru",
        referralCode: newReferralCode,
        referrerId: referrerId,
      });
      
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
      
      // Set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  });

  app.get("/api/auth/me", authenticateUser, async (req: any, res) => {
    try {
      // Return authenticated user without password
      const { password, ...userWithoutPassword } = req.user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Server error during auth check" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  });

  // ----- USER ROUTES -----
  app.get("/api/users/current", authenticateUser, async (req: any, res) => {
    try {
      const user = req.user;
      
      // Get additional user info like total profit
      const activeDeposits = await storage.getActiveDepositsByUserId(user.id);
      const totalProfit = await storage.getUserTotalProfit(user.id);
      
      // Return user with additional info
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({
        ...userWithoutPassword,
        totalProfit,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Server error getting user data" });
    }
  });

  app.patch("/api/users/profile", authenticateUser, async (req: any, res) => {
    try {
      const { fullName, email, language } = req.body;
      const userId = req.user.id;
      
      // Validate email if changing
      if (email && email !== req.user.email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        fullName: fullName !== undefined ? fullName : req.user.fullName,
        email: email || req.user.email,
        language: language || req.user.language,
      });
      
      // Return updated user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error updating profile" });
    }
  });

  app.post("/api/users/change-password", authenticateUser, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, req.user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update user password
      await storage.updateUser(userId, { password: hashedPassword });
      
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Server error changing password" });
    }
  });

  // ----- TARIFF ROUTES -----
  app.get("/api/tariffs", async (req, res) => {
    try {
      const tariffs = await storage.getAllTariffs();
      res.status(200).json(tariffs);
    } catch (error) {
      console.error("Get tariffs error:", error);
      res.status(500).json({ message: "Server error getting tariffs" });
    }
  });

  // ----- DEPOSIT ROUTES -----
  app.get("/api/deposits", authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const deposits = await storage.getDepositsByUserId(userId);
      
      // Enhance deposits with tariff info
      const enhancedDeposits = await Promise.all(
        deposits.map(async (deposit) => {
          const tariff = await storage.getTariff(deposit.tariffId);
          return { ...deposit, tariff };
        })
      );
      
      res.status(200).json(enhancedDeposits);
    } catch (error) {
      console.error("Get deposits error:", error);
      res.status(500).json({ message: "Server error getting deposits" });
    }
  });

  app.get("/api/deposits/active", authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const deposits = await storage.getActiveDepositsByUserId(userId);
      
      // Enhance deposits with tariff info
      const enhancedDeposits = await Promise.all(
        deposits.map(async (deposit) => {
          const tariff = await storage.getTariff(deposit.tariffId);
          return { ...deposit, tariff };
        })
      );
      
      res.status(200).json(enhancedDeposits);
    } catch (error) {
      console.error("Get active deposits error:", error);
      res.status(500).json({ message: "Server error getting active deposits" });
    }
  });

  app.post("/api/deposits", authenticateUser, async (req: any, res) => {
    try {
      const { amount, tariffId } = req.body;
      const userId = req.user.id;
      
      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Check if user has enough balance
      if (req.user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Get tariff
      const tariff = await storage.getTariff(tariffId);
      if (!tariff) {
        return res.status(404).json({ message: "Tariff not found" });
      }
      
      // Check if tariff is active
      if (!tariff.isActive) {
        return res.status(400).json({ message: "Tariff is not active" });
      }
      
      // Check minimum deposit
      if (amount < tariff.minDeposit) {
        return res.status(400).json({ message: `Minimum deposit for this tariff is ${tariff.minDeposit}` });
      }
      
      // Calculate daily profit
      const dailyProfit = calculateDailyProfit(amount, tariff.dailyRate);
      
      // Create deposit
      const deposit = await storage.createDeposit({
        userId,
        tariffId,
        amount,
        dailyProfit,
        status: "active",
      });
      
      // Deduct amount from user balance
      await storage.updateUserBalance(userId, -amount);
      
      // Create deposit transaction
      await storage.createTransaction({
        userId,
        type: "deposit",
        amount,
        status: "completed",
        description: `Deposit created - ${tariff.name}`,
      });
      
      // Update statistics
      await storage.incrementNewDeposits24h();
      await storage.incrementTotalInvested(amount);
      
      // Return deposit with tariff info
      res.status(201).json({ ...deposit, tariff });
    } catch (error) {
      console.error("Create deposit error:", error);
      res.status(500).json({ message: "Server error creating deposit" });
    }
  });

  // ----- TRANSACTION ROUTES -----
  app.get("/api/transactions", authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getTransactionsByUserId(userId);
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Server error getting transactions" });
    }
  });

  app.get("/api/transactions/recent", authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getRecentTransactionsByUserId(userId, 10);
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Get recent transactions error:", error);
      res.status(500).json({ message: "Server error getting recent transactions" });
    }
  });

  app.post("/api/transactions/withdraw", authenticateUser, async (req: any, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.id;
      
      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Check if user has enough balance
      if (req.user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Create withdrawal transaction
      const transaction = await storage.createTransaction({
        userId,
        type: "withdraw",
        amount,
        status: "pending",
        description: "Withdrawal request",
      });
      
      // Deduct amount from user balance
      await storage.updateUserBalance(userId, -amount);
      
      // Update statistics
      await storage.incrementNewWithdrawals24h();
      
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Create withdrawal error:", error);
      res.status(500).json({ message: "Server error creating withdrawal" });
    }
  });

  // ----- REFERRAL ROUTES -----
  app.get("/api/referrals", authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get user's referral code
      const referralLink = `https://tradepo.ru/ref/${req.user.referralCode}`;
      
      // Get referrals
      const referrals = await storage.getReferralsByUserId(userId);
      
      // Get referral stats
      const totalReferrals = referrals.length;
      const activeReferrals = referrals.filter((referral: any) => referral.hasDeposits).length;
      
      // Get total earnings from referrals
      const totalEarnings = await storage.getReferralEarnings(userId);
      
      res.status(200).json({
        referralLink,
        referralCode: req.user.referralCode,
        totalReferrals,
        activeReferrals,
        totalEarnings,
        referrals,
      });
    } catch (error) {
      console.error("Get referrals error:", error);
      res.status(500).json({ message: "Server error getting referrals" });
    }
  });

  // ----- STATISTICS ROUTES -----
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      
      // Get recent activity data
      const recentUsers = await storage.getRecentUsers(5);
      const recentDeposits = await storage.getRecentDeposits(5);
      const recentWithdrawals = await storage.getRecentWithdrawals(5);
      
      res.status(200).json({
        ...stats,
        recentUsers,
        recentDeposits,
        recentWithdrawals,
      });
    } catch (error) {
      console.error("Get statistics error:", error);
      res.status(500).json({ message: "Server error getting statistics" });
    }
  });

  // ----- ADMIN ROUTES -----
  app.get("/api/admin/dashboard", authenticateAdmin, async (req, res) => {
    try {
      // Get statistics
      const stats = await storage.getStatistics();
      
      // Get additional dashboard data
      const recentUsers = await storage.getRecentUsers(5);
      const pendingWithdrawals = await storage.getPendingWithdrawals(5);
      const pendingWithdrawalsCount = await storage.getPendingWithdrawalsCount();
      const pendingWithdrawalsTotal = await storage.getPendingWithdrawalsTotal();
      
      // Calculate growth rates (mock data for now)
      const userGrowthRate = 12;
      const investmentGrowthRate = 8;
      const payoutGrowthRate = 5;
      
      res.status(200).json({
        ...stats,
        recentUsers,
        pendingWithdrawals,
        pendingWithdrawalsCount,
        pendingWithdrawalsTotal,
        userGrowthRate,
        investmentGrowthRate,
        payoutGrowthRate,
      });
    } catch (error) {
      console.error("Get admin dashboard error:", error);
      res.status(500).json({ message: "Server error getting admin dashboard" });
    }
  });

  app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Get admin users error:", error);
      res.status(500).json({ message: "Server error getting users" });
    }
  });

  app.patch("/api/admin/users/:userId", authenticateAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { balance, role } = req.body;
      
      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        balance: balance !== undefined ? balance : user.balance,
        role: role || user.role,
      });
      
      // Return updated user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Server error updating user" });
    }
  });

  app.delete("/api/admin/users/:userId", authenticateAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Delete user
      await storage.deleteUser(userId);
      
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Server error deleting user" });
    }
  });

  app.get("/api/admin/deposits", authenticateAdmin, async (req, res) => {
    try {
      const deposits = await storage.getAllDeposits();
      
      // Enhance deposits with user and tariff info
      const enhancedDeposits = await Promise.all(
        deposits.map(async (deposit) => {
          const user = await storage.getUser(deposit.userId);
          const tariff = await storage.getTariff(deposit.tariffId);
          
          // Remove password from user
          const { password, ...userWithoutPassword } = user;
          
          return { 
            ...deposit, 
            user: userWithoutPassword,
            tariff,
          };
        })
      );
      
      res.status(200).json(enhancedDeposits);
    } catch (error) {
      console.error("Get admin deposits error:", error);
      res.status(500).json({ message: "Server error getting deposits" });
    }
  });

  app.post("/api/admin/deposits/:depositId/cancel", authenticateAdmin, async (req, res) => {
    try {
      const depositId = parseInt(req.params.depositId);
      
      // Get deposit
      const deposit = await storage.getDeposit(depositId);
      if (!deposit) {
        return res.status(404).json({ message: "Deposit not found" });
      }
      
      // Check if deposit is active
      if (deposit.status !== "active") {
        return res.status(400).json({ message: "Deposit is not active" });
      }
      
      // Cancel deposit
      await storage.updateDepositStatus(depositId, "cancelled");
      
      // Return deposit amount to user
      await storage.updateUserBalance(deposit.userId, deposit.amount);
      
      // Create refund transaction
      await storage.createTransaction({
        userId: deposit.userId,
        type: "deposit_refund",
        amount: deposit.amount,
        status: "completed",
        description: "Deposit cancelled by admin",
      });
      
      res.status(200).json({ message: "Deposit cancelled successfully" });
    } catch (error) {
      console.error("Cancel deposit error:", error);
      res.status(500).json({ message: "Server error cancelling deposit" });
    }
  });

  app.get("/api/admin/withdrawals", authenticateAdmin, async (req, res) => {
    try {
      const withdrawals = await storage.getAllWithdrawals();
      
      // Enhance withdrawals with user info
      const enhancedWithdrawals = await Promise.all(
        withdrawals.map(async (withdrawal) => {
          const user = await storage.getUser(withdrawal.userId);
          
          // Remove password from user
          const { password, ...userWithoutPassword } = user;
          
          return { 
            ...withdrawal, 
            user: userWithoutPassword,
          };
        })
      );
      
      res.status(200).json(enhancedWithdrawals);
    } catch (error) {
      console.error("Get admin withdrawals error:", error);
      res.status(500).json({ message: "Server error getting withdrawals" });
    }
  });

  app.post("/api/admin/withdrawals/:withdrawalId/approve", authenticateAdmin, async (req, res) => {
    try {
      const withdrawalId = parseInt(req.params.withdrawalId);
      
      // Get withdrawal
      const withdrawal = await storage.getTransaction(withdrawalId);
      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }
      
      // Check if withdrawal is pending
      if (withdrawal.status !== "pending" || withdrawal.type !== "withdraw") {
        return res.status(400).json({ message: "Invalid withdrawal or status" });
      }
      
      // Approve withdrawal
      await storage.updateTransactionStatus(withdrawalId, "completed");
      
      // Update statistics
      await storage.incrementTotalPaid(withdrawal.amount);
      
      res.status(200).json({ message: "Withdrawal approved successfully" });
    } catch (error) {
      console.error("Approve withdrawal error:", error);
      res.status(500).json({ message: "Server error approving withdrawal" });
    }
  });

  app.post("/api/admin/withdrawals/:withdrawalId/reject", authenticateAdmin, async (req, res) => {
    try {
      const withdrawalId = parseInt(req.params.withdrawalId);
      
      // Get withdrawal
      const withdrawal = await storage.getTransaction(withdrawalId);
      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }
      
      // Check if withdrawal is pending
      if (withdrawal.status !== "pending" || withdrawal.type !== "withdraw") {
        return res.status(400).json({ message: "Invalid withdrawal or status" });
      }
      
      // Reject withdrawal
      await storage.updateTransactionStatus(withdrawalId, "rejected");
      
      // Return amount to user
      await storage.updateUserBalance(withdrawal.userId, withdrawal.amount);
      
      res.status(200).json({ message: "Withdrawal rejected successfully" });
    } catch (error) {
      console.error("Reject withdrawal error:", error);
      res.status(500).json({ message: "Server error rejecting withdrawal" });
    }
  });

  app.get("/api/admin/tariffs", authenticateAdmin, async (req, res) => {
    try {
      const tariffs = await storage.getAllTariffs();
      res.status(200).json(tariffs);
    } catch (error) {
      console.error("Get admin tariffs error:", error);
      res.status(500).json({ message: "Server error getting tariffs" });
    }
  });

  app.post("/api/admin/tariffs", authenticateAdmin, async (req, res) => {
    try {
      const { name, nameEn, dailyRate, minDeposit, referralBonus, isActive } = req.body;
      
      // Create tariff
      const tariff = await storage.createTariff({
        name,
        nameEn,
        dailyRate,
        minDeposit,
        referralBonus,
        isActive: isActive !== undefined ? isActive : true,
      });
      
      res.status(201).json(tariff);
    } catch (error) {
      console.error("Create tariff error:", error);
      res.status(500).json({ message: "Server error creating tariff" });
    }
  });

  app.patch("/api/admin/tariffs/:tariffId", authenticateAdmin, async (req, res) => {
    try {
      const tariffId = parseInt(req.params.tariffId);
      const { name, nameEn, dailyRate, minDeposit, referralBonus, isActive } = req.body;
      
      // Get tariff
      const tariff = await storage.getTariff(tariffId);
      if (!tariff) {
        return res.status(404).json({ message: "Tariff not found" });
      }
      
      // Update tariff
      const updatedTariff = await storage.updateTariff(tariffId, {
        name: name !== undefined ? name : tariff.name,
        nameEn: nameEn !== undefined ? nameEn : tariff.nameEn,
        dailyRate: dailyRate !== undefined ? dailyRate : tariff.dailyRate,
        minDeposit: minDeposit !== undefined ? minDeposit : tariff.minDeposit,
        referralBonus: referralBonus !== undefined ? referralBonus : tariff.referralBonus,
        isActive: isActive !== undefined ? isActive : tariff.isActive,
      });
      
      res.status(200).json(updatedTariff);
    } catch (error) {
      console.error("Update tariff error:", error);
      res.status(500).json({ message: "Server error updating tariff" });
    }
  });

  app.get("/api/admin/content", authenticateAdmin, async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.status(200).json(content);
    } catch (error) {
      console.error("Get admin content error:", error);
      res.status(500).json({ message: "Server error getting content" });
    }
  });

  app.post("/api/admin/content", authenticateAdmin, async (req, res) => {
    try {
      const { key, valueRu, valueEn, valueTj, valueKz, valueUz } = req.body;
      
      // Check if key already exists
      const existingContent = await storage.getContentByKey(key);
      if (existingContent) {
        return res.status(400).json({ message: "Content key already exists" });
      }
      
      // Create content
      const content = await storage.createContent({
        key,
        valueRu,
        valueEn: valueEn || null,
        valueTj: valueTj || null,
        valueKz: valueKz || null,
        valueUz: valueUz || null,
      });
      
      res.status(201).json(content);
    } catch (error) {
      console.error("Create content error:", error);
      res.status(500).json({ message: "Server error creating content" });
    }
  });

  app.patch("/api/admin/content/:contentId", authenticateAdmin, async (req, res) => {
    try {
      const contentId = parseInt(req.params.contentId);
      const { valueRu, valueEn, valueTj, valueKz, valueUz } = req.body;
      
      // Get content
      const content = await storage.getContent(contentId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Update content
      const updatedContent = await storage.updateContent(contentId, {
        valueRu: valueRu !== undefined ? valueRu : content.valueRu,
        valueEn: valueEn !== undefined ? valueEn : content.valueEn,
        valueTj: valueTj !== undefined ? valueTj : content.valueTj,
        valueKz: valueKz !== undefined ? valueKz : content.valueKz,
        valueUz: valueUz !== undefined ? valueUz : content.valueUz,
      });
      
      res.status(200).json(updatedContent);
    } catch (error) {
      console.error("Update content error:", error);
      res.status(500).json({ message: "Server error updating content" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
