import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET: Fetch all applicants
router.get('/', async (_req: Request, res: Response) => {
  const applicants = await prisma.applicant.findMany()

  res.send(applicants)
})

// POST: Add new applicant
router.post('/', async (req: Request, res: Response) => {
  const createApplicant = await prisma.applicant.create({
    data: <Prisma.ApplicantCreateInput>req.body
  })

  res.send(createApplicant)
})

// GET: Find applicant by ID
router.get('/:id', async (req: Request, res: Response) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  if (!applicant) {
    res.sendStatus(404)
    return
  }

  res.send(applicant)
})

// PUT: Update applicant by ID
router.put('/:id', async (req: Request, res: Response) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  if (!applicant) {
    res.sendStatus(404)
    return
  }

  const updateApplicant = await prisma.applicant.update({
    where: {
      id: applicant.id
    },
    data: <Prisma.ApplicantUpdateInput>req.body
  })

  res.send(updateApplicant)
})

// DELETE: Delete applicant by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  if (!applicant) {
    res.sendStatus(404)
    return
  }

  await prisma.applicant.delete({
    where: {
      id: applicant.id
    }
  })

  res.sendStatus(204)
})

export default router
