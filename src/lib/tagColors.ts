const PALETTE = [
  "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  "bg-amber-400/20 text-amber-700 dark:text-amber-400",
  "bg-lime-500/15 text-lime-700 dark:text-lime-400",
  "bg-violet-500/15 text-violet-700 dark:text-violet-400",
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function tagColorClasses(name: string) {
  return PALETTE[hash(name) % PALETTE.length];
}
