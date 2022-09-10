import { Router } from 'express'
import applicants from './applicants'
import applicantParents from './applicant-parents'
import applicantSiblings from './applicant-siblings'
import applicantChildren from './applicant-children'
import applicantSpouses from './applicant-spouses'

const router = Router()
router.use('/', applicants)
router.use('/:applicantId/parents', applicantParents)
router.use('/:applicantId/siblings', applicantSiblings)
router.use('/:applicantId/children', applicantChildren)
router.use('/:applicantId/spouse', applicantSpouses)

export default router
