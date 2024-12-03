import { Router } from 'express'
import {
    deleteCompanyController,
    getAllCompanyController,
    getByIdCompanyController,
    searchCompanyController,
    updateIdCompanyController,
    createCompanyController,
} from '../controller/index.controller.js'
import {
    checkToken,
    pagination,
    guardCheck,
} from '../middleware/index.middleware.js'

export const companyRouter = Router()

companyRouter.get('/', checkToken, pagination, getAllCompanyController)
companyRouter.get('/search', checkToken, pagination, searchCompanyController)
companyRouter.get(
    '/:id',
    checkToken,
    guardCheck('admin'),
    getByIdCompanyController,
)
companyRouter.post('/', checkToken, createCompanyController)
companyRouter.put('/:id', checkToken, updateIdCompanyController)
companyRouter.delete('/:id', checkToken, deleteCompanyController)
// company
