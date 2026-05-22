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


// SEND OTP EMAIL

export const sendOtpEmail = async (
  email: string,
  firstName: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: `"E-commerce" <${process.env.SMTP_USER}>`,
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
    from: `"E-commerce" <${process.env.SMTP_USER}>`,
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
















