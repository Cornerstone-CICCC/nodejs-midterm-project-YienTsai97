import { Request, Response, NextFunction } from "express";
import { verifyToken } from './auth';


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.session.jwt;
    if (!token || !req.session.isAuthenticated) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(403).json({ message: 'Invalid token' });
        return
    }

    //req.locals.user = decoded as object;
    next();
}