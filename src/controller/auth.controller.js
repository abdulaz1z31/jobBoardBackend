import {
    changePasswordService,
    createAdminService,
    deleteAdminService,
    forgetPasswordChangeService,
    forgetPasswordService,
    getUserProfileService,
    loginUserService,
    registerUserService,
    updateTokenService,
    verifyUserService,
} from '../service/index.service.js'
import { statusCode } from '../utils/index.utils.js'

export const registerUser = async (req, res, next) => {
    try {
        const result = await registerUserService(req.body)
        const { success, error, userId } = result
        if (success) {
            return res.status(statusCode.CREATED).send({
                message: 'Success',
                info: 'one time password sended to your email',
                userId,
            })
        }
        return res.status(statusCode.CONFLICT).send({
            message: 'Fail',
            error: error,
        })
    } catch (error) {
        next(error)
    }
}
export const verifyUser = async (req, res, next) => {
    try {
        const result = await verifyUserService(req.body)
        const { success, error } = result
        if (success) {
            return res.status(statusCode.OK).send({
                message: 'OTP verified, account activated',
            })
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: error.message,
        })
    } catch (error) {
        next(error)
    }
}
export const loginUser = async (req, res, next) => {
    try {
        const result = await loginUserService(req.body)
        const { success, error, token } = result
        if (success) {
            return res.status(statusCode.OK).send({
                messgae: 'Logged in successfully',
                token,
            })
        }
        return res.status(statusCode.BAD_REQUEST).send({
            message: 'Fail',
            error: error.message,
        })
    } catch (error) {
        next(error)
    }
}
export const getUserProfile = async (req, res, next) => {
    try {
        const result = await getUserProfileService(req.user)
        const { success, error, user } = result
        if (success) {
            return res.status(statusCode.OK).send({
                message: 'Success',
                user,
            })
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: 'Fail',
            error: error.message,
        })
    } catch (error) {
        next(error)
    }
}
export const updateToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken
        const token = await updateTokenService(refreshToken)
        return res.status(statusCode.OK).send({
            message: 'success',
            token,
        })
    } catch (error) {
        next(error)
    }
}
export const logOut = async (req, res, next) => {
    try {
        return res.send({
            message: 'Success',
            status: 'You looged in successfully',
        })
    } catch (error) {
        next(error)
    }
}
export const forgetPassword = async (req, res, next) => {
    try {
        const result = await forgetPasswordService(req.body)
        const { success, error, forgetToken } = result
        if (!success) {
            return res.status(statusCode.BAD_REQUEST).send({
                message: 'Fail',
                error: error.message,
            })
        }
        return res.status(statusCode.OK).send({
            message: 'We send opt code for change password',
            forgetToken,
        })
    } catch (error) {
        next(error)
    }
}
export const forgetPasswordChange = async (req, res, next) => {
    try {
        const result = await forgetPasswordChangeService(req.user, req.body)
        const { success, error } = result

        if (!success) {
            return res.status(statusCode.BAD_REQUEST).send({
                message: 'fail',
                error,
            })
        }
        return res.status(statusCode.OK).send({
            message: 'password changed successfully',
        })
    } catch (error) {
        next(error)
    }
}
export const changePassword = async (req, res, next) => {
    try {
        const { success, error } = await changePasswordService(
            req.user,
            req.body,
        )
        if (success) {
            return res.status(statusCode.OK).send({
                message: 'Password updated',
            })
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: 'fail',
            error,
        })
    } catch (error) {
        next(error)
    }
}
export const createAdmin = async (req, res, next) => {
    try {
        const { success, error, admin } = await createAdminService(req.body)

        if (success) {
            return res.status(statusCode.CREATED).send({
                message: 'Created',
                admin,
            })
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: 'fail',
            error,
        })
    } catch (error) {
        next(error)
    }
}
export const deleteAdmin = async (req, res, next) => {
    try {
        const { success, error } = await deleteAdminService(req.param.id)
        if (success) {
            return res.status(statusCode.OK).send({
                message: 'delete',
            })
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: 'fail',
            error,
        })
    } catch (error) {
        next(error)
    }
}
