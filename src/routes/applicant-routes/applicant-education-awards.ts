import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's education awards
router.get('/', async (req: Request, res: Response) => {
  const applicantEducation = await prisma.applicantEducation.findFirst({
    where: {
      id: Number(req.params.educationId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantEducation) {
    res.sendStatus(404)
    return
  }

  const applicantEducationAwards = await prisma.applicantEducationAward.findMany({
    where: {
      applicantEducationId: applicantEducation.id
    }
  })

  res.send(applicantEducationAwards)
})

// POST: Add applicant's education award
router.post('/', async (req: Request, res: Response) => {
  const applicantEducation = await prisma.applicantEducation.findFirst({
    where: {
      id: Number(req.params.educationId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantEducation) {
    res.sendStatus(404)
    return
  }

  const createApplicantEducationAward = await prisma.applicantEducationAward.create({
    data: {
      ...<Prisma.ApplicantEducationAwardUncheckedCreateInput>req.body,
      applicantEducationId: applicantEducation.id
    }
  })

  res.send(createApplicantEducationAward)
})

// GET: Find applicant's education award
router.get('/:awardId', async (req: Request, res: Response) => {
  const applicantEducationAward = await prisma.applicantEducationAward.findFirst({
    where: {
      id: Number(req.params.awardId),
      education: {
        id: Number(req.params.educationId),
        applicantId: Number(req.params.applicantId)
      }
    }
  })

  if (!applicantEducationAward) {
    res.sendStatus(404)
    return
  }

  res.send(applicantEducationAward)
})

// PUT: Update applicant's education award ID
router.put('/:awardId', async (req: Request, res: Response) => {
  const applicantEducationAward = await prisma.applicantEducationAward.findFirst({
    where: {
      id: Number(req.params.awardId),
      education: {
        id: Number(req.params.educationId),
        applicantId: Number(req.params.applicantId)
      }
    }
  })

  if (!applicantEducationAward) {
    res.sendStatus(404)
    return
  }

  const updateApplicantEducationAward = await prisma.applicantEducationAward.update({
    where: {
      id: applicantEducationAward.id
    },
    data: <Prisma.ApplicantEducationAwardUpdateInput>req.body
  })

  res.send(updateApplicantEducationAward)
})

// DELETE: Delete applicant's education award ID
router.delete('/:awardId', async (req: Request, res: Response) => {
  const applicantEducationAward = await prisma.applicantEducationAward.findFirst({
    where: {
      id: Number(req.params.awardId),
      education: {
        id: Number(req.params.educationId),
        applicantId: Number(req.params.applicantId)
      }
    }
  })

  if (!applicantEducationAward) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantEducationAward.delete({
    where: {
      id: applicantEducationAward.id
    }
  })

  res.sendStatus(204)
})

export default router
