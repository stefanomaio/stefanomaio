import Link from "next/link";
import { formatEventDate, formatTimeRange } from "@/lib/format";
import { tagColorClasses } from "@/lib/tagColors";

type EventCardData = {
  id: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date | null;
  price: string | null;
  imageUrl: string | null;
  venue: { name: string; neighborhood: string };
  tags: { tag: { name: string } }[];
};

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 transition hover:border-fuchsia-500/60 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-md bg-neutral-100 py-2 text-center dark:bg-neutral-800">
        <span className="text-[10px] font-medium uppercase text-neutral-500">
          {formatEventDate(event.date).split(" ")[0]}
        </span>
        <span className="text-lg font-bold leading-none">
          {formatEventDate(event.date).split(" ")[1]}
        </span>
        <span className="text-[10px] uppercase text-neutral-500">
          {formatEventDate(event.date).split(" ")[2]}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400">
          {event.title}
        </h3>
        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
          {event.venue.name} · {event.venue.neighborhood}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{formatTimeRange(event.startTime, event.endTime)}</span>
          {event.price && (
            <>
              <span aria-hidden>·</span>
              <span>{event.price}</span>
            </>
          )}
        </div>
        {event.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {event.tags.map(({ tag }) => (
              <span
                key={tag.name}
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tagColorClasses(tag.name)}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
