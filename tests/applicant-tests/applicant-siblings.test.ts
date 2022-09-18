import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantSibling, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let siblingId: number
let testApplicantSibling: ApplicantSibling

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

  describe('POST|GET /api/applicants/{applicantId}/siblings', () => {
    test('Add applicant\'s sibling', async () => {
      const createApplicantSibling: Prisma.ApplicantSiblingUncheckedCreateInput = {
        applicantId: applicantId,
        firstName: 'Karen',
        lastName: 'Griffin',
        relationship: 'Sister'
      }
      await request(app)
        .post(`/api/applicants/${applicantId}/siblings`)
        .send(createApplicantSibling)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSibling = <ApplicantSibling>response.body
          expect(applicantSibling.applicantId).toBe(applicantId)
          expect(applicantSibling.firstName).toBe('Karen')
          expect(applicantSibling.lastName).toBe('Griffin')
          expect(applicantSibling.relationship).toBe('Sister')
          expect(applicantSibling.id).toBeDefined()
          expect(applicantSibling.createdAt).toBeDefined()
          expect(applicantSibling.updatedAt).toBeDefined()
          expect(applicantSibling.middleName).toBeNull()
          expect(applicantSibling.nameExtension).toBeNull()
          expect(applicantSibling.occupation).toBeNull()
          siblingId = applicantSibling.id
          testApplicantSibling = applicantSibling
        })
    })

    test('Fetch all applicant\'s siblings', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/siblings`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSiblings = <ApplicantSibling[]>response.body
          expect(applicantSiblings).toEqual(expect.arrayContaining([testApplicantSibling]))
        })
    })
  })

  describe('GET|PUT|DELETE /api/applicants/{applicantId}/siblings/{siblingId}', () => {
    test('Find applicant\'s sibling by ID', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/siblings/${siblingId}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSibling = <ApplicantSibling>response.body
          expect(applicantSibling).toEqual(testApplicantSibling)
        })
    })

    test('Update applicant\'s sibling by ID', async () => {
      const updateApplicantSibling: Prisma.ApplicantSiblingUpdateInput = {
        firstName: 'Karen',
        lastName: 'Griffin',
        relationship: 'Sister',
        occupation: 'Pro wrestler'
      }
      await request(app)
        .put(`/api/applicants/${applicantId}/siblings/${siblingId}`)
        .send(updateApplicantSibling)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSibling = <ApplicantSibling>response.body
          expect(applicantSibling.applicantId).toBe(testApplicantSibling.applicantId)
          expect(applicantSibling.firstName).toBe('Karen')
          expect(applicantSibling.lastName).toBe('Griffin')
          expect(applicantSibling.relationship).toBe('Sister')
          expect(applicantSibling.occupation).toBe('Pro wrestler')
          expect(applicantSibling.id).toBe(testApplicantSibling.id)
          expect(applicantSibling.createdAt).toBe(testApplicantSibling.createdAt)
          expect(applicantSibling.updatedAt).not.toBe(testApplicantSibling.updatedAt)
          expect(applicantSibling.middleName).toBe(testApplicantSibling.middleName)
          expect(applicantSibling.nameExtension).toBe(testApplicantSibling.nameExtension)
        })
    })

    test('Delete applicant\'s sibling by ID', async () => {
      await request(app)
        .delete(`/api/applicants/${applicantId}/siblings/${siblingId}`)
        .then((response) => {
          expect(response.statusCode).toBe(204)
        })
    })

    test('Applicant\'s sibling not found', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/siblings/${siblingId}`)
        .then((response) => {
          expect(response.statusCode).toBe(404)
        })
    })

    test('Fetch all applicant\'s siblings (empty array)', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/siblings`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantParents = <ApplicantSibling[]>response.body
          expect(applicantParents).toEqual([])
        })
    })

    describe('DELETE /api/applicants{id}', () => {
      test('Delete applicant by ID', async () => {
        await request(app)
          .delete(`/api/applicants/${applicantId}`)
          .then((response) => {
            expect(response.statusCode).toBe(204)
          })
      })

      describe('GET /api/applicants/{applicantId}/siblings', () => {
        test('Applicant not found', async () => {
          await request(app)
            .get(`/api/applicants/${applicantId}/siblings`)
            .then((response) => {
              expect(response.statusCode).toBe(404)
            })
        })
      })
    })
  })
})
