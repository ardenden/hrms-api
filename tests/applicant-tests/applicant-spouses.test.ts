import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantSpouse, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let testApplicantSpouse: ApplicantSpouse

describe('POST /api/applicants', () => {
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

describe('GET|PUT|DELETE /api/applicants/{applicantId}/spouse', () => {
  test('Applicant not found', async () => {
    await request(app)
      .get('/api/applicants/0/spouse')
      .then((response) => {
        expect(response.statusCode).toBe(404)
      })
  })

  test('Fetch applicant\'s spouse (No data)', async () => {
    await request(app)
      .get(`/api/applicants/${applicantId}/spouse`)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantSpouse = <ApplicantSpouse>response.body
        expect(applicantSpouse).toEqual({})
      })
  })

  test('Add applicant\'s spouse', async () => {
    const createApplicantSpouse: Prisma.ApplicantSpouseUncheckedCreateInput | Prisma.ApplicantSpouseUpdateInput = {
      firstName: 'Lois',
      lastName: 'Griffin',
      relationship: 'Wife'
    }
    await request(app)
      .put(`/api/applicants/${applicantId}/spouse`)
      .send(createApplicantSpouse)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantSpouse = <ApplicantSpouse>response.body
        expect(applicantSpouse.applicantId).toBe(applicantId)
        expect(applicantSpouse.firstName).toBe('Lois')
        expect(applicantSpouse.lastName).toBe('Griffin')
        expect(applicantSpouse.relationship).toBe('Wife')
        expect(applicantSpouse.id).toBeDefined()
        expect(applicantSpouse.createdAt).toBeDefined()
        expect(applicantSpouse.updatedAt).toBeDefined()
        expect(applicantSpouse.middleName).toBeNull()
        expect(applicantSpouse.nameExtension).toBeNull()
        expect(applicantSpouse.occupation).toBeNull()
        testApplicantSpouse = applicantSpouse
      })
  })

  test('Fetch applicant\'s spouse (With data)', async () => {
    await request(app)
      .get(`/api/applicants/${applicantId}/spouse`)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantSpouse = <ApplicantSpouse>response.body
        expect(applicantSpouse).toEqual(testApplicantSpouse)
      })
  })

  test('Update applicant\'s spouse', async () => {
    const updateApplicantSpouse: Prisma.ApplicantSpouseUncheckedCreateInput | Prisma.ApplicantSpouseUpdateInput = {
      firstName: 'Lois Patrice',
      lastName: 'Griffin',
      relationship: 'Wife',
      occupation: 'N/A'
    }
    await request(app)
      .put(`/api/applicants/${applicantId}/spouse`)
      .send(updateApplicantSpouse)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantSpouse = <ApplicantSpouse>response.body
        expect(applicantSpouse.applicantId).toBe(applicantId)
        expect(applicantSpouse.id).toBe(testApplicantSpouse.id)
        expect(applicantSpouse.firstName).toBe('Lois Patrice')
        expect(applicantSpouse.lastName).toBe('Griffin')
        expect(applicantSpouse.relationship).toBe('Wife')
        expect(applicantSpouse.occupation).toBe('N/A')
        expect(applicantSpouse.updatedAt).not.toBe(testApplicantSpouse.updatedAt)
        expect(applicantSpouse.createdAt).toBeDefined()
        expect(applicantSpouse.middleName).toBeNull()
        expect(applicantSpouse.nameExtension).toBeNull()
      })
  })

  test('Delete applicant\'s spouse', async () => {
    await request(app)
      .delete(`/api/applicants/${applicantId}/spouse`)
      .then((response) => {
        expect(response.statusCode).toBe(204)
      })
  })

  test('Fetch applicant\'s spouse after delete (No data)', async () => {
    await request(app)
      .get(`/api/applicants/${applicantId}/spouse`)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicantSpouse = <ApplicantSpouse>response.body
        expect(applicantSpouse).toEqual({})
      })
  })
})
