-- CreateTable
CREATE TABLE "applicant_skills" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_skills_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applicant_skills" ADD CONSTRAINT "applicant_skills_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
