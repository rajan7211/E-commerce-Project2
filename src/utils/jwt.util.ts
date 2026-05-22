import jwt from "jsonwebtoken";
import { JwtPayload, JwtTokens } from "../Interfaces/jwt.interface";


// GET JWT SECRET
const getSecret = (): string => {
  return process.env.JWT_SECRET || "your-secret-key-change-in-production";
};



// GENERATE JWT TOKEN
export const generateToken = (payload: JwtPayload): string => {
  const secret = getSecret();

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};


// GENERATE TOKENS
export const generateTokens = (payload: JwtPayload): JwtTokens => {
  const accessToken = generateToken(payload);
  return { accessToken };
};


// VERIFY TOKEN
export const verifyToken = (token: string): JwtPayload => {
  try {
    const secret = getSecret();
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};


// DECODE TOKEN
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};










