"use client";

import { useActionState, useState } from "react";
import { createLink, type CreateLinkState } from "@/app/actions/links";
import { EXPIRY_OPTIONS } from "@/lib/constants";
import {
  Button,
  Card,
  Input,
  Select,
  Textarea,
} from "@/components/ui";

const initialState: CreateLinkState = {};

export function CreateLinkForm() {
  const [state, formAction, pending] = useActionState(createLink, initialState);
  const [shareLocation, setShareLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");
  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);

  async function requestCreatorLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setShareLocation(true);
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
        setShareLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            name="creatorName"
            label="Your name"
            placeholder="Who is requesting location?"
            required
            error={state.fieldErrors?.creatorName?.[0]}
          />
          <Select
            name="expiryOption"
            label="Link expiry"
            defaultValue="ONE_HOUR"
            error={state.fieldErrors?.expiryOption?.[0]}
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <Textarea
          name="purpose"
          label="Purpose of request"
          placeholder="Explain clearly why you need their location"
          required
          error={state.fieldErrors?.purpose?.[0]}
        />

        <Input
          name="destinationUrl"
          label="Destination URL"
          type="url"
          placeholder="https://example.com/page-they-expect"
          required
          error={state.fieldErrors?.destinationUrl?.[0]}
        />

        <div className="border border-[var(--border-light)] bg-[#fafafa] p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Your consent
          </div>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            As the requester, you must accept our terms. Optionally share your
            own location so the recipient knows where you are.
          </p>

          <label className="mt-4 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="termsAccepted"
              className="mt-1"
              required
            />
            <span>
              I accept the{" "}
              <a href="/terms" className="underline" target="_blank">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline" target="_blank">
                Privacy Policy
              </a>
              . I confirm I have a legitimate purpose and will not misuse
              location data.
            </span>
          </label>
          {state.fieldErrors?.termsAccepted?.[0] ? (
            <p className="mt-2 text-xs text-[#8b0000]">
              {state.fieldErrors.termsAccepted[0]}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="shareCreatorLocation"
                checked={shareLocation}
                onChange={(e) => {
                  if (e.target.checked) {
                    requestCreatorLocation();
                  } else {
                    setShareLocation(false);
                    setCoords(null);
                    setLocationStatus("idle");
                  }
                }}
              />
              Share my location with recipients
            </label>
            {locationStatus === "loading" ? (
              <span className="text-xs text-[var(--text-muted)]">
                Requesting GPS permission…
              </span>
            ) : null}
            {locationStatus === "granted" && coords ? (
              <span className="text-xs text-[var(--text-muted)]">
                Location captured ({coords.lat.toFixed(5)}, {coords.lng.toFixed(5)})
              </span>
            ) : null}
            {locationStatus === "denied" ? (
              <span className="text-xs text-[#8b0000]">
                Location permission denied
              </span>
            ) : null}
          </div>

          {coords ? (
            <>
              <input type="hidden" name="creatorLatitude" value={coords.lat} />
              <input type="hidden" name="creatorLongitude" value={coords.lng} />
              <input
                type="hidden"
                name="creatorAccuracy"
                value={coords.accuracy}
              />
            </>
          ) : null}
        </div>

        {state.error ? (
          <p className="text-sm text-[#8b0000]">{state.error}</p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full md:w-auto">
          {pending ? "Creating…" : "+ Create consent link"}
        </Button>
      </form>
    </Card>
  );
}
