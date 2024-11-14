import { Router, Request, Response } from "express";
import userController from "../controller/user.controller";
import { authenticateJWT } from "../middleware/middleware";


const userRouter = Router()

userRouter.get('/userprofile', userController.getUserProfile)
//userRouter.get('/login', userController.login)
userRouter.get('/callback', userController.callback)
userRouter.get('/profile', authenticateJWT, userController.profile)
userRouter.get('/refresh_token', userController.refreshToken)
userRouter.get('/logout', userController.logout)

export default userRouter