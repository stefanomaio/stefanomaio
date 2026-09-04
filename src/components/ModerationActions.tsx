"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveEvent, rejectEvent } from "@/app/moderate/actions";

export function ModerationActions({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await approveEvent(eventId);
            router.refresh();
          })
        }
        className="rounded-md bg-fuchsia-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition hover:bg-fuchsia-400 disabled:opacity-60"
      >
        Approve
      </button>
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            if (!confirm("Reject this submission?")) return;
            await rejectEvent(eventId);
            router.refresh();
          })
        }
        className="rounded-md border border-red-500/50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 disabled:opacity-60 dark:text-red-400"
      >
        Reject
      </button>
    </div>
  );
}
