"use client";

import { useActionState, useEffect, useState } from "react";
import { submitConsent } from "@/app/actions/links";
import { Button } from "@/components/ui";

type LinkData = {
  creatorName: string;
  purpose: string;
  destinationUrl: string;
  creatorLatitude: number | null;
  creatorLongitude: number | null;
};

type Props = {
  loading: boolean;
  link: LinkData | null;
  eventId: string | null;
  hostname: string;
};

const initialState: { error?: string; success?: boolean } = {};

export function ConsentFlow({ loading, link, eventId, hostname }: Props) {
  const [state, formAction, pending] = useActionState(submitConsent, initialState);
  const [processing, setProcessing] = useState(false);
  const [outcome, setOutcome] = useState<"accepted" | "declined" | null>(null);

  const destinationUrl = link?.destinationUrl ?? `https://${hostname}`;

  useEffect(() => {
    if (state.success && outcome) {
      window.location.replace(destinationUrl);
    }
  }, [state.success, outcome, destinationUrl]);

  async function handleAccept() {
    if (!eventId) return;
    setOutcome("accepted");
    setProcessing(true);

    const formData = new FormData();
    formData.set("eventId", eventId);
    formData.set("accepted", "true");
    formData.set("termsAccepted", "true");

    if (!navigator.geolocation) {
      formAction(formData);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        formData.set("latitude", String(pos.coords.latitude));
        formData.set("longitude", String(pos.coords.longitude));
        formData.set("accuracy", String(pos.coords.accuracy));
        formAction(formData);
      },
      () => {
        formAction(formData);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function handleDecline() {
    if (!eventId) return;
    setOutcome("declined");
    const formData = new FormData();
    formData.set("eventId", eventId);
    formData.set("accepted", "false");
    formAction(formData);
  }

  const busy = processing || pending;
  const ready = !loading && !!link && !!eventId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        className="w-full max-w-md border border-[var(--border)] bg-white p-6 shadow-none"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Location consent
        </p>

        {loading ? (
          <>
            <h2 id="consent-title" className="mt-2 text-xl font-semibold">
              Loading request…
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Please wait a moment.
            </p>
          </>
        ) : link ? (
          <>
            <h2 id="consent-title" className="mt-2 text-xl font-semibold">
              {link.creatorName} requests your location
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{link.purpose}</p>
          </>
        ) : null}

        <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
          By clicking <strong>Accept</strong>, you agree to the{" "}
          <a href="/terms" className="underline" target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
          ,{" "}
          <a href="/privacy" className="underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          , and voluntary one-time location sharing. Your browser may ask for GPS
          permission next.
        </p>

        {state.error ? (
          <p className="mt-3 text-sm text-[#8b0000]">{state.error}</p>
        ) : null}

        {busy ? (
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            {state.success ? `Redirecting to ${hostname}…` : "Confirming consent…"}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            onClick={handleAccept}
            disabled={!ready || busy}
            className="w-full"
          >
            {loading ? "Loading…" : busy && outcome === "accepted" ? "Please wait…" : "Accept"}
          </Button>
          <button
            type="button"
            onClick={handleDecline}
            disabled={!ready || busy}
            className="text-xs text-[var(--text-muted)] underline disabled:opacity-50"
          >
            Decline and continue to {hostname}
          </button>
        </div>
      </div>
    </div>
  );
}
