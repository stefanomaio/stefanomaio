"use client";

import { useActionState, useState } from "react";
import { submitEvent, type SubmitFormState } from "@/app/submit/actions";

const initialState: SubmitFormState = { status: "idle" };

const NEW_VENUE = "__new__";

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-fuchsia-500 dark:border-neutral-700";

export function SubmitForm({
  venues,
}: {
  venues: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    submitEvent,
    initialState,
  );
  const [venueId, setVenueId] = useState("");
  const isNewVenue = venueId === NEW_VENUE;

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-800 dark:text-fuchsia-300">
        {state.message}
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {state.status === "error" && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <Field label="Event title" error={errors.title}>
        <input name="title" required className={inputClass} />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          required
          rows={4}
          className={inputClass}
        />
      </Field>

      <Field label="Venue" error={errors.venueId}>
        <select
          name="venueId"
          required
          value={venueId}
          onChange={(e) => setVenueId(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a venue…</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
          <option value={NEW_VENUE}>My venue isn&rsquo;t listed…</option>
        </select>
      </Field>

      {isNewVenue && (
        <div className="space-y-3 rounded-lg border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
          <p className="text-xs text-neutral-500">
            New venues are reviewed before they (and this event) go live.
          </p>
          <Field label="Venue name" error={errors.newVenueName}>
            <input name="newVenueName" required className={inputClass} />
          </Field>
          <Field label="Address" error={errors.newVenueAddress}>
            <input
              name="newVenueAddress"
              placeholder="Street, postcode, Basel"
              required
              className={inputClass}
            />
          </Field>
          <Field label="Neighborhood" error={errors.newVenueNeighborhood}>
            <input
              name="newVenueNeighborhood"
              placeholder="Kleinbasel, Gundeldingen, …"
              required
              className={inputClass}
            />
          </Field>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Field label="Date" error={errors.date}>
          <input type="date" name="date" required className={inputClass} />
        </Field>
        <Field label="Start time" error={errors.startTime}>
          <input
            type="time"
            name="startTime"
            required
            className={inputClass}
          />
        </Field>
        <Field label="End time" error={errors.endTime}>
          <input type="time" name="endTime" className={inputClass} />
        </Field>
      </div>

      <Field label="Genre tags (comma-separated)">
        <input
          name="tags"
          placeholder="techno, house, DIY"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price" error={errors.price}>
          <input name="price" placeholder="15 CHF / free" className={inputClass} />
        </Field>
        <Field label="Promoter / label (optional)" error={errors.promoter}>
          <input name="promoter" className={inputClass} />
        </Field>
      </div>

      <Field label="Ticket / info URL" error={errors.infoUrl}>
        <input name="infoUrl" type="url" placeholder="https://…" className={inputClass} />
      </Field>

      <Field label="Image URL (optional)" error={errors.imageUrl}>
        <input name="imageUrl" type="url" placeholder="https://…" className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Your name" error={errors.submittedByName}>
          <input name="submittedByName" required className={inputClass} />
        </Field>
        <Field label="Your email" error={errors.submittedByEmail}>
          <input
            name="submittedByEmail"
            type="email"
            required
            className={inputClass}
          />
        </Field>
      </div>
      <p className="text-xs text-neutral-500">
        Your name and email are only used to follow up about this
        submission — they won&rsquo;t be published.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-fuchsia-400 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit event"}
      </button>
    </form>
  );
}
