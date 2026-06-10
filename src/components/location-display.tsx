"use client";

import { useEffect, useState } from "react";
import { googleMapsUrl, openStreetMapUrl } from "@/lib/maps";

type Props = {
  lat: number;
  lng: number;
  accuracy?: number | null;
  compact?: boolean;
};

export function LocationDisplay({ lat, lng, accuracy, compact = false }: Props) {
  const [label, setLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/geocode?lat=${lat}&lng=${lng}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { label?: string } | null) => {
        if (!cancelled && data?.label) setLabel(data.label);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  const mapsUrl = googleMapsUrl(lat, lng);
  const osmUrl = openStreetMapUrl(lat, lng);

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <div className="font-medium text-[var(--text)]">
        {loading ? (
          <span className="text-[var(--text-muted)]">Resolving area…</span>
        ) : (
          label ?? "Area unavailable"
        )}
      </div>
      <div className="font-mono text-[11px] text-[var(--text-muted)]">
        {lat.toFixed(6)}, {lng.toFixed(6)}
        {accuracy != null ? ` · ±${Math.round(accuracy)}m` : ""}
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline"
        >
          Google Maps
        </a>
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-muted)] underline"
        >
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}
