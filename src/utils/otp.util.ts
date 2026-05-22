import { date, expression } from "joi";

export const getnerateOtp = (): string => {
  return Math.floor(10000 + Math.random() * 900000).toString();
};


export const getOtpExpiry = (): Date=> {
  const now = new Date();
  return new Date(now.getTime() + 5 * 60000);

}

export const isOtpExpired = (expiryDate:Date) : boolean => {
  return new Date() > expiryDate;

}



// format otp for mail 

export const formatOtpEmail = (otp : string) : string => {
  return otp.split("").join(" ")
};






