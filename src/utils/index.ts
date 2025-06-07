import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//= =================================================================================
export async function generateHash(str: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(str, salt);
}

//= =================================================================================
export async function verifyHash(
    string: string,
    dataBaseHash: string
): Promise<boolean> {
    return await bcrypt.compare(string, dataBaseHash);
}

//= =================================================================================
export function createToken(id: number): string {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not configured!');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}
