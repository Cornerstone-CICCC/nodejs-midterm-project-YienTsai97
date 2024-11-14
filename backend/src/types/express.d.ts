import { UserProfile, Image } from "./user";

declare module 'express-serve-static-core' {
    interface Request {
        session: {
            isAuthenticated: boolean,
            jwt?: string;
            state: string | undefined;
        }
        locals: {
            user: UserProfile;
        };
    }
}