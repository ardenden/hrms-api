import { Router } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import swaggerDefinition from '../index'

const router = Router()
swaggerDefinition.info.description = 'Applicants Docs'
const options = {
  swaggerDefinition,
  apis: ['swagger/applicant-defs/*.yaml'],
}
const swaggerDoc = swaggerJsdoc(options)
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  customSiteTitle: 'Applicants'
}))

export default router
