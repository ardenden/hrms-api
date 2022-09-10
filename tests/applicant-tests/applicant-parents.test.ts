import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantParent, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let parentId: number
let testApplicantParent: ApplicantParent

describe('POST|GET /api/applicants', () => {
  test('Add new applicant', async () => {
    const createApplicant: Prisma.ApplicantCreateInput = {
      firstName: 'Justin',
      middleName: 'Peter',
      lastName: 'Griffin',
      birthDate: '1993-04-10T00:00:00.000Z',
      birthPlace: 'Quahog',
      citizenship: 'American',
      sex: 'Male',
      religion: 'Fonz',
      address: '31 Spooner Street, Quahog, Rhode Island'
    }
    await request(app)
      .post('/api/applicants')
      .send(createApplicant)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicant = <Applicant>response.body
        expect(applicant.firstName).toBe('Justin')
        expect(applicant.middleName).toBe('Peter')
        expect(applicant.lastName).toBe('Griffin')
        expect(applicant.birthDate).toBe('1993-04-10T00:00:00.000Z')
        expect(applicant.birthPlace).toBe('Quahog')
        expect(applicant.citizenship).toBe('American')
        expect(applicant.sex).toBe('Male')
        expect(applicant.religion).toBe('Fonz')
        expect(applicant.address).toBe('31 Spooner Street, Quahog, Rhode Island')
        expect(applicant.id).toBeDefined()
        expect(applicant.createdAt).toBeDefined()
        expect(applicant.updatedAt).toBeDefined()
        expect(applicant.nameExtension).toBeNull()
        expect(applicant.telephoneNo).toBeNull()
        expect(applicant.mobileNo).toBeNull()
        expect(applicant.email).toBeNull()
        applicantId = applicant.id
      })
  })
})

describe('POST|GET /api/applicants/{applicantId}/parents', () => {
  test('Applicant not found', async () => {
    await request(app)
      .get('/api/applicants/0/parents')
      .then((response) => {
        expect(response.statusCode).toBe(404)
      })
  })

  test('Add applicant\'s parent', async () => {
    const createApplicantParent: Prisma.ApplicantParentUncheckedCreateInput = {
      applicantId: applicantId,
      firstName: 'Thelma',
      lastName: 'Griffin',
      relationship: 'Mother'
    }
    await request(app)
      .post(`/api/applicants/${applicantId}/parents`)
      .send(createApplicantParent)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantParent = <ApplicantParent>response.body
        expect(applicantParent.applicantId).toBe(applicantId)
        expect(applicantParent.firstName).toBe('Thelma')
        expect(applicantParent.lastName).toBe('Griffin')
        expect(applicantParent.relationship).toBe('Mother')
        expect(applicantParent.id).toBeDefined()
        expect(applicantParent.createdAt).toBeDefined()
        expect(applicantParent.updatedAt).toBeDefined()
        expect(applicantParent.middleName).toBeNull()
        expect(applicantParent.nameExtension).toBeNull()
        expect(applicantParent.occupation).toBeNull()
        parentId = applicantParent.id
        testApplicantParent = applicantParent
      })
  })

  test('Parent not created (due to limit)', async () => {
    const createApplicantParent: Prisma.ApplicantParentUncheckedCreateInput = {
      applicantId: applicantId,
      firstName: 'Francis',
      lastName: 'Griffin',
      relationship: 'Father'
    }
    await request(app)
      .post(`/api/applicants/${applicantId}/parents`)
      .send(createApplicantParent)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantParent = <ApplicantParent>response.body
        expect(applicantParent.applicantId).toBe(applicantId)
        expect(applicantParent.firstName).toBe('Francis')
        expect(applicantParent.lastName).toBe('Griffin')
        expect(applicantParent.relationship).toBe('Father')
        expect(applicantParent.id).toBeDefined()
        expect(applicantParent.createdAt).toBeDefined()
        expect(applicantParent.updatedAt).toBeDefined()
        expect(applicantParent.middleName).toBeNull()
        expect(applicantParent.nameExtension).toBeNull()
        expect(applicantParent.occupation).toBeNull()
      })
    await request(app)
      .post(`/api/applicants/${applicantId}/parents`)
      .send(createApplicantParent)
      .then((response) => {
        expect(response.statusCode).toBe(422)
      })
  })

  test('Fetch all applicant\'s parents', async () => {
    await request(app)
      .get(`/api/applicants/${applicantId}/parents`)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantParents = <ApplicantParent[]>response.body
        expect(applicantParents).toEqual(expect.arrayContaining([testApplicantParent]))
      })
  })
})

describe('GET|PUT|DELETE /api/applicants/{applicantId}/parents/{parentId}', () => {
  test('Find applicant\'s parent by ID', async () => {
    await request(app)
      .get(`/api/applicants/${applicantId}/parents/${parentId}`)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantParent = <ApplicantParent>response.body
        expect(applicantParent).toEqual(testApplicantParent)
      })
  })

  test('Applicant\'s parent not found (Applicant not found)', async () => {
    await request(app)
      .get(`/api/applicants/0/parents/${parentId}`)
      .then((response) => {
        expect(response.statusCode).toBe(404)
      })
  })

  test('Applicant\'s parent not found (Parent not found)', async () => {
    await request(app)
      .get(`/api/applicants/${applicantId}/parents/0`)
      .then((response) => {
        expect(response.statusCode).toBe(404)
      })
  })

  test('Update applicant\'s parent by ID', async () => {
    const createApplicantParent: Prisma.ApplicantParentUncheckedCreateInput = {
      applicantId: applicantId,
      firstName: 'Thelma',
      lastName: 'Griffin',
      relationship: 'Mother',
      occupation: 'Deceased'
    }
    await request(app)
      .put(`/api/applicants/${applicantId}/parents/${parentId}`)
      .send(createApplicantParent)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantParent = <ApplicantParent>response.body
        expect(applicantParent.applicantId).toBe(applicantId)
        expect(applicantParent.firstName).toBe('Thelma')
        expect(applicantParent.lastName).toBe('Griffin')
        expect(applicantParent.relationship).toBe('Mother')
        expect(applicantParent.occupation).toBe('Deceased')
        expect(applicantParent.id).toBeDefined()
        expect(applicantParent.createdAt).toBeDefined()
        expect(applicantParent.updatedAt).toBeDefined()
        expect(applicantParent.middleName).toBeNull()
        expect(applicantParent.nameExtension).toBeNull()
      })
  })

  test('Delete applicant\'s parent by ID', async () => {
    await request(app)
      .delete(`/api/applicants/${applicantId}/parents/${parentId}`)
      .then((response) => {
        expect(response.statusCode).toBe(204)
      })
  })
})
