export type GeocodeResult = {
  label: string;
  fullAddress: string;
};

type NominatimAddress = {
  road?: string;
  pedestrian?: string;
  footway?: string;
  suburb?: string;
  neighbourhood?: string;
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

const cache = new Map<string, GeocodeResult>();
let geocodeQueue: Promise<unknown> = Promise.resolve();

function formatAddress(data: NominatimResponse): GeocodeResult {
  const fullAddress = data.display_name ?? "Unknown area";
  const a = data.address;

  if (!a) {
    const short = fullAddress.split(",").slice(0, 3).join(", ").trim();
    return { label: short || fullAddress, fullAddress };
  }

  const street = a.road ?? a.pedestrian ?? a.footway;
  const area =
    a.suburb ?? a.neighbourhood ?? a.village ?? a.town ?? a.city ?? a.county;
  const region = a.state ?? a.country;

  const parts = [street, area, region].filter(Boolean);
  const unique = [...new Set(parts)];

  return {
    label: unique.join(", ") || fullAddress.split(",").slice(0, 2).join(", "),
    fullAddress,
  };
}

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

async function fetchGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "18");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "LocateApp/1.0 (consent-location-sharing)",
      Accept: "application/json",
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return {
      label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      fullAddress: `${lat}, ${lng}`,
    };
  }

  const data = (await res.json()) as NominatimResponse;
  return formatAddress(data);
}

export function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const key = cacheKey(lat, lng);
  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);

  const task = geocodeQueue.then(async () => {
    const hit = cache.get(key);
    if (hit) return hit;

    await new Promise((r) => setTimeout(r, 1100));

    const result = await fetchGeocode(lat, lng);
    cache.set(key, result);
    return result;
  });

  geocodeQueue = task.catch(() => undefined);
  return task;
}
