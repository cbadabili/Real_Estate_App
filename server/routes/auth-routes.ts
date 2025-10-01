import type { Express } from "express";
import bcrypt from "bcrypt";
import { storage } from "../storage";
import { generateToken, authenticate } from "../auth-middleware";
import { createDefaultEntitlements } from "../entitlements-service";
import type { InsertUser } from "../../shared/schema";

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
          const reason = entitlementError instanceof Error ? entitlementError.message : String(entitlementError);
          console.warn(`entitlements non-fatal: ${reason}`);
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
      const reason = error instanceof Error ? error.message : String(error);
      console.error("Registration error:", reason);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  // User login
  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        console.log('Login failed: Missing email or password');
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Normalize email casing consistently
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log('Login attempt for email domain:', normalizedEmail.split('@')[1]);

      const user = await storage.getUserByEmail(normalizedEmail);

      if (!user) {
        console.log('Login failed: user not found for domain:', normalizedEmail.split('@')[1]);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.isActive) {
        console.log('Login failed: account inactive for user:', user.id);
        return res.status(401).json({ message: "Account is inactive" });
      }

      const isValidPassword = await bcrypt.compare(trimmedPassword, user.password);

      if (!isValidPassword) {
        console.log('Login failed: invalid credentials for user:', user.id);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('Login successful for user:', user.id);

      // Update last login time
      try {
        const loginTimestamp = new Date();
        await storage.updateUser(user.id, { lastLoginAt: loginTimestamp });
        console.log('Updated last login time for user:', user.id);
      } catch (updateError) {
        console.error('Error updating last login:', updateError);
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

      console.log('Login successful for user:', userResponse.email, 'with ID:', userResponse.id);
      res.json(userResponse);
    } catch (error) {
      console.error("Login error:", error);
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
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Failed to get user data" });
    }
  });
}