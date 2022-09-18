import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's educations with awards
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

  const applicantEducations = await prisma.applicantEducation.findMany({
    where: {
      applicantId: Number(req.params.applicantId)
    },
    include: {
      awards: true
    }
  })

  res.send(applicantEducations)
})

// POST: Add applicant's education with awards
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

  const { awards, ...education } = <Prisma.ApplicantEducationUncheckedCreateInput>req.body
  const createApplicantEducation = await prisma.applicantEducation.create({
    data: {
      ...education,
      applicantId: applicant.id,
      awards: {
        createMany: {
          data: <Prisma.ApplicantEducationAwardCreateManyInput>awards
        }
      }
    },
    include: {
      awards: true
    }
  })

  res.send(createApplicantEducation)
})

// GET: Find applicant's education with awards by ID
router.get('/:educationId', async (req: Request, res: Response) => {
  const applicantEducation = await prisma.applicantEducation.findFirst({
    where: {
      id: Number(req.params.educationId),
      applicantId: Number(req.params.applicantId)
    },
    include: {
      awards: true
    }
  })

  if (!applicantEducation) {
    res.sendStatus(404)
    return
  }

  res.send(applicantEducation)
})

// PUT: Update applicant's education and awards by ID
router.put('/:educationId', async (req: Request, res: Response) => {
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

  const { awards, ...education } = <Prisma.ApplicantEducationUpdateInput>req.body
  const updateApplicantEducation = await prisma.applicantEducation.update({
    where: {
      id: applicantEducation.id
    },
    data: {
      ...education,
      awards: {
        deleteMany: {},
        createMany: {
          data: <Prisma.ApplicantEducationAwardCreateManyInput>awards
        }
      }
    },
    include: {
      awards: true
    }
  })

  res.send(updateApplicantEducation)
})

// DELETE: Delete applicant's education by ID
router.delete('/:educationId', async (req: Request, res: Response) => {
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

  await prisma.applicantEducation.delete({
    where: {
      id: applicantEducation.id
    }
  })

  res.sendStatus(204)
})

export default router
