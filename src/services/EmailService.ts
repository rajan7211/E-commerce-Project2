import { transporter } from "../config/smtp";

// GET OTP TEMPLATE
const getOtpTemplate = (otp: string, firstName: string): string => {
  const formattedOtp = otp.split("").join(" ");

  return `
    <div style="font-family: Arial; padding: 20px; background: #f4f4f4;">
      <div style="background: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #007bff; text-align: center;">Email Verification</h2>
        <p>Hello <strong>${firstName}</strong>,</p>
        <p>Your OTP for email verification is:</p>
        <h1 style="background: #eee; padding: 15px; text-align: center; letter-spacing: 5px; color: #333;">${formattedOtp}</h1>
        <p style="color: #666;">This OTP is valid for 5 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    </div>
  `;
};


// GET WELCOME TEMPLATE
const getWelcomeTemplate = (firstName: string): string => {
  return `
    <div style="font-family: Arial; padding: 20px; background: #f4f4f4;">
      <div style="background: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4CAF50; text-align: center;">Welcome ${firstName}! 🎉</h2>
        <p>Your email has been successfully verified.</p>
        <p>You can now enjoy all features of our platform.</p>
      </div>
    </div>
  `;
};


// GET FORGOT PASSWORD OTP TEMPLATE
const getForgotPasswordOtpTemplate = (
  otp: string,
  firstName: string
): string => {
  const formattedOtp = otp.split("").join(" ");

  return `
    <div style="font-family: Arial; padding: 20px; background: #f4f4f4;">
      <div style="background: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #FF6B6B; text-align: center;">Password Reset Request</h2>
        <p>Hello <strong>${firstName}</strong>,</p>
        <p>We received a request to reset your password. Use the OTP below to proceed:</p>
        <div style="text-align: center; margin: 20px 0;">
          <h1 style="background: #eee; padding: 15px; letter-spacing: 5px; color: #333; margin: 0;">${formattedOtp}</h1>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center;">This OTP is valid for 15 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 11px;">For security reasons, do not share this OTP with anyone.</p>
      </div>
    </div>
  `;
};


// GET PASSWORD RESET SUCCESS TEMPLATE
const getPasswordResetSuccessTemplate = (firstName: string): string => {
  return `
    <div style="font-family: Arial; padding: 20px; background: #f4f4f4;">
      <div style="background: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4CAF50; text-align: center;">Password Changed Successfully ✓</h2>
        <p>Hello <strong>${firstName}</strong>,</p>
        <p>Your password has been successfully reset.</p>
        <p style="color: #666;">You can now log in with your new password.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 11px;">If you did not make this change, please contact support immediately.</p>
      </div>
    </div>
  `;
};


// SEND OTP EMAIL
export const sendOtpEmail = async (
  email: string,
  firstName: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: `"My_E-commerce" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: getOtpTemplate(otp, firstName),
  };

  await transporter.sendMail(mailOptions);
};


// SEND WELCOME EMAIL
export const sendWelcomeEmail = async (
  email: string,
  firstName: string
): Promise<void> => {
  const mailOptions = {
    from: `"MY_E-commerce" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to Our Platform!",
    html: getWelcomeTemplate(firstName),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

// SEND FORGOT PASSWORD OTP EMAIL
export const sendForgotPasswordOtpEmail = async (
  email: string,
  firstName: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: `"My_E-commerce" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: getForgotPasswordOtpTemplate(otp, firstName),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending forgot password OTP email:", error);
    throw error;
  }
};

// SEND PASSWORD RESET SUCCESS EMAIL
export const sendPasswordResetSuccessEmail = async (
  email: string,
  firstName: string
): Promise<void> => {
  const mailOptions = {
    from: `"My_E-commerce" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Password Has Been Reset",
    html: getPasswordResetSuccessTemplate(firstName),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
};










