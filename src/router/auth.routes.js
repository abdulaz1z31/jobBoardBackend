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
    deleteAdmin,
    createAdmin,
} from '../controller/index.controller.js'
import {
    checkForgetToken,
    checkToken,
    roleGuard,
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
authRouter.post(
    '/forget/password',
    validationMiddleware(forgetSchema),
    checkToken,
    forgetPassword,
)
authRouter.post(
    '/forget/password/change',
    checkForgetToken,
    forgetPasswordChange,
)
authRouter.post('/change/password', checkToken, changePassword)
authRouter.post(
    '/create/admin',
    checkToken,
    roleGuard('superAdmin', 'admin'),
    validationMiddleware(registerSchema),
    createAdmin,
)
authRouter.post(
    '/delete/admin/:id',
    checkToken,
    roleGuard('superAdmin'),
    deleteAdmin,
)
