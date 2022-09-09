import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import routes from './routes'
import swaggerDefinition from '../swagger'

const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(compression())
app.disable('x-powered-by')
app.use(routes)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  const swaggerJsdoc = require('swagger-jsdoc')
  const swaggerUi = require('swagger-ui-express')
  const options = {
    swaggerDefinition,
    apis: ['swagger/**/*.yaml'],
  }
  const swaggerDoc = swaggerJsdoc(options)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
}

const host = process.env.HOST || 'http://localhost'
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`App listening at ${host}:${port}`))
