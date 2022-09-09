import { Router } from 'express'
import applicants from './applicants'

const router = Router()
router.use('/', applicants)

export default router
