-- CreateTable
CREATE TABLE "applicant_educations" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "year_from" TEXT NOT NULL,
    "year_to" TEXT NOT NULL,
    "course" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_education_awards" (
    "id" SERIAL NOT NULL,
    "applicant_education_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_education_awards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applicant_educations" ADD CONSTRAINT "applicant_educations_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_education_awards" ADD CONSTRAINT "applicant_education_awards_applicant_education_id_fkey" FOREIGN KEY ("applicant_education_id") REFERENCES "applicant_educations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
