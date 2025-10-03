import type { Express } from "express";
import bcrypt from "bcrypt";
import { storage } from "../storage";
import { generateToken, authenticate } from "../auth-middleware";
import { createDefaultEntitlements } from "../entitlements-service";
import type { InsertUser } from "../../shared/schema";
import { logError, logInfo, logWarn } from "../utils/logger";

export function registerAuthRoutes(app: Express) {
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        bio,
        reacNumber,
        acceptTerms,
        userType,
      } = req.body ?? {};

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          message: "Email, password, first name, and last name are required",
        });
      }

      if (!acceptTerms) {
        return res.status(400).json({
          message: "You must accept the Terms of Service and Privacy Policy",
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (String(password).length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      const existingUser = await storage.getUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const allowedUserTypes = new Set(["buyer", "seller", "agent", "landlord"]);
      const normalizedUserType = typeof userType === "string" && allowedUserTypes.has(userType.toLowerCase())
        ? userType.toLowerCase()
        : "buyer";

      const hashedPassword = await bcrypt.hash(String(password), 10);
      const safeUsername = username
        ? String(username)
        : `${String(firstName).toLowerCase()}_${String(lastName).toLowerCase()}_${Date.now()}`;

      const userData: InsertUser = {
        username: safeUsername,
        email: normalizedEmail,
        password: hashedPassword,
        firstName: String(firstName),
        lastName: String(lastName),
        phone: phone ? String(phone) : null,
        userType: normalizedUserType,
        role: "user",
        permissions: [],
        bio: bio ? String(bio) : null,
        reacNumber: reacNumber ? String(reacNumber) : null,
        isActive: true,
        isVerified: false,
        lastLoginAt: null,
        avatar: null,
      };

      const user = await storage.createUser(userData);

      if (process.env.E2E !== "true") {
        try {
          await createDefaultEntitlements(user.id, userData.userType);
        } catch (entitlementError) {
          logWarn("auth.entitlements.create_failed", {
            req,
            userId: user.id,
            error: entitlementError,
          });
        }
      }

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
        },
      });
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? (error as { code?: string }).code : undefined;
      if (code === "23505") {
        return res.status(409).json({ message: "Email already registered" });
      }
      logError("auth.register.failed", { req, error });
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  // User login
  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        logWarn("auth.login.validation_failed", {
          req,
          meta: { reason: "missing_credentials" },
        });
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Normalize email casing consistently
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      const user = await storage.getUserByEmail(normalizedEmail);

      if (!user) {
        logWarn("auth.login.invalid_credentials", {
          req,
          meta: { outcome: "user_not_found" },
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.isActive) {
        logWarn("auth.login.account_inactive", {
          req,
          userId: user.id,
        });
        return res.status(401).json({ message: "Account is inactive" });
      }

      const isValidPassword = await bcrypt.compare(trimmedPassword, user.password);

      if (!isValidPassword) {
        logWarn("auth.login.invalid_credentials", {
          req,
          userId: user.id,
          meta: { outcome: "password_mismatch" },
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login time
      try {
        const loginTimestamp = new Date();
        await storage.updateUser(user.id, { lastLoginAt: loginTimestamp });
      } catch (updateError) {
        logWarn("auth.login.last_login_update_failed", {
          req,
          userId: user.id,
          error: updateError,
        });
        // Don't fail login for this
      }

      // Generate JWT token
      const token = generateToken(user);

      // Prepare user response (remove sensitive data)
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        userType: user.userType,
        role: user.role,
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        avatar: user.avatar,
        bio: user.bio,
        isVerified: Boolean(user.isVerified),
        isActive: Boolean(user.isActive),
        reacNumber: user.reacNumber,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        token: token // Include the JWT token
      };

      logInfo("auth.login.success", {
        req,
        userId: user.id,
      });
      res.json(userResponse);
    } catch (error) {
      logError("auth.login.failed", { req, error });
      res.status(500).json({ message: "Login failed. Please try again." });
    }
  });

  // Get current user (for JWT validation)
  app.get("/api/auth/user", authenticate, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = req.user;

      // Prepare user response (remove sensitive data)
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        userType: user.userType,
        role: user.role,
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        avatar: user.avatar,
        bio: user.bio,
        isVerified: Boolean(user.isVerified),
        isActive: Boolean(user.isActive),
        reacNumber: user.reacNumber,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      };

      res.json(userResponse);
    } catch (error) {
      logError("auth.me.failed", { req, error });
      res.status(500).json({ message: "Failed to get user data" });
    }
  });
}