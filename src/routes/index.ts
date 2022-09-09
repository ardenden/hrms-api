import { Request, Response, Router } from 'express'
import applicantRoutes from './applicant-routes'

const router = Router()
router.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})
router.use('/api/applicants', applicantRoutes)

export default router
