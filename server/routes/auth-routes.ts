
import type { Express } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "../../shared/schema";
import { generateToken } from "../auth-middleware";
import bcrypt from 'bcrypt';

export function registerAuthRoutes(app: Express) {
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const processedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone || null,
        userType: req.body.userType || 'buyer',
        isActive: req.body.isActive === true ? 1 : 0,
        dateOfBirth: req.body.dateOfBirth || null,
        address: req.body.address || null,
        city: req.body.city || null,
        state: req.body.state || null,
        zipCode: req.body.zipCode || null,
      };
      
      const userData = insertUserSchema.parse(processedData);

      console.log('Registration attempt for email:', userData.email, 'username:', userData.username);

      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken. Please choose a different username." });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = await storage.createUser({...userData, password: hashedPassword});
      const { password, ...userResponse } = user;
      console.log('Registration successful for user:', userData.email);
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Register error:", error);

      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        if (error.message.includes('users.email')) {
          return res.status(400).json({ message: "Email address already registered" });
        } else if (error.message.includes('users.username')) {
          return res.status(400).json({ message: "Username already taken. Please choose a different username." });
        }
        return res.status(400).json({ message: "Registration failed: duplicate information" });
      }

      res.status(400).json({ message: "Registration failed. Please check your information and try again." });
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

      // Trim whitespace
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log('Login attempt for email:', trimmedEmail);
      
      const user = await storage.getUserByEmail(trimmedEmail);

      if (!user) {
        console.log('User not found for email:', trimmedEmail);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('User found:', {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      });

      // Check if user is active
      if (!user.isActive) {
        console.log('Inactive user attempted login:', trimmedEmail);
        return res.status(401).json({ message: "Account is inactive" });
      }

      console.log('User found, comparing password...');
      console.log('Stored password hash:', user.password?.substring(0, 20) + '...');
      console.log('Input password length:', trimmedPassword.length);
      
      // Compare password
      let isValidPassword = false;
      try {
        if (!user.password) {
          console.error('User has no password set');
          return res.status(401).json({ message: "Invalid credentials" });
        }

        isValidPassword = await bcrypt.compare(trimmedPassword, user.password);
        console.log('Password comparison result:', isValidPassword);
        
        // Additional debug info
        if (!isValidPassword) {
          console.log('Password mismatch details:', {
            inputPasswordLength: trimmedPassword.length,
            storedHashLength: user.password.length,
            inputPasswordPrefix: trimmedPassword.substring(0, 3),
            hashPrefix: user.password.substring(0, 10)
          });
        }
      } catch (bcryptError) {
        console.error('Bcrypt comparison error:', bcryptError);
        return res.status(500).json({ message: "Authentication error" });
      }

      if (!isValidPassword) {
        console.log('Password mismatch for user:', trimmedEmail);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('Password match successful for user:', trimmedEmail);

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
}
