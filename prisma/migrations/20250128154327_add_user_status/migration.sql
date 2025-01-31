-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'registered',
ALTER COLUMN "password" DROP NOT NULL;
