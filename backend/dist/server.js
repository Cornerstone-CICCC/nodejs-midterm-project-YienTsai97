"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const { PORT, JWT_SECRET, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
//Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:4321',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((0, cookie_session_1.default)({
    name: 'session',
    keys: [
        JWT_SECRET !== null && JWT_SECRET !== void 0 ? JWT_SECRET : "",
        CLIENT_ID !== null && CLIENT_ID !== void 0 ? CLIENT_ID : "",
        CLIENT_SECRET !== null && CLIENT_SECRET !== void 0 ? CLIENT_SECRET : "",
        REDIRECT_URI !== null && REDIRECT_URI !== void 0 ? REDIRECT_URI : "http://localhost:3000/callback"
    ],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: false,
    // secure: process.env.NODE_ENV === 'production', // HTTPS only
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//Routes
app.use('/', user_routes_1.default);
//404 fallback
app.use((req, res) => {
    res.status(404).send("Access denied");
});
//start server
app.listen(PORT || 3000, () => {
    console.log(`server is running on port ${PORT}...`);
});
