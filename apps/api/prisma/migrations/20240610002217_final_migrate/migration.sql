/*
  Warnings:

  - The values [GOOGLE,FACEBOOK,TWITTER] on the enum `AccountProvider` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `provider_accout_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,organization_id]` on the table `invites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,user_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_account_id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('PASSWORD_RECOVER');

-- AlterEnum
BEGIN;
CREATE TYPE "AccountProvider_new" AS ENUM ('GITHUB');
ALTER TABLE "accounts" ALTER COLUMN "provider" TYPE "AccountProvider_new" USING ("provider"::text::"AccountProvider_new");
ALTER TYPE "AccountProvider" RENAME TO "AccountProvider_old";
ALTER TYPE "AccountProvider_new" RENAME TO "AccountProvider";
DROP TYPE "AccountProvider_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_userId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- DropIndex
DROP INDEX "accounts_provider_accout_id_key";

-- DropIndex
DROP INDEX "invites_email_key";

-- DropIndex
DROP INDEX "invites_token_key";

-- DropIndex
DROP INDEX "invites_user_id_organization_id_key";

-- DropIndex
DROP INDEX "members_userId_organization_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "provider_accout_id",
ADD COLUMN     "provider_account_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invites" DROP COLUMN "createdAt",
DROP COLUMN "token",
DROP COLUMN "updatedAt",
DROP COLUMN "user_id",
ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "members" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "type",
ADD COLUMN     "type" "TokenType" NOT NULL;

-- DropEnum
DROP TYPE "tokenType";

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_account_id_key" ON "accounts"("provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "invites_email_organization_id_key" ON "invites"("email", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_organization_id_user_id_key" ON "members"("organization_id", "user_id");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
