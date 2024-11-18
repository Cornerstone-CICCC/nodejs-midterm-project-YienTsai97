import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv'
dotenv.config()

import userRouter from './routes/user.routes'
import recipeRouter from './routes/recipes.routes'

// Create server
const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}))
app.use(cookieSession({
  name: 'session',
  keys: [
    process.env.COOKIE_SIGN_KEY ?? 'trspoochiuy839zbu389z00bcacy733',
    process.env.COOKIE_ENCRYPT_KEY ?? 'i3nv983han90d2x93kvad'
  ],
  maxAge: 60 * 60 * 1000 // 1 hour
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/users', userRouter)
app.use('/recipes', recipeRouter)

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send('Access denied')
})

// Start server
const PORT: number = Number(process.env.PORT || 3000)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})