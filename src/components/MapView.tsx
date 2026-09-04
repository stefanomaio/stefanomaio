"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "./LeafletMap";

const LeafletMap = dynamic(
  () => import("./LeafletMap").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-neutral-200 text-sm text-neutral-500 dark:border-neutral-800">
        Loading map…
      </div>
    ),
  },
);

export function MapView(props: {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}) {
  return <LeafletMap {...props} />;
}
