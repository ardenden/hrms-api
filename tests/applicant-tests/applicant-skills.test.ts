import express from 'express'
import request from 'supertest'
import routes from '../../src/routes'
import { Applicant, ApplicantSkill, Prisma } from '@prisma/client'

const app = express()
app.use(express.json())
app.use(routes)

let applicantId: number
let skillId: number
let testApplicantSkill: ApplicantSkill

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

  describe('POST|GET /api/applicants/{applicantId}/skills', () => {
    test('Add applicant\'s skill', async () => {
      const createApplicantSkill: Prisma.ApplicantSkillUncheckedCreateInput = {
        applicantId: applicantId,
        name: 'Self regeneration'
      }
      await request(app)
        .post(`/api/applicants/${applicantId}/skills`)
        .send(createApplicantSkill)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSkill = <ApplicantSkill>response.body
          expect(applicantSkill.applicantId).toBe(applicantId)
          expect(applicantSkill.name).toBe('Self regeneration')
          expect(applicantSkill.id).toBeDefined()
          expect(applicantSkill.createdAt).toBeDefined()
          expect(applicantSkill.updatedAt).toBeDefined()
          skillId = applicantSkill.id
          testApplicantSkill = applicantSkill
        })
    })

    test('Fetch all applicant\'s skills', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/skills`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSkills = <ApplicantSkill[]>response.body
          expect(applicantSkills).toEqual(expect.arrayContaining([testApplicantSkill]))
        })
    })
  })

  describe('GET|PUT|DELETE /api/applicants/{applicantId}/skills/{skillId}', () => {
    test('Find applicant\'s skill by ID', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/skills/${skillId}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSkill = <ApplicantSkill>response.body
          expect(applicantSkill).toEqual(testApplicantSkill)
        })
    })

    test('Update applicant\'s skill by ID', async () => {
      const updateApplicantSkill: Prisma.ApplicantSkillUpdateInput = {
        name: 'Self-regeneration'
      }
      await request(app)
        .put(`/api/applicants/${applicantId}/skills/${skillId}`)
        .send(updateApplicantSkill)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          const applicantSkill = <ApplicantSkill>response.body
          expect(applicantSkill.applicantId).toBe(testApplicantSkill.applicantId)
          expect(applicantSkill.name).toBe('Self-regeneration')
          expect(applicantSkill.id).toBe(testApplicantSkill.id)
          expect(applicantSkill.createdAt).toBe(testApplicantSkill.createdAt)
          expect(applicantSkill.updatedAt).not.toBe(testApplicantSkill.updatedAt)
        })
    })

    test('Delete applicant\'s skill by ID', async () => {
      await request(app)
        .delete(`/api/applicants/${applicantId}/skills/${skillId}`)
        .then((response) => {
          expect(response.statusCode).toBe(204)
        })
    })

    test('Applicant\'s skill not found', async () => {
      await request(app)
        .get(`/api/applicants/${applicantId}/skills/${skillId}`)
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

      describe('GET /api/applicants/{applicantId}/skills', () => {
        test('Applicant not found', async () => {
          await request(app)
            .get(`/api/applicants/${applicantId}/skills`)
            .then((response) => {
              expect(response.statusCode).toBe(404)
            })
        })
      })
    })
  })
})
