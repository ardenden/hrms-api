import { Router } from 'express'
import applicants from './applicants'

const router = Router()
router.use('/docs/applicants', applicants)

export default router
