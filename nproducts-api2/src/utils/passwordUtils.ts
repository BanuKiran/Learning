import bcrypt from 'bcrypt';

export class PasswordUtils {
	public static async hash(password: string): Promise<string> {
		return await bcrypt.hash(password, Number(process.env.BCRYPT_HASH_ROUNDS || 14));
	}
}
