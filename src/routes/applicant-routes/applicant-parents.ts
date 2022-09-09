import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's parents
router.get('/', async (req: Request, res: Response) => {
  const applicantParents = await prisma.applicantParent.findMany({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  res.send(applicantParents)
})

// POST: Add applicant's parent
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

  const createApplicantParent = await prisma.applicantParent.create({
    data: {
      ...<Prisma.ApplicantParentUncheckedCreateInput>req.body,
      applicantId: applicant.id
    }
  })

  res.send(createApplicantParent)
})

// GET: Find applicant's parent by ID
router.get('/:parentId', async (req: Request, res: Response) => {
  const applicantParent = await prisma.applicantParent.findFirst({
    where: {
      id: Number(req.params.parentId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantParent) {
    res.sendStatus(404)
    return
  }

  res.send(applicantParent)
})

// PUT: Update applicant's parent by ID
router.put('/:parentId', async (req: Request, res: Response) => {
  const applicantParent = await prisma.applicantParent.findFirst({
    where: {
      id: Number(req.params.parentId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantParent) {
    res.sendStatus(404)
    return
  }

  const updateApplicantParent = await prisma.applicantParent.update({
    where: {
      id: applicantParent.id
    },
    data: <Prisma.ApplicantParentUpdateInput>req.body
  })

  res.send(updateApplicantParent)
})

// DELETE: Delete applicant's parent by ID
router.delete('/:parentId', async (req: Request, res: Response) => {
  const applicantParent = await prisma.applicantParent.findFirst({
    where: {
      id: Number(req.params.parentId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantParent) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantParent.delete({
    where: {
      id: applicantParent.id
    }
  })

  res.sendStatus(204)
})

export default router
