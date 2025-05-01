import bcrypt from "bcryptjs";

export async function hashString(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
