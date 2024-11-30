import {
    getAllWishlistsService,
    getWishlistByIdService,
    createWishlistService,
    updateWishlistService,
    deleteWishlistService,
} from '../service/index.service.js'
import { logger, statusCode } from '../utils/index.utils.js'
export const getAllWishlistsCon = async (req, res, next) => {
    try {
        logger.info(`Routes: /api/v1/wishlist METHOD: GET`)
        const wishlists = await getAllWishlistsService()
        res.status(statusCode.OK).send({
            msg: 'OK',
            Wishlists: wishlists,
        })
    } catch (error) {
        logger.error(
            `Routes: /api/v1/wishlist METHOD: GET,Error: ${error.message}`,
        )
        next(error.message)
    }
}
export const getWishlistsByIdCon = async (req, res, next) => {
    try {
        logger.info(`Routes: /api/v1/wishlist/${req.params.id} METHOD: GET`)
        const wishlist = await getWishlistByIdService(req.params.id)
        res.status(statusCode.OK).send({
            msg: 'OK',
            Wishlist: wishlist,
        })
    } catch (error) {
        logger.error(
            `Routes: /api/v1/wishlist/${req.params.id} METHOD: GET,Error: ${error.message}`,
        )
        next(error.message)
    }
}
export const createWishlistCon = async (req, res, next) => {
    try {
        logger.info(`Routes: /api/v1/wishlist METHOD: POST`)
        const newWishlist = await createWishlistService(req.body)
        res.status(statusCode.CREATED).send({
            msg: 'NEW WISHLIST',
            newWishlist: newWishlist,
        })
    } catch (error) {
        logger.error(
            `Routes: /api/v1/wishlist METHOD: POST,Error: ${error.message}`,
        )
        next(error.message)
    }
}
export const updateWishlistCon = async (req, res, next) => {
    try {
        logger.info(`Routes: /api/v1/wishlist/${req.params.id} METHOD: PUT`)
        const updatedWishlist = await updateWishlistService(
            req.params.id,
            req.body,
        )
        res.status(statusCode.OK).send({
            msg: 'UPDATED WISHLIST',
            updatedWishlist: updatedWishlist,
        })
    } catch (error) {
        logger.error(
            `Routes: /api/v1/wishlist/${req.params.id} METHOD: PUT,Error: ${error.message}`,
        )
        next(error.message)
    }
}
export const deleteWishlistCon = async (req, res, next) => {
    try {
        logger.info(`Routes: /api/v1/wishlist/${req.params.id} METHOD: DELETE`)
        const deletedWishlist = await deleteWishlistService(req.params.id)
        res.status(statusCode.OK).send({
            msg: 'DELETED WISHLIST',
            deletedWishlist: deletedWishlist,
        })
    } catch (error) {
        logger.error(
            `Routes: /api/v1/wishlist/${req.params.id} METHOD: DELETE,Error: ${error.message}`,
        )
        next(error.message)
    }
}