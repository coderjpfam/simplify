import bcrypt from "bcryptjs";

export async function hashBcrypt(password: string, rounds: number): Promise<string> {
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(password, salt);
}

export async function verifyBcrypt(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
