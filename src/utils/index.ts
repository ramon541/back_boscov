import bcrypt from 'bcrypt';

//= =================================================================================
export async function generateHash(str: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(str, saltRounds);
}

//= =================================================================================
export async function verifyHash(str: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(str, hash);
}

//= =================================================================================
