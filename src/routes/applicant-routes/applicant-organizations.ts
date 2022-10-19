import { Request, Response, Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router({ mergeParams: true })
const prisma = new PrismaClient()

// GET: Fetch all applicant's organizations
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

  const applicantOrganizations = await prisma.applicantOrganization.findMany({
    where: {
      applicantId: Number(req.params.applicantId)
    }
  })

  res.send(applicantOrganizations)
})

// POST: Add applicant's organization
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

  const reqApplicantOrganization = <Prisma.ApplicantOrganizationUncheckedCreateInput>req.body

  if (!reqApplicantOrganization.dateTo) {
    reqApplicantOrganization.isCurrent = true
  }

  if (reqApplicantOrganization.isCurrent) {
    reqApplicantOrganization.dateTo = null
  }

  const createApplicantOrganization = await prisma.applicantOrganization.create({
    data: {
      ...reqApplicantOrganization,
      applicantId: applicant.id
    }
  })

  res.send(createApplicantOrganization)
})

// GET: Find applicant's organization by ID
router.get('/:organizationId', async (req: Request, res: Response) => {
  const applicantOrganization = await prisma.applicantOrganization.findFirst({
    where: {
      id: Number(req.params.organizationId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantOrganization) {
    res.sendStatus(404)
    return
  }

  res.send(applicantOrganization)
})

// PUT: Update applicant's organization by ID
router.put('/:organizationId', async (req: Request, res: Response) => {
  const applicantOrganization = await prisma.applicantOrganization.findFirst({
    where: {
      id: Number(req.params.organizationId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantOrganization) {
    res.sendStatus(404)
    return
  }

  const reqApplicantOrganization = <Prisma.ApplicantOrganizationUpdateInput>req.body

  if (!reqApplicantOrganization.dateTo) {
    reqApplicantOrganization.isCurrent = true
  } else {
    reqApplicantOrganization.isCurrent = false
  }

  if (reqApplicantOrganization.isCurrent) {
    reqApplicantOrganization.dateTo = null
  }

  const updateApplicantOrganization = await prisma.applicantOrganization.update({
    where: {
      id: applicantOrganization.id
    },
    data: reqApplicantOrganization
  })

  res.send(updateApplicantOrganization)
})

// DELETE: Delete applicant's organization by ID
router.delete('/:organizationId', async (req: Request, res: Response) => {
  const applicantOrganization = await prisma.applicantOrganization.findFirst({
    where: {
      id: Number(req.params.organizationId),
      applicantId: Number(req.params.applicantId)
    }
  })

  if (!applicantOrganization) {
    res.sendStatus(404)
    return
  }

  await prisma.applicantOrganization.delete({
    where: {
      id: applicantOrganization.id
    }
  })

  res.sendStatus(204)
})

export default router
