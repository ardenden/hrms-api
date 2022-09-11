import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import routes from './routes'
import swaggerRoutes from '../swagger/routes'

const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(compression())
app.disable('x-powered-by')
app.use(routes)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  app.use(swaggerRoutes)
}

const host = process.env.HOST || 'http://localhost'
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`App listening at ${host}:${port}`))
