import bcrypt from 'bcrypt'

export const hashed = async (string: string): Promise<string> => {
    return await bcrypt.hash(string, 12)
}

export const comparHash = async (string: string, hashedstring: string): Promise<boolean> => {
    return await bcrypt.compare(string, hashedstring)
}