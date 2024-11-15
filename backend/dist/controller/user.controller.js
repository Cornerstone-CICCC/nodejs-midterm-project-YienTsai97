"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_1 = require("../middleware/auth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { JWT_SECRET, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
//Token
const tokenUrl = 'https://accounts.spotify.com/api/token';
//State key generater
// const generateRandomString = (length: number): string => {
//     return crypto.randomBytes(60).toString('hex').slice(0, length);
// };
const getState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storedState } = req.body;
        req.session.storedState = storedState;
        console.log(`getState storedState:${storedState}`);
        res.status(201).json(storedState);
    }
    catch (error) {
        console.error(`error:"fail to get state"`);
    }
});
const getUserProfile = (req, res) => {
    const user = user_model_1.default.getProfile();
    res.json(user);
};
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
const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code || undefined;
    const state = req.query.state || undefined;
    const { storedState } = req.session;
    console.log(`callback state:${state}`);
    console.log(`callback storedState:${storedState}`);
    if (!code || !state) {
        console.error("Missing code or state (spotify)");
        res.status(404).json({ message: "Missing code or state (spotify)", code, state, storedState });
        return;
    }
    if (state !== storedState) {
        console.error("error: state_mismatch");
        res.status(404).json({ message: 'error: state_mismatch', code, state, storedState: storedState });
        return;
    }
    req.session.storedState = undefined;
    const body = new URLSearchParams({
        code: code,
        redirect_uri: REDIRECT_URI || "",
        grant_type: 'authorization_code',
    });
    const authHeader = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
    try {
        const response = yield fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });
        if (!response.ok) {
            res.status(404).json({ message: 'Failed to get access token' }).redirect('/');
        }
        // const { access_token, refresh_token } = data;
        const data = yield response.json();
        const token = (0, auth_1.generateToken)({ access_token: data.access_token });
        req.session.isAuthenticated = true;
        req.session.jwt = token;
        res.redirect('/profile');
    }
    catch (error) {
        console.error(error);
        res.status(404).json({ message: 'User not found' });
    }
});
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.session.jwt;
    try {
        const access_token = (0, auth_1.verifyToken)(token);
        const response = yield fetch('https://api.spotify.com/v1/me', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        if (!response.ok) {
            res.status(400).json({ message: 'Failed to fetch profile' });
            return;
        }
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to authenticate token' });
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refresh_token = req.query.refresh_token;
    const authHeader = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
    });
    try {
        const response = yield fetch(tokenUrl, {
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
        const data = yield response.json();
        res.json({ access_token: data.access_token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to refresh token' });
    }
});
const logout = (req, res) => {
    req.session = { isAuthenticated: false, storedState: undefined };
    res.redirect('/');
};
exports.default = {
    getUserProfile,
    getState,
    callback,
    profile,
    refreshToken,
    logout
};
