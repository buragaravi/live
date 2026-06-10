"use client";

import { useEffect, useState } from "react";
import { ConsentFlow } from "@/components/consent-flow";

type LinkData = {
  id: string;
  slug: string;
  creatorName: string;
  purpose: string;
  destinationUrl: string;
  expiresAt: string;
  creatorLatitude: number | null;
  creatorLongitude: number | null;
};

type OpenResponse = {
  eventId: string;
  hostname: string;
  link: LinkData;
};

export function ConsentPage({ slug }: { slug: string }) {
  const [data, setData] = useState<OpenResponse | null>(null);
  const [error, setError] = useState<"not_found" | "expired" | "network" | null>(
    null
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    fetch(`/api/links/${slug}/open`, {
      method: "POST",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 404) {
          setError("not_found");
          return;
        }
        if (res.status === 410) {
          setError("expired");
          return;
        }
        if (!res.ok) {
          setError("network");
          return;
        }
        const json = (await res.json()) as OpenResponse;
        setData(json);
      })
      .catch(() => setError("network"))
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [slug]);

  if (error === "not_found") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md border border-[var(--border)] bg-white p-6">
          <h2 className="text-xl font-semibold">Link not found</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            This link does not exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  if (error === "expired") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md border border-[var(--border)] bg-white p-6">
          <h2 className="text-xl font-semibold">Link expired</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            This location request is no longer active.
          </p>
        </div>
      </div>
    );
  }

  if (error === "network") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md border border-[var(--border)] bg-white p-6">
          <h2 className="text-xl font-semibold">Connection issue</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Could not load this request. Check your connection and refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConsentFlow
      loading={!data}
      link={data?.link ?? null}
      eventId={data?.eventId ?? null}
      hostname={data?.hostname ?? slug}
    />
  );
}
