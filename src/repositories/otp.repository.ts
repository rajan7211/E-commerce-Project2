import { Repository, LessThan } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Otpverification } from "../entities/otpVerification";
import { User } from "../entities/User";


const getRepository = (): Repository<Otpverification> => {
  return AppDataSource.getRepository(Otpverification);
};



// Create OTP 
export const create = async (
  user: User,
  otpCode: string,
  expiresAt: Date
): Promise<Otpverification> => {
  const repository = getRepository();

  const otp = repository.create({
    user,
    otp_code: otpCode,
    expires_at: expiresAt,
    is_used: false,
  });

  return await repository.save(otp);
};



// find valid otp 
export const findValidOtp = async (
  userId: number,
  otpCode: string
): Promise<Otpverification | null> => {
  const repository = getRepository();

  return await repository
    .createQueryBuilder("otp")
    .innerJoinAndSelect("otp.user", "user")
    .where("user.id = :userId", { userId: userId })
    .andWhere("otp.otp_code = :otpCode", { otpCode: otpCode })
    .andWhere("otp.is_used = :isUsed", { isUsed: false })
    .andWhere("otp.expires_at > :now", { now: new Date() })
    .orderBy("otp.created_at", "DESC")
    .getOne();
};




// mark otp as used 
export const markAsUsed = async (otpId: number): Promise<void> => {
  const repository = getRepository();

  await repository.update(otpId, { is_used: true });
};





// Invalidate previous otps (fixed)

export const invalidatePreviousOtps = async (userId: number): Promise<void> => {
  const repository = getRepository();


  // Get all unused OTPs for this user
  const unusedOtps = await repository.find({
    where: { 
      user: { id: userId },
      is_used: false 
    },
  });



  // mark each as used 

  for (const otp of unusedOtps) {
    await repository.update(otp.id, { is_used: true });
  }
};


// delete expired otp 

export const deleteExpiredOtps = async (): Promise<void> => {
  const repository = getRepository();

  await repository.delete({
    expires_at: LessThan(new Date()),
  });
};

// get latest otp for user 

export const getLatestOtpForUser = async (userId: number): Promise<Otpverification | null> => {
  const repository = getRepository();

  return await repository.findOne({
    where: { user: { id: userId }, is_used: false },
    order: { created_at: "DESC" },
  });
};






















