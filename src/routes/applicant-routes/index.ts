import { Router } from 'express'
import applicants from './applicants'
import applicantParents from './applicant-parents'
import applicantSiblings from './applicant-siblings'

const router = Router()
router.use('/', applicants)
router.use('/:applicantId/parents', applicantParents)
router.use('/:applicantId/siblings', applicantSiblings)

export default router
