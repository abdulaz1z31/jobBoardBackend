import { createLogger, transports, format } from 'winston'
// import { Logtail } from '@logtail/node'
// import { LogtailTransport } from '@logtail/winston'
// import { config } from '../config/index.config.js'
// const logtail = new Logtail(config.application.log_token)
export const logger = createLogger({
    level: 'silly',
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.colorize({ all: true }),
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'application.log' }),
        // new LogtailTransport(logtail),
    ],
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
})