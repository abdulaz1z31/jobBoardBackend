import { db } from '../database/knex.js'
import { logger } from '../utils/index.utils.js'
import { getByICompanyService } from '../service/index.service.js'
export const roleGuard = (...roles) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.role
            if (roles.includes(userRole)) {
                next()
            } else {
                logger.error('Permission Denied')
                res.status(403).send('Permission Denied')
            }
        } catch (error) {
            logger.error('Server Error')
            res.status(500).send({
                status: 'Server error',
                error,
            })
        }
    }
}
export const guardCheck = (...roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id
            const checkCompany = await getByICompanyService(req.params.id)
            const userRole = req.user.role
            if (roles.includes(userRole) || checkCompany.user_id == userId) {
                next()
            } else {
                logger.error('Permission Denied')
                res.status(403).send('Permission Denied')
            }
        } catch (error) {
            logger.error('Server Error')
            res.status(500).send({
                status: 'Server error',
                error,
            })
        }
    }
}
export const adminOrSelf = (...roles) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.role
            const id = req.params.id
            const userId = req.user?.id
            if (roles.includes(userRole) || id == userId) {
                if (userRole != 'admin' || userRole != 'superAdmin') {
                    req.body.role = userRole
                }
                next()
            } else {
                logger.error('Permission Denied')
                res.status(403).send('Permission Denied')
            }
        } catch (error) {
            logger.error('Server Error')
            res.status(500).send({
                status: 'Server error',
                error,
            })
        }
    }
}
export const isSuperAdmin = async (req, res, next) => {
    try {
        const user_id = req.params.id
        const user = await db('users').select('*').where('id', user_id)
        if (user.length == 0) {
            throw new Error('user not found')
        }
        const role = user[0].role
        if (role == 'superAdmin' && user_id != req.user.id) {
            res.status(403).send({
                message: 'You do not have access',
            })
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}
