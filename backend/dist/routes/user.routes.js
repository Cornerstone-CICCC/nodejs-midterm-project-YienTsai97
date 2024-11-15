"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const middleware_1 = require("../middleware/middleware");
const userRouter = (0, express_1.Router)();
userRouter.get('/userprofile', user_controller_1.default.getUserProfile);
userRouter.post('/state', user_controller_1.default.getState);
userRouter.get('/callback', user_controller_1.default.callback);
userRouter.get('/profile', middleware_1.authenticateJWT, user_controller_1.default.profile);
userRouter.get('/refresh_token', user_controller_1.default.refreshToken);
userRouter.get('/logout', user_controller_1.default.logout);
exports.default = userRouter;
