import {
    createReviewService,
    deleteReviewService,
    getAllReviewService,
    getByIReviewService,
    updateReviewService,
} from '../service/index.service.js'
import { logger } from '../utils/index.utils.js'
export const getAllReviewController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/review/ METHOD : GET')
        const currentReview = await getAllReviewService(req.pagination)
        if (!currentReview) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentReview,
        })

    } catch (error) {
        logger.error('Router /api/v1/review/all METHOD : GET')
        next(error)
    }
}
export const getByIdReviewController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/review/:id METHOD : GET')
        const currentReview = await getByIReviewService(req.params.id)
        if (!currentReview) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentReview,
        })
    } catch (error) {
        logger.error('Router /api/v1/review/:id METHOD : GET')
        next(error)
    }
}
export const createReviewController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/review/create METHOD : POST')
        const currentReview = await createReviewService(req.body)
        if (!currentReview) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentReview,
        })
    } catch (error) {
        logger.error('Router /api/v1/review/create METHOD : POST')
        next(error)
    }
}
export const updateIdReviewController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/review/update/:id METHOD : PUT')
        const currentReview = await updateReviewService(req.params.id)
        if (!currentReview) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentReview,
        })
    } catch (error) {
        logger.error('Router /api/v1/review/update/:id METHOD : PUT')
        next(error)
    }
}
export const deleteReviewController = async (req, res, next) => {
    try {
        logger.info('Router /api/v1/review/delete/:id METHOD : DELETE')
        const currentReview = await deleteReviewService(req.params.id)
        if (!currentReview) {
            return res.status(404).send('Not found!!!')
        }
        return res.status(201).send({
            message: 'Ok',
            data: currentReview,
        })
    } catch (error) {
        logger.error('Router /api/v1/review/delete/:id METHOD : DELETE')
        next(error)
    }
}
