import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's siblings
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

  const applicantSiblings = await prisma.applicantSibling.findMany({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  res.send(applicantSiblings)
})

// POST: Add applicant's sibling
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

  const createApplicantSibling = await prisma.applicantSibling.create({
    data: {
      ...<Prisma.ApplicantSiblingUncheckedCreateInput>req.body,
      applicantId: applicant.id
    }
  })

  res.send(createApplicantSibling)
})

// GET: Find applicant's sibling by ID
router.get('/:siblingId', async (req: Request, res: Response) => {
  const applicantSibling = await prisma.applicantSibling.findFirst({
    where: {
      id: Number(req.params.siblingId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantSibling) {
    res.sendStatus(404)
    return
  }

  res.send(applicantSibling)
})

// PUT: Update applicant's sibling by ID
router.put('/:siblingId', async (req: Request, res: Response) => {
  const applicantSibling = await prisma.applicantSibling.findFirst({
    where: {
      id: Number(req.params.siblingId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantSibling) {
    res.sendStatus(404)
    return
  }

  const updateApplicantSibling = await prisma.applicantSibling.update({
    where: {
      id: applicantSibling.id
    },
    data: <Prisma.ApplicantSiblingUpdateInput>req.body
  })

  res.send(updateApplicantSibling)
})

// DELETE: Delete applicant's sibling by ID
router.delete('/:siblingId', async (req: Request, res: Response) => {
  const applicantSibling = await prisma.applicantSibling.findFirst({
    where: {
      id: Number(req.params.siblingId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantSibling) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantSibling.delete({
    where: {
      id: applicantSibling.id
    }
  })

  res.sendStatus(204)
})

export default router
