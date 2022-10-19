import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantOrganization, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let organizationId: number
let testApplicantOrganization: ApplicantOrganization

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

  describe('POST|GET /api/applicants/{applicantId}/organizations', () => {
    test('Add applicant\'s organization', async () => {
      const createApplicantOrganization: Prisma.ApplicantOrganizationUncheckedCreateInput = {
        applicantId: applicantId,
        name: 'Peter Griffin\'s Friends',
        address: 'The Drunken Clam, Quahog, Rhode Island',
        position: 'Commander',
        dateFrom: '1999-01-01T00:00:00.000Z',
        dateTo: '2002-01-01T00:00:00.000Z'
      }
      await request(app)
        .post(`/api/applicants/${applicantId}/organizations`)
        .send(createApplicantOrganization)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantOrganization = <ApplicantOrganization>response.body
          expect(applicantOrganization.applicantId).toBe(applicantId)
          expect(applicantOrganization.name).toBe('Peter Griffin\'s Friends')
          expect(applicantOrganization.address).toBe('The Drunken Clam, Quahog, Rhode Island')
          expect(applicantOrganization.position).toBe('Commander')
          expect(applicantOrganization.dateFrom).toBe('1999-01-01T00:00:00.000Z')
          expect(applicantOrganization.dateTo).toBe('2002-01-01T00:00:00.000Z')
          expect(applicantOrganization.isCurrent).toBe(false)
          expect(applicantOrganization.id).toBeDefined()
          expect(applicantOrganization.createdAt).toBeDefined()
          expect(applicantOrganization.updatedAt).toBeDefined()
          organizationId = applicantOrganization.id
          testApplicantOrganization = applicantOrganization
        })
    })

    test('Fetch all applicant\'s organizations', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/organizations`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantOrganizations = <ApplicantOrganization[]>response.body
          expect(applicantOrganizations).toEqual(expect.arrayContaining([testApplicantOrganization]))
        })
    })
  })

  describe('GET|PUT|DELETE /api/applicants/{applicantId}/organizations/{organizationId}', () => {
    test('Find applicant\'s organization by ID', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/organizations/${organizationId}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantOrganization = <ApplicantOrganization>response.body
          expect(applicantOrganization).toEqual(testApplicantOrganization)
        })
    })

    test('Update applicant\'s organization by ID', async () => {
      const updateApplicantOrganization: Prisma.ApplicantOrganizationUpdateInput = {
        name: 'Peter Griffin\'s Friends',
        address: 'The Drunken Clam, Quahog, Rhode Island',
        position: 'Commander',
        dateFrom: '1999-01-01T00:00:00.000Z',
        isCurrent: true
      }
      await request(app)
        .put(`/api/applicants/${applicantId}/organizations/${organizationId}`)
        .send(updateApplicantOrganization)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantOrganization = <ApplicantOrganization>response.body
          expect(applicantOrganization.applicantId).toBe(testApplicantOrganization.applicantId)
          expect(applicantOrganization.name).toBe(testApplicantOrganization.name)
          expect(applicantOrganization.address).toBe(testApplicantOrganization.address)
          expect(applicantOrganization.position).toBe(testApplicantOrganization.position)
          expect(applicantOrganization.dateFrom).toBe(testApplicantOrganization.dateFrom)
          expect(applicantOrganization.dateTo).toBeNull()
          expect(applicantOrganization.isCurrent).toBe(true)
          expect(applicantOrganization.id).toBe(testApplicantOrganization.id)
          expect(applicantOrganization.createdAt).toBe(testApplicantOrganization.createdAt)
          expect(applicantOrganization.updatedAt).not.toBe(testApplicantOrganization.updatedAt)
        })
    })

    test('Delete applicant\'s organization by ID', async () => {
      await request(app)
        .delete(`/api/applicants/${applicantId}/organizations/${organizationId}`)
        .then((response) => {
          expect(response.statusCode).toBe(204)
        })
    })

    test('Applicant\'s organization not found', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/organizations/${organizationId}`)
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

      describe('GET /api/applicants/{applicantId}/organizations', () => {
        test('Applicant not found', async () => {
          await request(app)
            .get(`/api/applicants/${applicantId}/organizations`)
            .then((response) => {
              expect(response.statusCode).toBe(404)
            })
        })
      })
    })
  })
})
