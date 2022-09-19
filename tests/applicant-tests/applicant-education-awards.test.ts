import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantEducation, ApplicantEducationAward, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let educationId: number
let awardId1: number
let awardId2: number
let testApplicantEducationAward1: ApplicantEducationAward
let testApplicantEducationAward2: ApplicantEducationAward

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

  describe('POST /api/applicants/{applicantId}/educations', () => {
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
          awardId1 = applicantEducation.awards[0].id
          testApplicantEducationAward1 = applicantEducation.awards[0]
        })
    })

    describe('POST|GET /api/applicants/{applicantId}/educations/{educationId}/awards', () => {
      test('Add applicant\'s education award', async () => {
        const createApplicantEducationAward: Prisma.ApplicantEducationAwardUncheckedCreateInput = {
          applicantEducationId: educationId,
          name: 'No Emmy'
        }
        await request(app)
          .post(`/api/applicants/${applicantId}/educations/${educationId}/awards`)
          .send(createApplicantEducationAward)
          .then((response) => {
            expect(response.statusCode).toBe(200)
            const applicantEducationAward = <ApplicantEducationAward>response.body
            expect(applicantEducationAward.applicantEducationId).toBe(educationId)
            expect(applicantEducationAward.name).toBe('No Emmy')
            expect(applicantEducationAward.id).toBeDefined()
            expect(applicantEducationAward.createdAt).toBeDefined()
            expect(applicantEducationAward.updatedAt).toBeDefined()
            awardId2 = applicantEducationAward.id
            testApplicantEducationAward2 = applicantEducationAward
          })
      })

      test('Fetch all applicant\'s education awards', async () => {
        await request(app)
          .get(`/api/applicants/${applicantId}/educations/${educationId}/awards`)
          .then((response) => {
            expect(response.statusCode).toBe(200)
            const applicantEducationAwards = <ApplicantEducationAward[]>response.body
            expect(applicantEducationAwards.length).toBe(2)
            expect(applicantEducationAwards).toEqual(expect.arrayContaining([
              testApplicantEducationAward1, testApplicantEducationAward2
            ]))
          })
      })
    })

    describe('GET|PUT|DELETE /api/applicants/{applicantId}/educations/{educationId}/awards/{awardId}', () => {
      test('Find applicant\'s education award by ID', async () => {
        await request(app)
          .get(`/api/applicants/${applicantId}/educations/${educationId}/awards/${awardId2}`)
          .then((response) => {
            expect(response.statusCode).toBe(200)
            const applicantEducationAward = <ApplicantEducationAward>response.body
            expect(applicantEducationAward).toEqual(testApplicantEducationAward2)
          })
      })

      test('Update applicant\'s education award by ID', async () => {
        const updateApplicantEducationAWard: Prisma.ApplicantEducationAwardUpdateInput = {
          name: 'Artios'
        }
        await request(app)
          .put(`/api/applicants/${applicantId}/educations/${educationId}/awards/${awardId2}`)
          .send(updateApplicantEducationAWard)
          .then((response) => {
            expect(response.statusCode).toBe(200)
            const applicantEducationAward = <ApplicantEducationAward>response.body
            expect(applicantEducationAward.applicantEducationId).toBe(testApplicantEducationAward2.applicantEducationId)
            expect(applicantEducationAward.id).toBe(testApplicantEducationAward2.id)
            expect(applicantEducationAward.name).toBe('Artios')
            expect(applicantEducationAward.createdAt).toBe(testApplicantEducationAward2.createdAt)
            expect(applicantEducationAward.updatedAt).not.toBe(testApplicantEducationAward2.updatedAt)
          })
      })

      test('Delete applicant\'s education 1 award by ID', async () => {
        await request(app)
          .delete(`/api/applicants/${applicantId}/educations/${educationId}/awards/${awardId1}`)
          .then((response) => {
            expect(response.statusCode).toBe(204)
          })
      })

      test('Applicant\'s education award 1 not found', async () => {
        await request(app)
          .get(`/api/applicants/${applicantId}/educations/${educationId}/awards/${awardId1}`)
          .then((response) => {
            expect(response.statusCode).toBe(404)
          })
      })

      test('Delete applicant\'s education 2 award by ID', async () => {
        await request(app)
          .delete(`/api/applicants/${applicantId}/educations/${educationId}/awards/${awardId2}`)
          .then((response) => {
            expect(response.statusCode).toBe(204)
          })
      })

      test('Applicant\'s education award 2 not found', async () => {
        await request(app)
          .get(`/api/applicants/${applicantId}/educations/${educationId}/awards/${awardId2}`)
          .then((response) => {
            expect(response.statusCode).toBe(404)
          })
      })

      describe('GET /api/applicants/{applicantId}/educations/{educationId}/awards', () => {
        test('Fetch all applicant\'s education awards (empty array)', async () => {
          await request(app)
            .get(`/api/applicants/${applicantId}/educations/${educationId}/awards`)
            .then((response) => {
              expect(response.statusCode).toBe(200)
              const applicantEducationAwards = <ApplicantEducationAward[]>response.body
              expect(applicantEducationAwards).toEqual([])
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

        describe('GET /api/applicants/{applicantId}/educations/{educationId}/awards', () => {
          test('Applicant or applicant\'s education not found', async () => {
            await request(app)
              .get(`/api/applicants/${applicantId}/educations/${educationId}/awards`)
              .then((response) => {
                expect(response.statusCode).toBe(404)
              })
          })
        })
      })
    })
  })
})
