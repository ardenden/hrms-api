/*
  Warnings:

  - Added the required column `relationship` to the `applicant_spouses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applicant_spouses" ADD COLUMN     "relationship" TEXT NOT NULL;
