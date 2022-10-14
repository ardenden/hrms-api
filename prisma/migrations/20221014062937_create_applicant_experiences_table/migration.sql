-- CreateTable
CREATE TABLE "applicant_experiences" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "salary_amount" DECIMAL(65,30) NOT NULL,
    "salary_period" TEXT NOT NULL,
    "date_from" DATE NOT NULL,
    "date_to" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_experiences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applicant_experiences" ADD CONSTRAINT "applicant_experiences_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
