-- CreateTable
CREATE TABLE "applicants" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "name_extension" TEXT,
    "telephone_no" TEXT,
    "mobile_no" TEXT,
    "email" TEXT,
    "birth_date" DATE NOT NULL,
    "birth_place" TEXT NOT NULL,
    "citizenship" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "religion" TEXT,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);
