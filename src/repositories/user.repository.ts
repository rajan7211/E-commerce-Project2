import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserRole } from "../utils/enums";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  /**
   * Create new user
   */
  async create(userData: {
    first_name: string;
    last_name: string;
    user_email: string;
    user_pass: string;
    role?: UserRole;
  }): Promise<User> {
    const user = this.repository.create({
      first_name: userData.first_name,
      last_name: userData.last_name,
      user_email: userData.user_email,
      user_pass: userData.user_pass,
      role: userData.role || UserRole.CUSTOMER,
      is_verified: false,
    });

    return await this.repository.save(user);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { user_email: email },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Update user verification status
   */
  async verifyUser(userId: number): Promise<User> {
    await this.repository.update(userId, { is_verified: true });
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("User not found after verification");
    }
    return user;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { user_email: email },
    });
    return count > 0;
  }

  /**
   * Get user with OTP relations
   */
  async findByEmailWithOtps(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { user_email: email },
      relations: ["otps"],
    });
  }

  /**
   * Update user details
   */
  async update(userId: number, data: Partial<User>): Promise<User> {
    await this.repository.update(userId, data);
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}






