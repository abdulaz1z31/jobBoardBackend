import express from 'express'
import morgan from 'morgan'
import { router } from './router/index.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api/v1', router)

export default app
