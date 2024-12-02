import nodemailer from 'nodemailer'
import { config } from '../config/index.config.js'

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
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        },
    )
}
