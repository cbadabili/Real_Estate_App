import type { Express } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "../../shared/schema";
import { generateToken, authenticate } from "../auth-middleware";
import bcrypt from 'bcrypt';

export function registerAuthRoutes(app: Express) {
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      console.log('Registration request received');

      const { username, email, password, firstName, lastName, phone, bio, reacNumber } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          message: "Email, password, first name, and last name are required"
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists"
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate username if not provided
      const finalUsername = username || `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Date.now()}`;

      // Create user data with secure defaults - ignore client-provided security flags
      const userData: any = {
        username: finalUsername,
        email: email.toLowerCase(), // Normalize email consistently
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        userType: 'buyer', // Always default to buyer, admin upgrades require manual approval
        role: 'user', // Always default to user role, never allow client to set admin roles
        permissions: JSON.stringify([]), // Default empty permissions
        bio,
        reacNumber,
        isActive: true, // Allow immediate activation for basic users
        isVerified: false, // Always require email verification
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000)
      };

      console.log('Creating user with secure defaults');

      const user = await storage.createUser(userData);

      console.log('User created successfully');

      const { password: _, ...userResponse } = user;
      res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      }
    });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
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