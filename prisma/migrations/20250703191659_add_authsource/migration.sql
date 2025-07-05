-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'CREDENTIALS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authSource" "AuthProvider" NOT NULL DEFAULT 'CREDENTIALS';
