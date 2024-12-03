import nodemailer from 'nodemailer'
import { config } from '../config/index.config.js'
import { logger } from '../utils/logger.utils.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
})

export const sendMail = async (to, subject, html) => {
    transporter.sendMail(
        {
            from: config.email.user,
            to,
            subject,
            html,
        },
        function (error, info) {
            if (error) {
                logger.error(error)
            } else {
                logger.info('Email sent: ' + info.response)
            }
        },
    )
}
