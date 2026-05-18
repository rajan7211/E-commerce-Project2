export class OtpUtil {
  /**
   * Generate 6-digit numeric OTP
   */
  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Calculate OTP expiry date (5 minutes)
   */
  static getOtpExpiry(): Date {
    const now = new Date();
    return new Date(now.getTime() + 5 * 60000);
  }

  /**
   * Check if OTP is expired
   */
  static isOtpExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate;
  }

  /**
   * Format OTP for email display
   */
  static formatOtpForEmail(otp: string): string {
    return otp.split("").join(" ");
  }
}







