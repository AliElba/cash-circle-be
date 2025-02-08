-- DropForeignKey
ALTER TABLE "CircleMember" DROP CONSTRAINT "CircleMember_circleId_fkey";

-- DropForeignKey
ALTER TABLE "CircleMember" DROP CONSTRAINT "CircleMember_userId_fkey";

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
