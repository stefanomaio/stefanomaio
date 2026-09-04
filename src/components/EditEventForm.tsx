"use client";

import { useActionState } from "react";
import { updateEvent, type EditState } from "@/app/moderate/actions";
import { ModerationActions } from "@/components/ModerationActions";

const initialState: EditState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-fuchsia-500 dark:border-neutral-700";

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}
function toTimeInputValue(d: Date) {
  return d.toTimeString().slice(0, 5);
}

type EventForEdit = {
  id: string;
  title: string;
  description: string;
  venueId: string;
  date: Date;
  startTime: Date;
  endTime: Date | null;
  price: string | null;
  infoUrl: string | null;
  imageUrl: string | null;
  promoter: string | null;
  status: string;
  tags: { tag: { name: string } }[];
};

export function EditEventForm({
  event,
  venues,
}: {
  event: EventForEdit;
  venues: { id: string; name: string; status: string }[];
}) {
  const boundAction = updateEvent.bind(null, event.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800">
        <span>
          Status: <span className="font-semibold">{event.status}</span>
        </span>
        <ModerationActions eventId={event.id} />
      </div>

      <form action={formAction} className="space-y-4">
        {state.status === "error" && (
          <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {state.message}
          </p>
        )}
        {state.status === "success" && (
          <p className="rounded-md bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-700 dark:text-fuchsia-400">
            {state.message}
          </p>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Title</span>
          <input name="title" defaultValue={event.title} required className={inputClass} />
          {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Description</span>
          <textarea
            name="description"
            defaultValue={event.description}
            required
            rows={4}
            className={inputClass}
          />
          {errors.description && (
            <span className="text-xs text-red-500">{errors.description}</span>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Venue</span>
          <select
            name="venueId"
            defaultValue={event.venueId}
            required
            className={inputClass}
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
                {v.status !== "approved" ? ` (${v.status})` : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Date</span>
            <input
              type="date"
              name="date"
              defaultValue={toDateInputValue(event.date)}
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Start</span>
            <input
              type="time"
              name="startTime"
              defaultValue={toTimeInputValue(event.startTime)}
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">End</span>
            <input
              type="time"
              name="endTime"
              defaultValue={event.endTime ? toTimeInputValue(event.endTime) : ""}
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Genre tags (comma-separated)
          </span>
          <input
            name="tags"
            defaultValue={event.tags.map((t) => t.tag.name).join(", ")}
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Price</span>
            <input name="price" defaultValue={event.price ?? ""} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Promoter / label</span>
            <input
              name="promoter"
              defaultValue={event.promoter ?? ""}
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Ticket / info URL</span>
          <input
            name="infoUrl"
            type="url"
            defaultValue={event.infoUrl ?? ""}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Image URL</span>
          <input
            name="imageUrl"
            type="url"
            defaultValue={event.imageUrl ?? ""}
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
