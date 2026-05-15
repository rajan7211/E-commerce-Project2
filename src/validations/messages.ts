import { success } from "zod";

export const validationMessages = {
EMAIL :{
    EMPTY : "Emial is required",
    INVALID : " Please enter a valid email address",
    REQUIRED : "Email is required",
    REGISTERTED : "Email already registered",
    NOTFOUND : "Email not Found",


},


  OTP : {
    EMPTY : "OTP is required",
    INVALID : "OTP must be 6 digit",
    LENGTH : "OTP must be exactly 6 digits",
    REQUIRED: "OTP is required",
    EXPIRED: "OTP has expired",
    INVALIDOTP: "Invalid OTP",
    ALREADYSENT: "OTP already sent. Please wait or check your email.",

  },

  general :  {
    validationFailed : 'validation failed',
    success : "success",
    error : "Error"

  },

};





















}

































