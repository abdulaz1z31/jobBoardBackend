import jwt from 'jsonwebtoken'
import { config } from '../config/index.config.js'

export const createTokens = async (payload) => {
    const accessToken = jwt.sign(payload, config.jwtKey.accessSecret, {
        expiresIn: config.jwtKey.accessTime,
    })
    const refreshToken = jwt.sign(payload, config.jwtKey.refreshSecret, {
        expiresIn: config.jwtKey.refreshTime,
    })
    return { accessToken, refreshToken }
}

export const verifyTokens = (type, token) => {
    const data = jwt.verify(
        token,
        type == 'access' ? config.jwtKey.accessSecret : config.jwtKey.refreshSecret,
    )
    return data
}
