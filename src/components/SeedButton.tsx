"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { seedSampleData } from "@/app/moderate/actions";

export function SeedButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await seedSampleData();
            setMessage(
              `Seeded ${result.venues} venues, ${result.tags} tags, ${result.eventsCreated} new events.`,
            );
            router.refresh();
          })
        }
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium transition hover:border-fuchsia-500 disabled:opacity-60 dark:border-neutral-700"
      >
        {isPending ? "Seeding…" : "Seed sample venues & events"}
      </button>
      {message && (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {message}
        </span>
      )}
    </div>
  );
}
