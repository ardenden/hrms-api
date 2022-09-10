import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch applicant's spouse
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

  const applicantSpouse = await prisma.applicantSpouse.findUnique({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  res.send(applicantSpouse)
})

// PUT: Update or add applicant's spouse
router.put('/', async (req: Request, res: Response) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: Number(req.params.applicantId)
    }
  })

  if (!applicant) {
    res.sendStatus(404)
    return
  }

  const upsertApplicantSpouse = await prisma.applicantSpouse.upsert({
    where: {
      applicantId: applicant.id
    },
    update: <Prisma.ApplicantSpouseUpdateInput>req.body,
    create: {
      ...<Prisma.ApplicantSpouseUncheckedCreateInput>req.body,
      applicantId: applicant.id
    }
  })

  res.send(upsertApplicantSpouse)
})

// DELETE: Delete applicant's spouse
router.delete('/', async (req: Request, res: Response) => {
  const applicantSpouse = await prisma.applicantSpouse.findUnique({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantSpouse) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantSpouse.delete({
    where: {
      id: applicantSpouse.id
    }
  })

  res.sendStatus(204)
})

export default router
