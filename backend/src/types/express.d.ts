import { User } from "./user";

declare module 'express-serve-static-core' {
    interface Request {
        session: {
            isAuthenticated: boolean,
            jwt?: string,
            userId: string,
        }
    }
}