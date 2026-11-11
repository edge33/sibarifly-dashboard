-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "aircraftModel" TEXT,
ADD COLUMN     "aircraftRegistration" TEXT,
ADD COLUMN     "aircraftType" TEXT,
ADD COLUMN     "dateTime" TIMESTAMP(3),
ADD COLUMN     "emailAddress" TEXT,
ADD COLUMN     "eventType" TEXT,
ADD COLUMN     "mobilePhone" TEXT,
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "registration" DROP NOT NULL,
ALTER COLUMN "model" DROP NOT NULL,
ALTER COLUMN "pilotInCommand" DROP NOT NULL,
ALTER COLUMN "arrivalTime" DROP NOT NULL,
ALTER COLUMN "departureTime" DROP NOT NULL;
