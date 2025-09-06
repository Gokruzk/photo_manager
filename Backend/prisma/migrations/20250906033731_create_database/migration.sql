-- CreateTable
CREATE TABLE "ubication" (
    "cod_ubi" INTEGER NOT NULL,
    "country" VARCHAR(100) NOT NULL,

    CONSTRAINT "ubication_pkey" PRIMARY KEY ("cod_ubi")
);

-- CreateTable
CREATE TABLE "users_state" (
    "cod_state" INTEGER NOT NULL,
    "state" VARCHAR(8) NOT NULL,

    CONSTRAINT "users_state_pkey" PRIMARY KEY ("cod_state")
);

-- CreateTable
CREATE TABLE "date_descriptions" (
    "cod_description" INTEGER NOT NULL,
    "description" VARCHAR(8) NOT NULL,

    CONSTRAINT "date_descriptions_pkey" PRIMARY KEY ("cod_description")
);

-- CreateTable
CREATE TABLE "dates" (
    "cod_date" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dates_pkey" PRIMARY KEY ("cod_date")
);

-- CreateTable
CREATE TABLE "images" (
    "cod_image" SERIAL NOT NULL,
    "cod_ubi" INTEGER NOT NULL,
    "cod_user" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "uploadedat" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("cod_image")
);

-- CreateTable
CREATE TABLE "users" (
    "cod_user" SERIAL NOT NULL,
    "cod_ubi" INTEGER NOT NULL,
    "cod_state" INTEGER NOT NULL,
    "username" VARCHAR(15) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(300) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("cod_user")
);

-- CreateTable
CREATE TABLE "users_dates" (
    "cod_date" INTEGER NOT NULL,
    "cod_user" INTEGER NOT NULL,
    "cod_description" INTEGER NOT NULL,

    CONSTRAINT "users_dates_pkey" PRIMARY KEY ("cod_date","cod_user","cod_description")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_cod_ubi_fkey" FOREIGN KEY ("cod_ubi") REFERENCES "ubication"("cod_ubi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_uploadedat_fkey" FOREIGN KEY ("uploadedat") REFERENCES "dates"("cod_date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_cod_user_fkey" FOREIGN KEY ("cod_user") REFERENCES "users"("cod_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cod_ubi_fkey" FOREIGN KEY ("cod_ubi") REFERENCES "ubication"("cod_ubi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cod_state_fkey" FOREIGN KEY ("cod_state") REFERENCES "users_state"("cod_state") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_dates" ADD CONSTRAINT "users_dates_cod_date_fkey" FOREIGN KEY ("cod_date") REFERENCES "dates"("cod_date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_dates" ADD CONSTRAINT "users_dates_cod_user_fkey" FOREIGN KEY ("cod_user") REFERENCES "users"("cod_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_dates" ADD CONSTRAINT "users_dates_cod_description_fkey" FOREIGN KEY ("cod_description") REFERENCES "date_descriptions"("cod_description") ON DELETE RESTRICT ON UPDATE CASCADE;
