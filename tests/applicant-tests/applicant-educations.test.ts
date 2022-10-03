import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantEducation, ApplicantEducationAward, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let educationId: number
let testApplicantEducation: ApplicantEducation & {
  awards: ApplicantEducationAward[]
}

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

  describe('POST|GET /api/applicants/{applicantId}/educations', () => {
    test('Add applicant\'s education with awards', async () => {
      const applicantEducation: Prisma.ApplicantEducationUncheckedCreateInput = {
        applicantId: applicantId,
        level: 'College',
        school: 'Quahog College',
        address: 'Quahog, Rhode Island',
        yearFrom: '2014',
        yearTo: 'Did not graduate',
        course: null
      }
      const applicantEducationAwards: Pick<Prisma.ApplicantEducationAwardCreateManyInput, 'name'>[] = [
        {
          name: 'Petarded'
        }
      ]
      const createApplicantEducation = {
        ...applicantEducation,
        awards: applicantEducationAwards
      }
      await request(app)
        .post(`/api/applicants/${applicantId}/educations`)
        .send(createApplicantEducation)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantEducation = <ApplicantEducation & {
            awards: ApplicantEducationAward[]
          }>response.body
          expect(applicantEducation.applicantId).toBe(applicantId)
          expect(applicantEducation.level).toBe('College')
          expect(applicantEducation.school).toBe('Quahog College')
          expect(applicantEducation.address).toBe('Quahog, Rhode Island')
          expect(applicantEducation.yearFrom).toBe('2014')
          expect(applicantEducation.yearTo).toBe('Did not graduate')
          expect(applicantEducation.id).toBeDefined()
          expect(applicantEducation.course).toBeNull()
          expect(applicantEducation.createdAt).toBeDefined()
          expect(applicantEducation.updatedAt).toBeDefined()
          expect(applicantEducation.awards.length).toBe(1)
          expect(applicantEducation.awards[0]).toEqual(expect.objectContaining({
            applicantEducationId: applicantEducation.id,
            name: 'Petarded'
          }))
          expect(applicantEducation.awards[0].id).toBeDefined()
          expect(applicantEducation.awards[0].createdAt).toBeDefined()
          expect(applicantEducation.awards[0].updatedAt).toBeDefined()
          educationId = applicantEducation.id
          testApplicantEducation = applicantEducation
        })
    })

    test('Fetch all applicant\'s educations with awards', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/educations`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantEducations = <ApplicantEducation & {
            awards: ApplicantEducationAward[]
          }[]>response.body
          expect(applicantEducations).toEqual(expect.arrayContaining([testApplicantEducation]))
        })
    })
  })

  describe('GET|PUT|DELETE /api/applicants/{applicantId}/educations/{educationId}', () => {
    test('Find applicant\'s education with awards by ID', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/educations/${educationId}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantEducation = <ApplicantEducation & {
            awards: ApplicantEducationAward[]
          }>response.body
          expect(applicantEducation).toEqual(testApplicantEducation)
        })
    })

    test('Update applicant\'s education and awards by ID', async () => {
      const applicantEducation: Prisma.ApplicantEducationUpdateInput = {
        level: 'College',
        school: 'Quahog College',
        address: 'Quahog, Rhode Island',
        yearFrom: '2014',
        yearTo: '2014',
        course: 'Super Bowl'
      }
      const applicantEducationAwards: Pick<Prisma.ApplicantEducationAwardCreateManyInput, 'name'>[] = [
        {
          name: '3 Acts of God'
        },
        {
          name: 'The Drunken Clam'
        }
      ]
      const updateApplicantEducation = {
        ...applicantEducation,
        awards: applicantEducationAwards
      }
      await request(app)
        .put(`/api/applicants/${applicantId}/educations/${educationId}`)
        .send(updateApplicantEducation)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantEducation = <ApplicantEducation & {
            awards: ApplicantEducationAward[]
          }>response.body
          expect(applicantEducation.applicantId).toBe(testApplicantEducation.applicantId)
          expect(applicantEducation.id).toBe(testApplicantEducation.id)
          expect(applicantEducation.level).toBe('College')
          expect(applicantEducation.school).toBe('Quahog College')
          expect(applicantEducation.address).toBe('Quahog, Rhode Island')
          expect(applicantEducation.yearFrom).toBe('2014')
          expect(applicantEducation.yearTo).toBe('2014')
          expect(applicantEducation.course).toBe('Super Bowl')
          expect(applicantEducation.createdAt).toBe(testApplicantEducation.createdAt)
          expect(applicantEducation.updatedAt).not.toBe(testApplicantEducation.updatedAt)
          expect(applicantEducation.awards.length).not.toBe(testApplicantEducation.awards.length)
          expect(applicantEducation.awards).not.toEqual(expect.arrayContaining(testApplicantEducation.awards))
          expect(applicantEducation.awards.length).toBe(2)
          expect(applicantEducation.awards[0]).toEqual(expect.objectContaining({
            applicantEducationId: applicantEducation.id,
            name: '3 Acts of God'
          }))
          expect(applicantEducation.awards[1]).toEqual(expect.objectContaining({
            applicantEducationId: applicantEducation.id,
            name: 'The Drunken Clam'
          }))
        })
    })

    test('Delete applicant\'s education by ID', async () => {
      await request(app)
        .delete(`/api/applicants/${applicantId}/educations/${educationId}`)
        .then((response) => {
          expect(response.statusCode).toBe(204)
        })
    })

    test('Applicant\'s education not found', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/educations/${educationId}`)
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

      describe('GET /api/applicants/{applicantId}/educations', () => {
        test('Applicant not found', async () => {
          await request(app)
            .get(`/api/applicants/${applicantId}/educations`)
            .then((response) => {
              expect(response.statusCode).toBe(404)
            })
        })
      })
    })
  })
})
