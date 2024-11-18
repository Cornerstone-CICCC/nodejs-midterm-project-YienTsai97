import { User } from "../types/user";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()


const JWT_SECRET = process.env.JET_SECRET || "default_secret"


export function generateToken(user: User): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): User | null {
    try {
        return jwt.verify(token, JWT_SECRET) as User;
    } catch (err) {
        return null;
    }
}