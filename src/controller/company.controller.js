import {
    createCompanyService,
    deleteCompanyService,
    getAllCompanyService,
    getByICompanyService,
    updateCompanyService,
} from '../service/index.service.js'
import { logger } from '../utils/index.utils.js'
export const getAllCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/application/all METHOD : GET')
        const currentApplication = await getAllCompanyService()
        if (!currentApplication) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentApplication,
        })
    } catch (error) {
        logger.error('Router /api/v1/application/all METHOD : GET')
        next(error)
    }
}

export const getByIdCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/application/:id METHOD : GET')
        const currentApplication = await getByICompanyService(req.params.id)
        if (!currentApplication) {
            res.send('By/id')
        }
    } catch (error) {
        logger.error('Router /api/v1/application/:id METHOD : GET')
        next(error)
    }
}
export const createCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/application/create METHOD : POST')
        const currentApplication = await createCompanyService(req.body)
        if (!currentApplication) {
            res.send('create')
        }
    } catch (error) {
        logger.error('Router /api/v1/application/create METHOD : POST')
        next(error)
    }
}
export const updateIdCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/application/update/:id METHOD : UPDATE')
        const currentApplication = await updateCompanyService(req.params.id)
        if (!currentApplication) {
            res.send('Update')
        }
    } catch (error) {
        logger.error('Router /api/v1/application/update/:id METHOD : UPDATE')
        next(error)
    }
}
export const deleteCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/application/delete/:id METHOD : UPDATE')
        const currentApplication = await deleteCompanyService(req.params.id)
        if (!currentApplication) {
            res.send('Delete')
        }
    } catch (error) {
        logger.error('Router /api/v1/application/delete/:id METHOD : UPDATE')
        next(error)
    }
}