/*
  Warnings:

  - The values [ULV] on the enum `AircraftType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AircraftType_new" AS ENUM ('ULM', 'GA');
ALTER TABLE "Event" ALTER COLUMN "aircraftType" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "aircraftType" TYPE "AircraftType_new" USING ("aircraftType"::text::"AircraftType_new");
ALTER TYPE "AircraftType" RENAME TO "AircraftType_old";
ALTER TYPE "AircraftType_new" RENAME TO "AircraftType";
DROP TYPE "AircraftType_old";
ALTER TABLE "Event" ALTER COLUMN "aircraftType" SET DEFAULT 'GA';
COMMIT;
