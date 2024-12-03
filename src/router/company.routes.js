import { Router } from 'express'
import {
    deleteCompanyController,
    getAllCompanyController,
    getByIdCompanyController,
    searchCompanyController,
    updateIdCompanyController,
    createCompanyController,
    getAllCompanyJobsController,
} from '../controller/index.controller.js'
import {
    checkToken,
    pagination,
    guardCheck,
    roleGuard,
} from '../middleware/index.middleware.js'

export const companyRouter = Router()

companyRouter.get(
    '/jobs/:id',
    pagination,
    checkToken,
    getAllCompanyJobsController,
)
companyRouter.get('/', checkToken, roleGuard('admin', 'superAdmin'), pagination, getAllCompanyController)
companyRouter.get('/search', checkToken, pagination, searchCompanyController)
companyRouter.get(
    '/:id',
    checkToken,
    guardCheck('admin', 'superAdmin'),
    getByIdCompanyController,
)
companyRouter.post('/', checkToken, createCompanyController)
companyRouter.put('/:id', checkToken, guardCheck('admin', 'superAdmin'), updateIdCompanyController)
companyRouter.delete('/:id', checkToken, guardCheck('admin', 'superAdmin'), deleteCompanyController)

