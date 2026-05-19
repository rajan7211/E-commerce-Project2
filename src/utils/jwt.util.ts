import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload, JwtTokens } from "../Interfaces/jwt.interface";

export class JwtUtil {
  private static getSecret(): string {
    return process.env.JWT_SECRET || "your-secret-key-change-in-production";
  }

  private static getExpiry(): string {
    return process.env.JWT_EXPIRES_IN || "30m";
  }

  static generateToken(payload: JwtPayload): string {
    const secret = this.getSecret();
    const options: SignOptions = {
      expiresIn: this.getExpiry() as any,
    };

    return jwt.sign(payload, secret, options);
  }

  static generateTokens(payload: JwtPayload): JwtTokens {
    const accessToken = this.generateToken(payload);
    return { accessToken };
  }

  static verifyToken(token: string): JwtPayload {
    try {
      const secret = this.getSecret();
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}









