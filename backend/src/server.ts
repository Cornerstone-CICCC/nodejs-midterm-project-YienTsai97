import express, { Request, Response } from "express";
import userRouter from "./routes/user.routes";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
dotenv.config()


const app = express()

const { PORT, JWT_SECRET, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;


//Middleware
app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(cookieSession({
    name: 'session',
    keys: [
        JWT_SECRET ?? "",
        CLIENT_ID ?? "",
        CLIENT_SECRET ?? "",
        REDIRECT_URI ?? "http://localhost:3000/callback"
    ],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: false,
    // secure: process.env.NODE_ENV === 'production', // HTTPS only
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Routes
app.use('/', userRouter)

//404 fallback
app.use((req: Request, res: Response) => {
    res.status(404).send("Access denied")
})

//start server
app.listen(PORT || 3000, () => {
    console.log(`server is running on port ${PORT}...`)
})