import { prisma } from "@/lib/prisma";
import { SubmitForm } from "@/components/SubmitForm";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const venues = await prisma.venue.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="font-display text-4xl tracking-wide text-fuchsia-500">Submit an event</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Promoter, venue, or just heard about something good? Add it here.
        Submissions are reviewed before they go live.
      </p>
      <SubmitForm venues={venues} />
    </div>
  );
}
