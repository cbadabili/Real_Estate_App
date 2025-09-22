import jwt from 'jsonwebtoken';
import { env } from '../utils/env';
import { db } from '../db';
import { refreshTokens } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
export class TokenService {
    static generateTokenPair(payload) {
        const accessToken = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: this.ACCESS_TOKEN_TTL,
        });
        const refreshToken = jwt.sign({ id: payload.id, tokenId: randomUUID() }, env.JWT_SECRET, { expiresIn: this.REFRESH_TOKEN_TTL });
        return { accessToken, refreshToken };
    }
    static async storeRefreshToken(userId, token) {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        await db.insert(refreshTokens).values({
            id: decoded.tokenId,
            userId,
            token,
            expiresAt: new Date(decoded.exp * 1000),
            createdAt: new Date(),
        });
    }
    static async validateRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET);
            // Check if token exists in database
            const storedToken = await db
                .select()
                .from(refreshTokens)
                .where(eq(refreshTokens.id, decoded.tokenId))
                .limit(1);
            if (!storedToken.length || storedToken[0].token !== token) {
                return null;
            }
            // Get user data for new access token
            const { users } = await import('../../shared/schema');
            const user = await db
                .select()
                .from(users)
                .where(eq(users.id, decoded.id))
                .limit(1);
            if (!user.length) {
                return null;
            }
            return {
                id: user[0].id,
                email: user[0].email,
                userType: user[0].userType,
                role: user[0].role,
            };
        }
        catch {
            return null;
        }
    }
    static async revokeRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET);
            await db.delete(refreshTokens).where(eq(refreshTokens.id, decoded.tokenId));
        }
        catch {
            // Token already invalid
        }
    }
    static async revokeAllUserTokens(userId) {
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }
}
TokenService.ACCESS_TOKEN_TTL = '15m'; // 15 minutes
TokenService.REFRESH_TOKEN_TTL = '7d'; // 7 days
