import {
    registerCompanyService,
    deleteCompanyService,
    getAllCompanyService,
    getByICompanyService,
    searchCompanyService,
    updateCompanyService,
} from '../service/index.service.js'
import { logger, statusCode } from '../utils/index.utils.js'
export const getAllCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/company/ METHOD : GET')
        const currentComany = await getAllCompanyService(req.pagination)
        if (!currentComany) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentComany,
        })
    } catch (error) {
        logger.error('Router /api/v1/company/all METHOD : GET')
        next(error)
    }
}
export const getByIdCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/company/:id METHOD : GET')
        const currentComany = await getByICompanyService(req.params.id)
        if (!currentComany) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentComany,
        })
    } catch (error) {
        logger.error('Router /api/v1/company/:id METHOD : GET')
        next(error)
    }
}
export const searchCompanyController = async (req, res, next) => {
    try {
        const { success, companies, error } = await searchCompanyService(
            req.query,
        )
        if (success && companies.length > 0) {
            return res.status(statusCode.OK).send({
                message: 'success',
                companies,
            })
        } else if (success) {
            return res.status(statusCode.OK).send({
                messgae: 'Companies not found with this query',
            })
        } else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send({
                message: 'fail',
                error,
            })
        }
    } catch (error) {
        next(error)
    }
}
export const createCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/company/create METHOD : POST')
        // console.log(req.user.id)
        const newCompany = await registerCompanyService(req.body, req.user.id)
        return res.status(statusCode.CREATED).send({
            msg: 'New Company',
            company_id: newCompany,
        })
    } catch (error) {
        logger.error('Router /api/v1/company/create METHOD : POST')
        next(error)
    }
}
export const updateIdCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/company/update/:id METHOD : PUT')
        const currentComany = await updateCompanyService(
            req.params.id,
            req.body,
        )
        if (!currentComany) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentComany,
        })
    } catch (error) {
        logger.error('Router /api/v1/company/update/:id METHOD : PUT')
        next(error)
    }
}
export const deleteCompanyController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/company/delete/:id METHOD : DELETE')
        const currentComany = await deleteCompanyService(req.params.id)
        if (!currentComany) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentComany,
        })
    } catch (error) {
        logger.error('Router /api/v1/company/delete/:id METHOD : DELETE')
        next(error)
    }
}
