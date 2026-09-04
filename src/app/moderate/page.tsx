import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, MODERATION_COOKIE } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { ModerationActions } from "@/components/ModerationActions";
import { SeedButton } from "@/components/SeedButton";
import { formatEventDate, formatTimeRange } from "@/lib/format";
import { tagColorClasses } from "@/lib/tagColors";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function ModeratePage() {
  const jar = await cookies();
  const authed = verifySessionToken(jar.get(MODERATION_COOKIE)?.value);

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="mb-1 text-xl font-bold">Moderator sign-in</h1>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          Enter the shared moderation password to review submissions.
        </p>
        <LoginForm />
      </div>
    );
  }

  const pending = await prisma.event.findMany({
    where: { status: "pending" },
    include: { venue: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Pending submissions ({pending.length})
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-neutral-500 underline hover:text-neutral-900 dark:hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mb-6 rounded-lg border border-dashed border-neutral-300 p-3 dark:border-neutral-800">
        <SeedButton />
      </div>

      {pending.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500 dark:border-neutral-800">
          Nothing pending review right now.
        </p>
      ) : (
        <div className="space-y-3">
          {pending.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold">{event.title}</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {event.venue.name} · {formatEventDate(event.date)} ·{" "}
                    {formatTimeRange(event.startTime, event.endTime)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                    {event.description}
                  </p>
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
                  <p className="mt-2 text-xs text-neutral-400">
                    Submitted by {event.submittedByName} ({event.submittedByEmail})
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  href={`/moderate/${event.id}`}
                  className="text-sm underline hover:text-fuchsia-500"
                >
                  Edit details
                </Link>
                <ModerationActions eventId={event.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
