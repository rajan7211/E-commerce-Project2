import { Repository, LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Otpverification } from "../entities/otpVerification";
import { User } from "../entities/User";

export class OtpRepository {
  private repository: Repository<Otpverification>;

  constructor() {
    this.repository = AppDataSource.getRepository(Otpverification);
  }

  async create(user: User, otpCode: string, expiresAt: Date): Promise<Otpverification> {
    const otp = this.repository.create({
      user,
      otp_code: otpCode,
      expires_at: expiresAt,
      is_used: false,
    });

    return await this.repository.save(otp);
  }


  async findValidOtp(userId: number, otpCode: string): Promise<Otpverification | null> {
    return await this.repository
      .createQueryBuilder("otp")
      .innerJoinAndSelect("otp.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("otp.otp_code = :otpCode", { otpCode })
      .andWhere("otp.is_used = :isUsed", { isUsed: false })
      .andWhere("otp.expires_at > :now", { now: new Date() })
      .orderBy("otp.created_at", "DESC")
      .getOne();
  }


  async markAsUsed(otpId: number): Promise<void> {
    await this.repository.update(otpId, { is_used: true });
  }


  async invalidatePreviousOtps(userId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Otpverification)
      .set({ is_used: true })
      .where("user_id = :userId", { userId })
      .andWhere("is_used = :isUsed", { isUsed: false })
      .execute();
  }


  async deleteExpiredOtps(): Promise<void> {
    await this.repository.delete({
      expires_at: LessThan(new Date()),
    });
  }


  async getLatestOtpForUser(userId: number): Promise<Otpverification | null> {
    return await this.repository.findOne({
      where: { user: { id: userId }, is_used: false },
      order: { created_at: "DESC" },
    });
  }
}











