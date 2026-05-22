import {
  create as createUser,
  findByEmail as findUserByEmail,
  emailExists as checkEmailExists,
  verifyUser as verifyUserService,
} from "../repositories/user.repository";
import { generateAndSendOtp } from "./OtpService";
import { generateTokens } from "../utils/jwt.util";
import { UserRole } from "../utils/enums";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  RegisterRequestBody,
  LoginRequestBody,
  RegisterResponse,
  LoginResponse,
} from "../Interfaces/auth.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";



// register
export const register = async (
  data: RegisterRequestBody
): Promise<ServiceResponse<RegisterResponse>> => {
  const normalizedEmail = data.email.toLowerCase().trim();

  const emailExists = await checkEmailExists(normalizedEmail);
  if (emailExists) {
    throw createError(ResponseMessage.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }

  const user = await createUser({
    first_name: data.first_name,
    last_name: data.last_name,
    user_email: normalizedEmail,
    user_pass: data.password,
    role: data.role || UserRole.CUSTOMER,
  });

  // generate and send otp  

 await generateAndSendOtp(user) ; 

 return {
  success : true,
  message : ResponseMessage.REGISTRATION_SUCCESS,
  data : {
    email : user.user_email,
    first_name : user.first_name,
    last_name : user.last_name, 
    is_verified : user.is_verified,
  },
  statusCode : HttpStatus.CREATED,
 };

};


// login user 

export const login = async (
  data : LoginRequestBody
) : Promise<ServiceResponse<LoginResponse>> => {
  const normailizedEmail = data.email.toLowerCase().trim();

  // find User 
  const user = await findUserByEmail(normailizedEmail);
  if (!user) {
    throw createError (ResponseMessage.INVALID_CREDENTIALS , HttpStatus.UNAUTHORIZED);
  };


  const isPasswordvalid = await user.validatePassword(data.password);
  if (!isPasswordvalid) {
    throw createError (ResponseMessage.INVALID_CREDENTIALS , HttpStatus.UNAUTHORIZED);
  };

  if (!user.is_verified) {
    throw createError (ResponseMessage.EMAIL_NOT_VERIFIED, HttpStatus.FORBIDDEN)
  };


   const tokens = generateTokens ({
    userId : user.id,
    email : user.user_email,
    role : user.role,
    is_verified : user.is_verified,
   });

return {
  success : true,
  message : ResponseMessage.LOGIN_SUCCESS , 
  data : {
    user : {
      id : user.id,
      first_name : user.first_name,
      last_name : user.last_name,
      email : user.user_email,
      role : user.role,
      is_verified : user.is_verified,
      created_at  : user.created_at,
    },
    tokens,
  },
  statusCode : HttpStatus.OK
}


}




