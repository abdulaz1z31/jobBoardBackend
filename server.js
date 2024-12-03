import app from './src/app.js'
import { config } from './src/config/index.config.js'
import { logger } from './src/utils/logger.utils.js'

const startApp = () => {
    try {
        app.listen(config.application.port, () => {
            logger.info(`Server running ${config.application.port} : port`)
        })
    } catch (error) {
        throw new Error(error)
    }
}

startApp()
