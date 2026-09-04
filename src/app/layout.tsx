import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Basel Music Scene",
  description:
    "What's on in Basel's live and electronic music scene — one calendar for venues, promoters, and punters.",
};

const navLinks = [
  { href: "/", label: "Events" },
  { href: "/map", label: "Map" },
  { href: "/submit", label: "Submit" },
];

// Applies the stored (or system) theme before paint, so there's no
// light/dark flash on load.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-fuchsia-500">
                Basel
              </span>
              <span className="text-2xl font-black tracking-tight text-cyan-500 dark:text-cyan-400">
                Music
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-bold uppercase tracking-wide">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-neutral-600 transition hover:text-fuchsia-500 dark:text-neutral-400 dark:hover:text-cyan-400"
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          <p>
            Basel Music Scene — a community calendar. Know an event? {" "}
            <Link href="/submit" className="underline hover:text-fuchsia-500">
              Submit it
            </Link>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
