-- AlterTable
-- Backfill existing venues as "approved": everything already in this table
-- was already live/vetted before this column existed.
ALTER TABLE "Venue" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'approved';

-- New venues (e.g. submitted through the app) should default to "pending",
-- matching schema.prisma going forward.
ALTER TABLE "Venue" ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "Venue_status_idx" ON "Venue"("status");
