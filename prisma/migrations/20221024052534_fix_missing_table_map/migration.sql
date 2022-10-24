/*
  Warnings:

  - You are about to drop the `ApplicantOrganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicantOrganization" DROP CONSTRAINT "ApplicantOrganization_applicant_id_fkey";

-- DropTable
DROP TABLE "ApplicantOrganization";

-- CreateTable
CREATE TABLE "applicant_organizations" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "date_from" DATE NOT NULL,
    "date_to" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_organizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applicant_organizations" ADD CONSTRAINT "applicant_organizations_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
