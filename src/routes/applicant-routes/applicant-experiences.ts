import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's experiences
router.get('/', async (req: Request, res: Response) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: Number(req.params.applicantId)
    }
  })

  if (!applicant) {
    res.sendStatus(404)
    return
  }

  const applicantExperiences = await prisma.applicantExperience.findMany({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  res.send(applicantExperiences)
})

// POST: Add applicant's experience
router.post('/', async (req: Request, res: Response) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: Number(req.params.applicantId)
    }
  })

  if (!applicant) {
    res.sendStatus(404)
    return
  }

  const reqApplicantExperience = <Prisma.ApplicantExperienceUncheckedCreateInput>req.body

  if (!reqApplicantExperience.dateTo) {
    reqApplicantExperience.isCurrent = true
  }

  if (reqApplicantExperience.isCurrent) {
    reqApplicantExperience.dateTo = null
  }

  const createApplicantExperience = await prisma.applicantExperience.create({
    data: {
      ...reqApplicantExperience,
      applicantId: applicant.id
    }
  })

  res.send(createApplicantExperience)
})

// GET: Find applicant's experience by ID
router.get('/:experienceId', async (req: Request, res: Response) => {
  const applicantExperience = await prisma.applicantExperience.findFirst({
    where: {
      id: Number(req.params.experienceId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantExperience) {
    res.sendStatus(404)
    return
  }

  res.send(applicantExperience)
})

// PUT: Update applicant's experience by ID
router.put('/:experienceId', async (req: Request, res: Response) => {
  const applicantExperience = await prisma.applicantExperience.findFirst({
    where: {
      id: Number(req.params.experienceId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantExperience) {
    res.sendStatus(404)
    return
  }

  const reqApplicantExperience = <Prisma.ApplicantExperienceUpdateInput>req.body

  if (!reqApplicantExperience.dateTo) {
    reqApplicantExperience.isCurrent = true
  } else {
    reqApplicantExperience.isCurrent = false
  }

  if (reqApplicantExperience.isCurrent) {
    reqApplicantExperience.dateTo = null
  }

  const updateApplicantExperience = await prisma.applicantExperience.update({
    where: {
      id: applicantExperience.id
    },
    data: reqApplicantExperience
  })

  res.send(updateApplicantExperience)
})

// DELETE: Delete applicant's experience by ID
router.delete('/:experienceId', async (req: Request, res: Response) => {
  const applicantExperience = await prisma.applicantExperience.findFirst({
    where: {
      id: Number(req.params.experienceId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantExperience) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantExperience.delete({
    where: {
      id: applicantExperience.id
    }
  })

  res.sendStatus(204)
})

export default router
