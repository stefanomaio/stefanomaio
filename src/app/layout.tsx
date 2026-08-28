import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight">
                Basel<span className="text-lime-500">Music</span>
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          <p>
            Basel Music Scene — a community calendar. Know an event? {" "}
            <Link href="/submit" className="underline hover:text-lime-500">
              Submit it
            </Link>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
