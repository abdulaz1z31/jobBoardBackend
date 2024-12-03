import { Router } from 'express'
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    searchUser,
    updateUserById,
} from '../controller/index.controller.js'
import {
    adminOrSelf,
    checkToken,
    isSuperAdmin,
    pagination,
    roleGuard,
} from '../middleware/index.middleware.js'

export const userRouter = Router()

userRouter.get('/', checkToken, roleGuard('admin', 'superAdmin'), pagination, getAllUsers)
userRouter.get(
    '/search',
    checkToken,
    roleGuard('admin', 'superAdmin'),
    pagination,
    searchUser,
)
userRouter.get('/:id', checkToken, adminOrSelf('admin'),isSuperAdmin, getUserById)
userRouter.put('/:id', checkToken, adminOrSelf('admin'), isSuperAdmin, updateUserById)
userRouter.delete('/:id', checkToken, adminOrSelf('admin'),isSuperAdmin, deleteUserById)
