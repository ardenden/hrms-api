import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's children
router.get('/', async (req: Request, res: Response) => {
  const applicantChildren = await prisma.applicantChild.findMany({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  res.send(applicantChildren)
})

// POST: Add applicant's child
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

  const createApplicantChild = await prisma.applicantChild.create({
    data: {
      ...<Prisma.ApplicantChildUncheckedCreateInput>req.body,
      applicantId: applicant.id
    }
  })

  res.send(createApplicantChild)
})

// GET: Find applicant's child by ID
router.get('/:childId', async (req: Request, res: Response) => {
  const applicantChild = await prisma.applicantChild.findFirst({
    where: {
      id: Number(req.params.childId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantChild) {
    res.sendStatus(404)
    return
  }

  res.send(applicantChild)
})

// PUT: Update applicant's child by ID
router.put('/:childId', async (req: Request, res: Response) => {
  const applicantChild = await prisma.applicantChild.findFirst({
    where: {
      id: Number(req.params.childId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantChild) {
    res.sendStatus(404)
    return
  }

  const updateApplicantChild = await prisma.applicantChild.update({
    where: {
      id: applicantChild.id
    },
    data: <Prisma.ApplicantChildUpdateInput>req.body
  })

  res.send(updateApplicantChild)
})

// DELETE: Delete applicant's child by ID
router.delete('/:childId', async (req: Request, res: Response) => {
  const applicantChild = await prisma.applicantChild.findFirst({
    where: {
      id: Number(req.params.childId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantChild) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantChild.delete({
    where: {
      id: applicantChild.id
    }
  })

  res.sendStatus(204)
})

export default router
