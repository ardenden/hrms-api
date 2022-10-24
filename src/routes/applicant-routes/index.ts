import { Router } from 'express'
import applicants from './applicants'
import applicantParents from './applicant-parents'
import applicantSiblings from './applicant-siblings'
import applicantChildren from './applicant-children'
import applicantSpouses from './applicant-spouses'
import applicantEducations from './applicant-educations'
import applicantEducationAwards from './applicant-education-awards'
import applicantExperiences from './applicant-experiences'
import applicantOrganizations from './applicant-organizations'
import applicantSkills from './applicant-skills'

const router = Router()
router.use('/', applicants)
router.use('/:applicantId/parents', applicantParents)
router.use('/:applicantId/siblings', applicantSiblings)
router.use('/:applicantId/children', applicantChildren)
router.use('/:applicantId/spouse', applicantSpouses)
router.use('/:applicantId/educations', applicantEducations)
router.use('/:applicantId/educations/:educationId/awards', applicantEducationAwards)
router.use('/:applicantId/experiences', applicantExperiences)
router.use('/:applicantId/organizations', applicantOrganizations)
router.use('/:applicantId/skills', applicantSkills)

export default router
