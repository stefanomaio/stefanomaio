import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildFeedIcs } from "@/lib/ics";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { status: "approved" },
    include: { venue: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const ics = buildFeedIcs(events);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="basel-music.ics"',
    },
  });
}
