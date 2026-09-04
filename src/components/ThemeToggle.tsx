"use client";

function toggleTheme() {
  const next = !document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", next);
  try {
    localStorage.setItem("theme", next ? "dark" : "light");
  } catch {}
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light/dark theme"
      className="rounded-md border border-neutral-300 px-2 py-1 text-xs normal-case tracking-normal text-neutral-600 transition hover:border-fuchsia-500 hover:text-fuchsia-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
    >
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  );
}
