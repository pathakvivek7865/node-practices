import * as bcrypt from "bcrypt";

export class PasswordHash {
    /**
     * @returns Returns a hashed password
     * @param plainPassword Plain password 
     */
  public static async hashPassword(plainPassword: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
  }
}
