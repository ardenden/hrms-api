import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantExperience, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let experienceId: number
let testApplicantExperience: ApplicantExperience

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

  describe('POST|GET /api/applicants/{applicantId}/experiences', () => {
    test('Add applicant\'s experience', async () => {
      const createApplicantExperience: Prisma.ApplicantExperienceUncheckedCreateInput = {
        applicantId: applicantId,
        company: 'Happy-Go-Lucky Toy Factory',
        address: 'Quahog, Rhode Island',
        position: 'Safety Inspector',
        salaryAmount: 40000,
        salaryPeriod: 'year',
        dateFrom: '1999-01-01T00:00:00.000Z',
        isCurrent: true
      }
      await request(app)
        .post(`/api/applicants/${applicantId}/experiences`)
        .send(createApplicantExperience)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantExperience = <ApplicantExperience>response.body
          expect(applicantExperience.applicantId).toBe(applicantId)
          expect(applicantExperience.company).toBe('Happy-Go-Lucky Toy Factory')
          expect(applicantExperience.address).toBe('Quahog, Rhode Island')
          expect(applicantExperience.position).toBe('Safety Inspector')
          expect(applicantExperience.salaryAmount).toBe('40000')
          expect(applicantExperience.salaryPeriod).toBe('year')
          expect(applicantExperience.dateFrom).toBe('1999-01-01T00:00:00.000Z')
          expect(applicantExperience.dateTo).toBeNull()
          expect(applicantExperience.isCurrent).toBe(true)
          expect(applicantExperience.id).toBeDefined()
          expect(applicantExperience.createdAt).toBeDefined()
          expect(applicantExperience.updatedAt).toBeDefined()
          experienceId = applicantExperience.id
          testApplicantExperience = applicantExperience
        })
    })

    test('Fetch all applicant\'s experiences', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/experiences`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantExperiences = <ApplicantExperience[]>response.body
          expect(applicantExperiences).toEqual(expect.arrayContaining([testApplicantExperience]))
        })
    })
  })

  describe('GET|PUT|DELETE /api/applicants/{applicantId}/experiences/{experienceId}', () => {
    test('Find applicant\'s experience by ID', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/experiences/${experienceId}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantExperience = <ApplicantExperience>response.body
          expect(applicantExperience).toEqual(testApplicantExperience)
        })
    })

    test('Update applicant\'s experience by ID', async () => {
      const updateApplicantExperience: Prisma.ApplicantExperienceUpdateInput = {
        company: 'Happy-Go-Lucky Toy Factory',
        address: 'Quahog, Rhode Island',
        position: 'Safety Inspector',
        salaryAmount: 40000,
        salaryPeriod: 'year',
        dateFrom: '1999-01-01T00:00:00.000Z',
        dateTo: '2005-01-01T00:00:00.000Z'
      }
      await request(app)
        .put(`/api/applicants/${applicantId}/experiences/${experienceId}`)
        .send(updateApplicantExperience)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantExperience = <ApplicantExperience>response.body
          expect(applicantExperience.applicantId).toBe(testApplicantExperience.applicantId)
          expect(applicantExperience.company).toBe(testApplicantExperience.company)
          expect(applicantExperience.address).toBe(testApplicantExperience.address)
          expect(applicantExperience.position).toBe(testApplicantExperience.position)
          expect(applicantExperience.salaryAmount).toBe(testApplicantExperience.salaryAmount)
          expect(applicantExperience.salaryPeriod).toBe(testApplicantExperience.salaryPeriod)
          expect(applicantExperience.dateFrom).toBe(testApplicantExperience.dateFrom)
          expect(applicantExperience.dateTo).toBe('2005-01-01T00:00:00.000Z')
          expect(applicantExperience.isCurrent).toBe(false)
          expect(applicantExperience.id).toBe(testApplicantExperience.id)
          expect(applicantExperience.createdAt).toBe(testApplicantExperience.createdAt)
          expect(applicantExperience.updatedAt).not.toBe(testApplicantExperience.updatedAt)
        })
    })

    test('Delete applicant\'s experience by ID', async () => {
      await request(app)
        .delete(`/api/applicants/${applicantId}/experiences/${experienceId}`)
        .then((response) => {
          expect(response.statusCode).toBe(204)
        })
    })

    test('Applicant\'s experience not found', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/experiences/${experienceId}`)
        .then((response) => {
          expect(response.statusCode).toBe(404)
        })
    })

    describe('DELETE /api/applicants/{id}', () => {
      test('Delete applicant by ID', async () => {
        await request(app)
          .delete(`/api/applicants/${applicantId}`)
          .then((response) => {
            expect(response.statusCode).toBe(204)
          })
      })

      describe('GET /api/applicants/{applicantId}/experiences', () => {
        test('Applicant not found', async () => {
          await request(app)
            .get(`/api/applicants/${applicantId}/experiences`)
            .then((response) => {
              expect(response.statusCode).toBe(404)
            })
        })
      })
    })
  })
})
