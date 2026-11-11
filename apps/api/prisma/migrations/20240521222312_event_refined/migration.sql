/*
  Warnings:

  - You are about to drop the column `arrivalTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `registration` on the `Event` table. All the data in the column will be lost.
  - The `aircraftType` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `eventType` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `pilotInCommand` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aircraftModel` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aircraftRegistration` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('DEPARTURE', 'ARRIVAL');

-- CreateEnum
CREATE TYPE "AircraftType" AS ENUM ('ULV', 'GA');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "arrivalTime",
DROP COLUMN "date",
DROP COLUMN "departureTime",
DROP COLUMN "model",
DROP COLUMN "registration",
ALTER COLUMN "pilotInCommand" SET NOT NULL,
ALTER COLUMN "aircraftModel" SET NOT NULL,
ALTER COLUMN "aircraftRegistration" SET NOT NULL,
DROP COLUMN "aircraftType",
ADD COLUMN     "aircraftType" "AircraftType" NOT NULL DEFAULT 'GA',
DROP COLUMN "eventType",
ADD COLUMN     "eventType" "EventType" NOT NULL DEFAULT 'ARRIVAL';
