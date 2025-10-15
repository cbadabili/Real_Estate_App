
import type { Express } from "express";
import { OAuth2Client } from 'google-auth-library';
import { storage } from "../storage";
import { generateToken } from "../auth-middleware";
import { env } from "../utils/env";
import { logError, logInfo } from "../utils/logger";

const client = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5173'}/auth/google/callback`
);

export function registerGoogleAuthRoutes(app: Express) {
  // Google OAuth callback
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ message: "No credential provided" });
      }

      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        return res.status(400).json({ message: "Invalid Google token" });
      }

      const { email, given_name, family_name, picture, sub: googleId } = payload;

      // Check if user exists
      let user = await storage.getUserByEmail(email);

      if (!user) {
        // Create new user
        const username = email.split('@')[0] + '_' + Date.now();
        
        user = await storage.createUser({
          username,
          email,
          password: '', // No password for OAuth users
          firstName: given_name || 'User',
          lastName: family_name || '',
          userType: 'buyer',
          role: 'user',
          permissions: [],
          isActive: true,
          isVerified: true, // Auto-verify Google users
          avatar: picture || null,
          phone: null,
          bio: null,
          reacNumber: null,
        });

        logInfo("auth.google.register", {
          req,
          userId: user.id,
          email: user.email,
        });
      } else {
        // Update last login
        await storage.updateUser(user.id, { 
          lastLoginAt: new Date(),
          isVerified: true, // Verify user if they weren't already
        });

        logInfo("auth.google.login", {
          req,
          userId: user.id,
        });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Prepare user response
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
        token: token
      };

      res.json(userResponse);
    } catch (error) {
      logError("auth.google.failed", { req, error });
      res.status(500).json({ message: "Google authentication failed" });
    }
  });
}
