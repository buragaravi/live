"use client";

import { useMemo, useState } from "react";
import { logoutResults } from "@/app/actions/links";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  StatCard,
} from "@/components/ui";
import { LocationDisplay } from "@/components/location-display";
import type { ConsentStatus, Link, LinkEvent } from "@prisma/client";

type LinkWithEvents = Link & { events: LinkEvent[] };

const TABS = ["ALL", "PENDING", "ACCEPTED", "DECLINED", "GPS_DENIED"] as const;
type Tab = (typeof TABS)[number];

function statusTone(
  status: ConsentStatus
): "success" | "danger" | "warning" | "pending" | "neutral" {
  switch (status) {
    case "ACCEPTED":
      return "success";
    case "DECLINED":
      return "danger";
    case "GPS_DENIED":
      return "warning";
    case "PENDING":
      return "pending";
    default:
      return "neutral";
  }
}

function formatStatus(status: ConsentStatus): string {
  return status.replace("_", " ");
}

export function ResultsDashboard({ link }: { link: LinkWithEvents }) {
  const [tab, setTab] = useState<Tab>("ALL");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const events = link.events;
    return {
      total: events.length,
      accepted: events.filter((e) => e.consentStatus === "ACCEPTED").length,
      declined: events.filter((e) => e.consentStatus === "DECLINED").length,
      pending: events.filter((e) => e.consentStatus === "PENDING").length,
    };
  }, [link.events]);

  const filtered = useMemo(() => {
    return link.events.filter((event) => {
      if (tab !== "ALL" && event.consentStatus !== tab) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (event.ipAddress?.toLowerCase().includes(q) ?? false) ||
        (event.userAgent?.toLowerCase().includes(q) ?? false) ||
        formatStatus(event.consentStatus).toLowerCase().includes(q)
      );
    });
  }, [link.events, tab, search]);

  const expired = new Date() > link.expiresAt;

  return (
    <div>
      <PageHeader
        title="Results"
        description={`Consent log for link created by ${link.creatorName}`}
        action={
          <form action={logoutResults}>
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        }
      />

      <Card className="mb-6 flex flex-col divide-y divide-[var(--border-light)] md:flex-row md:divide-x md:divide-y-0">
        <StatCard label="Total opens" value={stats.total} />
        <StatCard label="Consented" value={stats.accepted} />
        <StatCard label="Declined" value={stats.declined} />
        <StatCard label="Pending" value={stats.pending} />
      </Card>

      <Card className="mb-6 p-4 text-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Purpose
            </span>
            <p className="mt-1">{link.purpose}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Link status
            </span>
            <p className="mt-1 flex items-center gap-2">
              {expired ? (
                <Badge tone="danger">Expired</Badge>
              ) : (
                <Badge tone="success">Active</Badge>
              )}
              <span className="text-[var(--text-muted)]">
                Expires {link.expiresAt.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
        {link.creatorLatitude != null && link.creatorLongitude != null ? (
          <div className="mt-3 border-t border-[var(--border-light)] pt-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Your shared location (at creation)
            </span>
            <div className="mt-2">
              <LocationDisplay
                lat={link.creatorLatitude}
                lng={link.creatorLongitude}
                accuracy={link.creatorAccuracy}
              />
            </div>
          </div>
        ) : null}
      </Card>

      <div className="mb-4 flex flex-wrap gap-4 border-b border-[var(--border-light)]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`pb-3 text-xs font-semibold uppercase tracking-wide ${
              tab === t
                ? "border-b-2 border-[var(--border)] text-[var(--text)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            {t === "GPS_DENIED" ? "GPS denied" : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
        <Input
          label="Search"
          placeholder="IP, area, status…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button variant="secondary" onClick={() => setSearch("")}>
          Clear filters
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-[var(--border-light)] bg-[#fafafa] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Opened</th>
              <th className="px-4 py-3 font-semibold">IP address</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Location / area</th>
              <th className="px-4 py-3 font-semibold">User agent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[var(--text-muted)]"
                >
                  No events match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-[var(--border-light)] last:border-b-0"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {event.openedAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {event.ipAddress ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(event.consentStatus)}>
                      {formatStatus(event.consentStatus)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 min-w-[220px]">
                    {event.latitude != null && event.longitude != null ? (
                      <LocationDisplay
                        lat={event.latitude}
                        lng={event.longitude}
                        accuracy={event.accuracy}
                        compact
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-[var(--text-muted)]">
                    {event.userAgent ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
