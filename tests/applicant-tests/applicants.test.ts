import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let id: number
let testApplicant: Applicant

describe('POST|GET /api/applicants', () => {
  test('Add new applicant', async () => {
    const createApplicant: Prisma.ApplicantCreateInput = {
      firstName: 'Lois Patrice',
      middleName: 'Pewterschmidt',
      lastName: 'Griffin',
      birthDate: '1958-06-03T00:00:00.000Z',
      birthPlace: 'Quahog',
      citizenship: 'American',
      sex: 'Female',
      religion: 'Protestant',
      address: '31 Spooner Street, Quahog, Rhode Island'
    }
    await request(app)
      .post('/api/applicants')
      .send(createApplicant)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicant = <Applicant>response.body
        expect(applicant.firstName).toBe('Lois Patrice')
        expect(applicant.middleName).toBe('Pewterschmidt')
        expect(applicant.lastName).toBe('Griffin')
        expect(applicant.birthDate).toBe('1958-06-03T00:00:00.000Z')
        expect(applicant.birthPlace).toBe('Quahog')
        expect(applicant.citizenship).toBe('American')
        expect(applicant.sex).toBe('Female')
        expect(applicant.religion).toBe('Protestant')
        expect(applicant.address).toBe('31 Spooner Street, Quahog, Rhode Island')
        expect(applicant.id).toBeDefined()
        expect(applicant.createdAt).toBeDefined()
        expect(applicant.updatedAt).toBeDefined()
        expect(applicant.nameExtension).toBeNull()
        expect(applicant.telephoneNo).toBeNull()
        expect(applicant.mobileNo).toBeNull()
        expect(applicant.email).toBeNull()
        id = applicant.id
        testApplicant = applicant
      })
  })

  test('Fetch all applicants', async () => {
    await request(app)
      .get('/api/applicants')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicants = <Applicant[]>response.body
        expect(applicants).toEqual(expect.arrayContaining([testApplicant]))
      })
  })
})

describe('GET|PUT|DELETE /api/applicants/{id}', () => {
  test('Find applicant by ID', async () => {
    await request(app)
      .get(`/api/applicants/${id}`)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicant = <Applicant>response.body
        expect(applicant).toEqual(testApplicant)
      })
  })

  test('Update applicant by ID', async () => {
    const updateApplicant: Prisma.ApplicantUpdateInput = {
      firstName: 'Lois Patrice',
      middleName: 'Pewterschmidt',
      lastName: 'Quagmire',
      birthDate: '1993-06-03T00:00:00.000Z',
      birthPlace: 'Quahog',
      citizenship: 'American',
      sex: 'Female',
      religion: 'Judaism',
      address: '31 Spooner Street, Quahog, Rhode Island'
    }
    await request(app)
      .put(`/api/applicants/${id}`)
      .send(updateApplicant)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        const applicant = <Applicant>response.body
        expect(applicant.firstName).toBe('Lois Patrice')
        expect(applicant.middleName).toBe('Pewterschmidt')
        expect(applicant.lastName).toBe('Quagmire')
        expect(applicant.birthDate).toBe('1993-06-03T00:00:00.000Z')
        expect(applicant.birthPlace).toBe('Quahog')
        expect(applicant.citizenship).toBe('American')
        expect(applicant.sex).toBe('Female')
        expect(applicant.religion).toBe('Judaism')
        expect(applicant.address).toBe('31 Spooner Street, Quahog, Rhode Island')
        expect(applicant.id).toBe(testApplicant.id)
        expect(applicant.createdAt).toBe(testApplicant.createdAt)
        expect(applicant.updatedAt).not.toBe(testApplicant.updatedAt)
        expect(applicant.nameExtension).toBe(testApplicant.nameExtension)
        expect(applicant.telephoneNo).toBe(testApplicant.telephoneNo)
        expect(applicant.mobileNo).toBe(testApplicant.mobileNo)
        expect(applicant.email).toBe(testApplicant.email)
      })
  })

  test('Delete applicant by ID', async () => {
    await request(app)
      .delete(`/api/applicants/${id}`)
      .then((response) => {
        expect(response.statusCode).toBe(204)
      })
  })

  test('Applicant not found', async () => {
    await request(app)
      .get(`/api/applicants/${id}`)
      .then((response) => {
        expect(response.statusCode).toBe(404)
      })
  })
})
