import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { FilterBar } from "@/components/FilterBar";
import type { Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function HomePage({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const tag = typeof params.tag === "string" ? params.tag : "";
  const venue = typeof params.venue === "string" ? params.venue : "";
  const neighborhood =
    typeof params.neighborhood === "string" ? params.neighborhood : "";
  const from = typeof params.from === "string" ? params.from : "";
  const to = typeof params.to === "string" ? params.to : "";

  const where: Prisma.EventWhereInput = {
    status: "approved",
    date: {
      gte: from ? new Date(from) : startOfToday(),
      ...(to ? { lte: new Date(`${to}T23:59:59`) } : {}),
    },
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { promoter: { contains: q } },
    ];
  }
  if (venue) where.venueId = venue;
  if (neighborhood) where.venue = { neighborhood };
  if (tag) where.tags = { some: { tag: { name: tag } } };

  const [events, venues, tags] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: { venue: true, tags: { include: { tag: true } } },
      take: 100,
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const neighborhoods = Array.from(
    new Set(venues.map((v) => v.neighborhood)),
  ).sort();

  const grouped = new Map<string, typeof events>();
  for (const event of events) {
    const key = event.date.toISOString().slice(0, 10);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(event);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="font-black text-4xl tracking-tight text-fuchsia-500">
          What&rsquo;s on in Basel
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Live and electronic music, aggregated in one calendar.{" "}
          <a href="/api/feed.ics" className="underline hover:text-fuchsia-500">
            Subscribe via iCal
          </a>
        </p>
      </div>

      <div className="mb-6">
        <FilterBar
          tags={tags.map((t) => t.name)}
          venues={venues}
          neighborhoods={neighborhoods}
          current={{ q, tag, venue, neighborhood, from, to }}
        />
      </div>

      {events.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500 dark:border-neutral-800">
          No events match those filters yet.{" "}
          <a href="/submit" className="underline hover:text-fuchsia-500">
            Know one? Submit it.
          </a>
        </p>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([day, dayEvents]) => (
            <section key={day}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
