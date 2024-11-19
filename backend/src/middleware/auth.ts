import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "default.secret"


export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const { isAuthenticated } = req.session
    if (isAuthenticated) {
      next()
    } else {
      res.status(403).json({ message: "Unauthorized" })
    }
  }

export function generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

export function verifyToken(token: string): any | null {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        console.error('Verify token errer:', error);
        return null
    }
}