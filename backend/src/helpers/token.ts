import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "@app/db/models";

export type TokenType = "ACCESS_TOKEN" | "REFRESH_TOKEN";
export type AccessTokenPayload = JwtPayload & {
    userId: string,
    permissions: Array<string>
}

export type RefreshTokenPayload = JwtPayload & {
    userId: string,
    accessToken: string
}

export default class TokenHelper {
    static generateAccessToken(user: User) {
        const secret: string = process.env.JWT_SECRET_ACCESS_TOKEN || "";
        const payload: AccessTokenPayload = { userId: user.id, permissions: user.permissions };
        const token = jwt.sign(payload, secret, { expiresIn: "12h" });
        return token;
    }

    static generateRefreshToken(user: User, accessToken: string) {
        const secret: string = process.env.JWT_SECRET_REFRESH_TOKEN || "";
        const payload: RefreshTokenPayload = { userId: user.id, accessToken };
        const token = jwt.sign(payload, secret, { expiresIn: "1w" });
        return token;
    }

    static generateTokens(user: User) {
        const accessToken: string = TokenHelper.generateAccessToken(user);
        const refreshToken: string = TokenHelper.generateRefreshToken(user, accessToken);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    static validateAccessToken(accessToken: string): AccessTokenPayload | undefined {
        const secret: string = process.env.JWT_SECRET_ACCESS_TOKEN || "";
        try {
            return jwt.verify(accessToken, secret) as AccessTokenPayload;
        } catch (err) {
            return undefined;
        }
    }

    static validateRefreshToken(refreshToken: string): RefreshTokenPayload | undefined {
        const secret: string = process.env.JWT_SECRET_REFRESH_TOKEN || "";
        try {
            return jwt.verify(refreshToken, secret) as RefreshTokenPayload;
        } catch (err) {
            return undefined;
        }
    }
}