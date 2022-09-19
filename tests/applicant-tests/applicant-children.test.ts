import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantChild, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let childId: number
let testApplicantChild: ApplicantChild

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

  describe('POST|GET /api/applicants/{applicantId}/children', () => {
    test('Add applicant\'s child', async () => {
      const createApplicantChild: Prisma.ApplicantChildUncheckedCreateInput = {
        applicantId: applicantId,
        firstName: 'Megan',
        lastName: 'Griffin',
        relationship: 'Daughter'
      }
      await request(app)
        .post(`/api/applicants/${applicantId}/children`)
        .send(createApplicantChild)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantChild = <ApplicantChild>response.body
          expect(applicantChild.applicantId).toBe(applicantId)
          expect(applicantChild.firstName).toBe('Megan')
          expect(applicantChild.lastName).toBe('Griffin')
          expect(applicantChild.relationship).toBe('Daughter')
          expect(applicantChild.id).toBeDefined()
          expect(applicantChild.createdAt).toBeDefined()
          expect(applicantChild.updatedAt).toBeDefined()
          expect(applicantChild.middleName).toBeNull()
          expect(applicantChild.nameExtension).toBeNull()
          expect(applicantChild.occupation).toBeNull()
          childId = applicantChild.id
          testApplicantChild = applicantChild
        })
    })

    test('Fetch all applicant\'s children', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/children`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantChildren = <ApplicantChild[]>response.body
          expect(applicantChildren).toEqual(expect.arrayContaining([testApplicantChild]))
        })
    })
  })

  describe('GET|PUT|DELETE /api/applicants/{applicantId}/children/{childId}', () => {
    test('Find applicant\'s child by ID', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/children/${childId}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantChild = <ApplicantChild>response.body
          expect(applicantChild).toEqual(testApplicantChild)
        })
    })

    test('Update applicant\'s child by ID', async () => {
      const updateApplicantChild: Prisma.ApplicantChildUpdateInput = {
        firstName: 'Megatron',
        middleName: 'Harvey Oswald',
        lastName: 'Griffin',
        relationship: 'Daughter',
        occupation: 'Student'
      }
      await request(app)
        .put(`/api/applicants/${applicantId}/children/${childId}`)
        .send(updateApplicantChild)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantChild = <ApplicantChild>response.body
          expect(applicantChild.applicantId).toBe(testApplicantChild.applicantId)
          expect(applicantChild.firstName).toBe('Megatron')
          expect(applicantChild.middleName).toBe('Harvey Oswald')
          expect(applicantChild.lastName).toBe('Griffin')
          expect(applicantChild.relationship).toBe('Daughter')
          expect(applicantChild.occupation).toBe('Student')
          expect(applicantChild.id).toBe(testApplicantChild.id)
          expect(applicantChild.createdAt).toBe(testApplicantChild.createdAt)
          expect(applicantChild.updatedAt).not.toBe(testApplicantChild.updatedAt)
          expect(applicantChild.nameExtension).toBe(testApplicantChild.nameExtension)
        })
    })

    test('Delete applicant\'s child by ID', async () => {
      await request(app)
        .delete(`/api/applicants/${applicantId}/children/${childId}`)
        .then((response) => {
          expect(response.statusCode).toBe(204)
        })
    })

    test('Applicant\'s child not found', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/children/${childId}`)
        .then((response) => {
          expect(response.statusCode).toBe(404)
        })
    })

    describe('GET /api/applicants/{id}/children', () => {
      test('Fetch all applicant\'s child (empty array)', async () => {
        await request(app)
          .get(`/api/applicants/${applicantId}/children`)
          .then((response) => {
            expect(response.statusCode).toBe(200)
            const applicantParents = <ApplicantChild[]>response.body
            expect(applicantParents).toEqual([])
          })
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

      describe('GET /api/applicants/{applicantId}/children', () => {
        test('Applicant not found', async () => {
          await request(app)
            .get(`/api/applicants/${applicantId}/children`)
            .then((response) => {
              expect(response.statusCode).toBe(404)
            })
        })
      })
    })
  })
})
