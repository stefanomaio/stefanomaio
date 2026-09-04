import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatTimeRange } from "@/lib/format";
import { MapView } from "@/components/MapView";
import { tagColorClasses } from "@/lib/tagColors";

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[id]">) {
  const { id } = await params;

  const event = await prisma.event.findFirst({
    where: { id, status: "approved" },
    include: { venue: true, tags: { include: { tag: true } } },
  });

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-neutral-500 hover:text-fuchsia-500"
      >
        ← Back to events
      </Link>

      {event.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.imageUrl}
          alt={event.title}
          className="mb-4 w-full rounded-lg object-cover"
        />
      )}

      <h1 className="font-black text-3xl leading-tight tracking-tight text-fuchsia-500">
        {event.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        <span className="font-medium">{formatEventDate(event.date)}</span>
        <span aria-hidden>·</span>
        <span>{formatTimeRange(event.startTime, event.endTime)}</span>
        {event.price && (
          <>
            <span aria-hidden>·</span>
            <span>{event.price}</span>
          </>
        )}
      </div>

      {event.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {event.tags.map(({ tag }) => (
            <span
              key={tag.name}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColorClasses(tag.name)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 whitespace-pre-line text-neutral-800 dark:text-neutral-200">
        {event.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={`/api/events/${event.id}/ics`}
          className="rounded-md bg-fuchsia-500 px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-fuchsia-400"
        >
          Add to calendar (.ics)
        </a>
        {event.infoUrl && (
          <a
            href={event.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-fuchsia-500 dark:border-neutral-700"
          >
            Tickets / info
          </a>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="font-semibold">{event.venue.name}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {event.venue.address} · {event.venue.neighborhood}
        </p>
        {event.promoter && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Promoted by {event.promoter}
          </p>
        )}
        {event.venue.website && (
          <a
            href={event.venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm underline hover:text-fuchsia-500"
          >
            Venue website
          </a>
        )}
      </div>

      {event.venue.lat != null && event.venue.lng != null && (
        <div className="mt-4">
          <MapView
            markers={[
              {
                id: event.venue.id,
                lat: event.venue.lat,
                lng: event.venue.lng,
                label: event.venue.name,
                sublabel: event.venue.address,
              },
            ]}
            center={[event.venue.lat, event.venue.lng]}
            zoom={15}
            height="300px"
          />
        </div>
      )}
    </div>
  );
}
