import express from 'express'
import morgan from 'morgan'
import { router } from './router/index.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api/v1', router)

app.use((req, res) => {
    return res.status(404).send({
        message: 'Not Found',
    })
})
app.use((error, req, res, next) => {
    if (error) {
        return res.status(500).send({
            error: error,
        })
    }
})
export default app
