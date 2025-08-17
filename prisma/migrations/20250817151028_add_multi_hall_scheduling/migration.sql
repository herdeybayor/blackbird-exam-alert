-- CreateEnum
CREATE TYPE "public"."Semester" AS ENUM ('FIRST', 'SECOND');

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "matric_number" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faculties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faculty_halls" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "faculty_id" UUID NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "faculty_halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."time_tables" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "faculty_id" UUID NOT NULL,
    "semester" "public"."Semester" NOT NULL,
    "session" TEXT NOT NULL,
    "exam_start_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "time_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."time_table_courses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "time_table_id" UUID NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_title" TEXT NOT NULL,
    "course_unit" INTEGER NOT NULL,
    "number_of_students" INTEGER NOT NULL,
    "exam_date" TIMESTAMP(3),
    "exam_time" TEXT,
    "duration" INTEGER,
    "hall_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "time_table_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_exam_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "course_id" UUID NOT NULL,
    "hall_id" UUID NOT NULL,
    "exam_date" TIMESTAMP(3) NOT NULL,
    "exam_time" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "students_assigned" INTEGER NOT NULL,
    "session_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "course_exam_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_matric_number_key" ON "public"."students"("matric_number");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "public"."students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "course_exam_sessions_course_id_session_number_key" ON "public"."course_exam_sessions"("course_id", "session_number");

-- AddForeignKey
ALTER TABLE "public"."faculty_halls" ADD CONSTRAINT "faculty_halls_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_tables" ADD CONSTRAINT "time_tables_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_table_courses" ADD CONSTRAINT "time_table_courses_time_table_id_fkey" FOREIGN KEY ("time_table_id") REFERENCES "public"."time_tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_table_courses" ADD CONSTRAINT "time_table_courses_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "public"."faculty_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_exam_sessions" ADD CONSTRAINT "course_exam_sessions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."time_table_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_exam_sessions" ADD CONSTRAINT "course_exam_sessions_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "public"."faculty_halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
