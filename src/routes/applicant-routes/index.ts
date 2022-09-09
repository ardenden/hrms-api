import { Router } from 'express'
import applicants from './applicants'
import applicantParents from './applicant-parents'

const router = Router()
router.use('/', applicants)
router.use('/:applicantId/parents', applicantParents)

export default router
