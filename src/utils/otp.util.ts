export class OtpUtil {
 
  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }


  static getOtpExpiry(): Date {
    const now = new Date();
    return new Date(now.getTime() + 5 * 60000);
  }


  static isOtpExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate;
  }


  static formatOtpForEmail(otp: string): string {
    return otp.split("").join(" ");
  }
}







