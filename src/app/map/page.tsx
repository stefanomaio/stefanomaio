import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapView } from "@/components/MapView";
import { formatEventDate, formatTimeRange } from "@/lib/format";

export const dynamic = "force-dynamic";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function MapPage() {
  const venues = await prisma.venue.findMany({
    where: { status: "approved", lat: { not: null }, lng: { not: null } },
    include: {
      events: {
        where: { status: "approved", date: { gte: startOfToday() } },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
        take: 3,
      },
    },
    orderBy: { name: "asc" },
  });

  const markers = venues
    .filter((v) => v.lat != null && v.lng != null)
    .map((v) => ({
      id: v.id,
      lat: v.lat!,
      lng: v.lng!,
      label: v.name,
      sublabel:
        v.events.length > 0
          ? `${v.events.length} upcoming event${v.events.length > 1 ? "s" : ""}`
          : "No upcoming events",
    }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-black text-4xl tracking-tight text-cyan-500 dark:text-cyan-400">Venue map</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Basel is compact — most venues are a short tram ride apart.
      </p>

      <div className="mt-4">
        <MapView markers={markers} zoom={12} height="420px" />
      </div>

      <div className="mt-6 space-y-4">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">{venue.name}</h2>
              <span className="text-xs text-neutral-500">
                {venue.neighborhood}
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {venue.address}
            </p>
            {venue.events.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {venue.events.map((e) => (
                  <li key={e.id} className="text-sm">
                    <Link
                      href={`/events/${e.id}`}
                      className="font-medium hover:text-fuchsia-500"
                    >
                      {e.title}
                    </Link>{" "}
                    <span className="text-neutral-500">
                      — {formatEventDate(e.date)},{" "}
                      {formatTimeRange(e.startTime, e.endTime)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">
                No upcoming events listed.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
