import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, MODERATION_COOKIE } from "@/lib/auth";
import { EditEventForm } from "@/components/EditEventForm";

export const dynamic = "force-dynamic";

export default async function ModerateEditPage({
  params,
}: PageProps<"/moderate/[id]">) {
  const jar = await cookies();
  const authed = verifySessionToken(jar.get(MODERATION_COOKIE)?.value);
  if (!authed) redirect("/moderate");

  const { id } = await params;

  const [event, venues] = await Promise.all([
    prisma.event.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <Link
        href="/moderate"
        className="mb-4 inline-block text-sm text-neutral-500 hover:text-lime-500"
      >
        ← Back to pending
      </Link>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit event</h1>
      <EditEventForm event={event} venues={venues} />
    </div>
  );
}
