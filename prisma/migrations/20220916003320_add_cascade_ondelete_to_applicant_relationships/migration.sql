-- DropForeignKey
ALTER TABLE "applicant_children" DROP CONSTRAINT "applicant_children_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "applicant_parents" DROP CONSTRAINT "applicant_parents_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "applicant_siblings" DROP CONSTRAINT "applicant_siblings_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "applicant_spouses" DROP CONSTRAINT "applicant_spouses_applicant_id_fkey";

-- AddForeignKey
ALTER TABLE "applicant_parents" ADD CONSTRAINT "applicant_parents_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_siblings" ADD CONSTRAINT "applicant_siblings_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_children" ADD CONSTRAINT "applicant_children_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_spouses" ADD CONSTRAINT "applicant_spouses_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
