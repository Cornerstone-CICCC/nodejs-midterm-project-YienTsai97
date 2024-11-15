import { Request, Response } from "express";
import userModel from "../models/user.model";
import { generateToken, verifyToken } from "../middleware/auth";
import dotenv from "dotenv";
dotenv.config()
const { JWT_SECRET, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
import crypto from 'crypto';
import { authenticateJWT } from "../middleware/middleware";

//Token
const tokenUrl = 'https://accounts.spotify.com/api/token'

//State key generater
// const generateRandomString = (length: number): string => {
//     return crypto.randomBytes(60).toString('hex').slice(0, length);
// };

const getState = async (req: Request<{}, {}, { storedState: string }>, res: Response): Promise<any> => {
    try {
        const { storedState } = req.body
        req.session.storedState = storedState;
        console.log(`getState storedState:${storedState}`)
        res.status(201).json(storedState)
    } catch (error) {
        console.error(`error:"fail to get state"`)
    }
}

const getUserProfile = (req: Request, res: Response): void => {
    const user = userModel.getProfile()
    res.json(user)
}

// const login = (req: Request, res: Response): void => {
//     const storedState = generateRandomString(16);
//     req.session.state = storedState;
//     const scope = 'user-read-private user-read-email';
//     const authUrl = `https://accounts.spotify.com/authorize?` +
//         new URLSearchParams({
//             response_type: 'code',
//             client_id: process.env.CLIENT_ID || '',
//             redirect_uri: process.env.REDIRECT_URI || '',
//             scope: scope,
//             state: storedState,
//         }).toString();
//     res.redirect(authUrl);
// }

const callback = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code || undefined
    const state = req.query.state as string || undefined
    const { storedState } = req.session
    console.log(`callback state:${state}`)
    console.log(`callback storedState:${storedState}`)


    if (!code || !state) {
        console.error("Missing code or state (spotify)")
        res.status(404).json({ message: "Missing code or state (spotify)", code, state, storedState });
        return;
    }

    if (state !== storedState) {
        console.error("error: state_mismatch")
        res.status(404).json({ message: 'error: state_mismatch', code, state, storedState: storedState });
        return;
    }
    req.session.storedState = undefined;


    const body = new URLSearchParams({
        code: code as string,
        redirect_uri: REDIRECT_URI || "",
        grant_type: 'authorization_code',
    });
    const authHeader = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (!response.ok) {
            res.status(404).json({ message: 'Failed to get access token' }).redirect('/')
        }

        // const { access_token, refresh_token } = data;
        const data = await response.json();

        const token = generateToken({ access_token: data.access_token });

        req.session.isAuthenticated = true;
        req.session.jwt = token;

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'User not found' });
    }
}



const profile = async (req: Request, res: Response): Promise<void> => {
    const token = req.session.jwt as string;

    try {
        const access_token = verifyToken(token);
        const response = await fetch('https://api.spotify.com/v1/me', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        if (!response.ok) {
            res.status(400).json({ message: 'Failed to fetch profile' });
            return;
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to authenticate token' });
    }
}

const refreshToken = async (req: Request, res: Response) => {
    const refresh_token = req.query.refresh_token as string;
    const authHeader = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
    });

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json() as { access_token: string };
        res.json({ access_token: data.access_token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to refresh token' });
    }
};

const logout = (req: Request, res: Response): void => {
    req.session = { isAuthenticated: false, storedState: undefined }
    res.redirect('/');
}

export default {
    getUserProfile,
    getState,
    callback,
    profile,
    refreshToken,
    logout
}

