import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's skills
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

  const applicantSkills = await prisma.applicantSkill.findMany({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  res.send(applicantSkills)
})

// POST: Add applicant's skill
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

  const createApplicantSkill = await prisma.applicantSkill.create({
    data: {
      ...<Prisma.ApplicantSkillUncheckedCreateInput>req.body,
      applicantId: applicant.id
    }
  })

  res.send(createApplicantSkill)
})

// GET: Find applicant's skill by ID
router.get('/:skillId', async (req: Request, res: Response) => {
  const applicantSkill = await prisma.applicantSkill.findFirst({
    where: {
      id: Number(req.params.skillId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantSkill) {
    res.sendStatus(404)
    return
  }

  res.send(applicantSkill)
})

// PUT: Update applicant's skill by ID
router.put('/:skillId', async (req: Request, res: Response) => {
  const applicantSkill = await prisma.applicantSkill.findFirst({
    where: {
      id: Number(req.params.skillId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantSkill) {
    res.sendStatus(404)
    return
  }

  const updateApplicantSkill = await prisma.applicantSkill.update({
    where: {
      id: applicantSkill.id
    },
    data: <Prisma.ApplicantSkillUpdateInput>req.body
  })

  res.send(updateApplicantSkill)
})

// DELETE: Delete applicant's skill by ID
router.delete('/:skillId', async (req: Request, res: Response) => {
  const applicantSkill = await prisma.applicantSkill.findFirst({
    where: {
      id: Number(req.params.skillId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantSkill) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantSkill.delete({
    where: {
      id: applicantSkill.id
    }
  })

  res.sendStatus(204)
})

export default router
