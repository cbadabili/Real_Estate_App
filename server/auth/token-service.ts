
import jwt from 'jsonwebtoken';
import { env } from '../utils/env';
import { db } from '../db';
import { refreshTokens } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  userType: string;
  role: string;
}

export class TokenService {
  private static readonly ACCESS_TOKEN_TTL = '15m'; // 15 minutes
  private static readonly REFRESH_TOKEN_TTL = '7d'; // 7 days

  static generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_TTL,
    });

    const refreshToken = jwt.sign(
      { id: payload.id, tokenId: randomUUID() },
      env.JWT_SECRET,
      { expiresIn: this.REFRESH_TOKEN_TTL }
    );

    return { accessToken, refreshToken };
  }

  static async storeRefreshToken(userId: number, token: string): Promise<void> {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    
    await db.insert(refreshTokens).values({
      id: decoded.tokenId,
      userId,
      token,
      expiresAt: new Date(decoded.exp * 1000),
      createdAt: new Date(),
    });
  }

  static async validateRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      
      // Check if token exists in database
      const [storedToken] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.id, decoded.tokenId))
        .limit(1);

      if (!storedToken || storedToken.token !== token) {
        return null;
      }

      // Get user data for new access token
      const { users } = await import('../../shared/schema');
      const [userRecord] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);

      if (!userRecord) {
        return null;
      }

      return {
        id: userRecord.id,
        email: userRecord.email,
        userType: userRecord.userType,
        role: userRecord.role,
      };
    } catch {
      return null;
    }
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      await db.delete(refreshTokens).where(eq(refreshTokens.id, decoded.tokenId));
    } catch {
      // Token already invalid
    }
  }

  static async revokeAllUserTokens(userId: number): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }
}
