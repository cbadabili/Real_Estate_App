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
export declare class TokenService {
    private static readonly ACCESS_TOKEN_TTL;
    private static readonly REFRESH_TOKEN_TTL;
    static generateTokenPair(payload: TokenPayload): TokenPair;
    static storeRefreshToken(userId: number, token: string): Promise<void>;
    static validateRefreshToken(token: string): Promise<TokenPayload | null>;
    static revokeRefreshToken(token: string): Promise<void>;
    static revokeAllUserTokens(userId: number): Promise<void>;
}
