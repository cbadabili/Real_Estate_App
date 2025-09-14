
import type { Express } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "../../shared/schema";
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

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      console.log('Login attempt for email:', email);
      const user = await storage.getUserByEmail(email);

      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.log('Password mismatch');
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('Password match successful');

      try {
        const loginTimestamp = Math.floor(Date.now() / 1000);
        await storage.updateUser(user.id, { lastLoginAt: loginTimestamp });
      } catch (error) {
        console.error('Error updating last login:', error);
      }

      const { password: _, ...userResponse } = user;
      console.log('Login successful for user:', userResponse.email);
      res.json(userResponse);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
}
