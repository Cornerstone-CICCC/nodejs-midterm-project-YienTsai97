import { Router, Request, Response } from 'express'
import userController from '../controller/user.controller'
import { checkAuth } from '../middleware/auth'

const userRouter = Router()

userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.loginUser)
userRouter.get('/logout', userController.logoutUser)

export default userRouter