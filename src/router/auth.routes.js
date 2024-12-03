import { Router } from 'express'
import {
    forgetPasswordChange,
    forgetPassword,
    getUserProfile,
    loginUser,
    logOut,
    registerUser,
    updateToken,
    verifyUser,
    changePassword,
} from '../controller/index.controller.js'
import {
    checkForgetToken,
    checkToken,
    validationMiddleware,
} from '../middleware/index.middleware.js'
import {
    forgetSchema,
    loginSchema,
    registerSchema,
    verifySchema,
} from '../validations/index.schema.js'

export const authRouter = Router()

authRouter.post('/register', validationMiddleware(registerSchema), registerUser)
authRouter.post('/verify-otp', validationMiddleware(verifySchema), verifyUser)
authRouter.post('/login', validationMiddleware(loginSchema), loginUser)
authRouter.get('/me', checkToken, getUserProfile)
authRouter.get('/logout', checkToken, logOut)
authRouter.post('/refresh-token', updateToken)
authRouter.get('/forget/password',validationMiddleware(forgetSchema), checkToken, forgetPassword)
authRouter.post('/forget/password/change', checkForgetToken, forgetPasswordChange)
authRouter.post('/change/password', checkToken, changePassword)