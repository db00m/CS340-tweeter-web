import bcrypt from "bcrypt"

export class PasswordService {

  private saltRounds = 12

  async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async checkPassword(password: string, storedHash: string): Promise<boolean> {
    return await bcrypt.compare(password, storedHash);
  }
}