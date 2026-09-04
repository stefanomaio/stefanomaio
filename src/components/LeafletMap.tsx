"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Leaflet's default marker icons reference image files that don't resolve
// correctly when bundled; serve local copies from /public/leaflet instead.
const markerIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  href?: string;
};

type LeafletMapProps = {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
};

const BASEL_CENTER: [number, number] = [47.5596, 7.5886];

export function LeafletMap({
  markers,
  center,
  zoom = 13,
  height = "400px",
}: LeafletMapProps) {
  const mapCenter = center ?? (markers[0] ? [markers[0].lat, markers[0].lng] : BASEL_CENTER);

  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800"
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={markerIcon}>
            <Popup>
              <div className="text-sm">
                {m.href ? (
                  <Link href={m.href} className="font-semibold underline">
                    {m.label}
                  </Link>
                ) : (
                  <span className="font-semibold">{m.label}</span>
                )}
                {m.sublabel && <div className="text-neutral-500">{m.sublabel}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
