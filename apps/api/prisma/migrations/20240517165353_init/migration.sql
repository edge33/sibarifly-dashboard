-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "registration" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "pilotInCommand" TEXT NOT NULL,
    "firstOfficer" TEXT NOT NULL,
    "paxNumber" INTEGER NOT NULL,
    "departure" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
