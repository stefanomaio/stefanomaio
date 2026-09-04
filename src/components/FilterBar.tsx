import Link from "next/link";

type FilterBarProps = {
  tags: string[];
  venues: { id: string; name: string }[];
  neighborhoods: string[];
  current: {
    q?: string;
    tag?: string;
    venue?: string;
    neighborhood?: string;
    from?: string;
    to?: string;
  };
};

export function FilterBar({
  tags,
  venues,
  neighborhoods,
  current,
}: FilterBarProps) {
  return (
    <form
      method="get"
      className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-200 bg-white p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-3 md:grid-cols-6"
    >
      <input
        type="search"
        name="q"
        placeholder="Search events…"
        defaultValue={current.q}
        className="col-span-2 rounded-md border border-neutral-300 bg-transparent px-2 py-1.5 outline-none focus:border-fuchsia-500 dark:border-neutral-700 sm:col-span-3 md:col-span-2"
      />
      <select
        name="tag"
        defaultValue={current.tag ?? ""}
        className="rounded-md border border-neutral-300 bg-transparent px-2 py-1.5 outline-none focus:border-fuchsia-500 dark:border-neutral-700"
      >
        <option value="">Any genre</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <select
        name="venue"
        defaultValue={current.venue ?? ""}
        className="rounded-md border border-neutral-300 bg-transparent px-2 py-1.5 outline-none focus:border-fuchsia-500 dark:border-neutral-700"
      >
        <option value="">Any venue</option>
        {venues.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <select
        name="neighborhood"
        defaultValue={current.neighborhood ?? ""}
        className="rounded-md border border-neutral-300 bg-transparent px-2 py-1.5 outline-none focus:border-fuchsia-500 dark:border-neutral-700"
      >
        <option value="">Any neighborhood</option>
        {neighborhoods.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <div className="col-span-2 flex gap-2 sm:col-span-3 md:col-span-2">
        <input
          type="date"
          name="from"
          defaultValue={current.from}
          aria-label="From date"
          className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-transparent px-2 py-1.5 outline-none focus:border-fuchsia-500 dark:border-neutral-700"
        />
        <input
          type="date"
          name="to"
          defaultValue={current.to}
          aria-label="To date"
          className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-transparent px-2 py-1.5 outline-none focus:border-fuchsia-500 dark:border-neutral-700"
        />
      </div>
      <div className="col-span-2 flex gap-2 sm:col-span-3 md:col-span-6 md:justify-end">
        <button
          type="submit"
          className="rounded-md bg-fuchsia-500 px-4 py-1.5 font-medium text-neutral-950 transition hover:bg-fuchsia-400"
        >
          Filter
        </button>
        <Link
          href="/"
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-neutral-500 transition hover:text-neutral-900 dark:border-neutral-700 dark:hover:text-white"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
