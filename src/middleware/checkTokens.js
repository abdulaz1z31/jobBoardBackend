import { verifyForgetToken, verifyTokens } from '../helpers/index.helpers.js'
import { logger, statusCode } from '../utils/index.utils.js'

export const checkToken = (req, res, next) => {
    try {
        const bearerToken = req.headers?.authorization

        if (!bearerToken || !bearerToken.startsWith('Bearer')) {
            return res
                .status(statusCode.UNAUTHORIZED)
                .send('Authentication is required in bearer token')
        }
        const token = bearerToken.split(' ')[1]
        const decode = verifyTokens('access', token)
        const status = decode.status
        if (status != 'active') {
            throw new Error("Account is not active");
        }
        req.user = decode
        next()
    } catch (err) {
        logger.error('Error in token verification:', err)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            error: 'Server error while verifying token',
        })
    }
}
export const checkForgetToken = (req, res, next) => {
    try {
        const bearerToken = req.headers?.authorization
        if (!bearerToken || !bearerToken.startsWith('Bearer')) {
            return res
                .status(statusCode.UNAUTHORIZED)
                .send('Authentication is required in bearer token')
        }
        const token = bearerToken.split(' ')[1]
        const decode = verifyForgetToken(token)
        
        const status = decode.status
        if (status != 'active') {
            throw new Error("Account is not active");
        }
        req.user = decode
        next()
    } catch (err) {
        logger.error('Error in token verification:', err)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            error: 'Server error while verifying token',
        })
    }
}