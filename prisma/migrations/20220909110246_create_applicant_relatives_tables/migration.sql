-- CreateTable
CREATE TABLE "applicant_parents" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "name_extension" TEXT,
    "relationship" TEXT NOT NULL,
    "occupation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_siblings" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "name_extension" TEXT,
    "relationship" TEXT NOT NULL,
    "occupation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_siblings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_children" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "name_extension" TEXT,
    "relationship" TEXT NOT NULL,
    "occupation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_spouses" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "name_extension" TEXT,
    "occupation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_spouses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applicant_spouses_applicant_id_key" ON "applicant_spouses"("applicant_id");

-- AddForeignKey
ALTER TABLE "applicant_parents" ADD CONSTRAINT "applicant_parents_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_siblings" ADD CONSTRAINT "applicant_siblings_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_children" ADD CONSTRAINT "applicant_children_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_spouses" ADD CONSTRAINT "applicant_spouses_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
