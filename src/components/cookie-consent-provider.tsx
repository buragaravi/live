"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  COOKIE_CONSENT_KEY,
  type CookieConsent,
  parseConsent,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  consent: CookieConsent;
  ready: boolean;
  acceptAll: () => void;
  acceptEssential: () => void;
  openPreferences: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

function persistConsent(value: "essential" | "all") {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  document.cookie = `${COOKIE_CONSENT_KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fromStorage = localStorage.getItem(COOKIE_CONSENT_KEY);
    const fromCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE_CONSENT_KEY}=`))
      ?.split("=")[1];
    const stored = parseConsent(fromStorage ?? fromCookie ?? null);

    if (stored) {
      setConsent(stored);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setReady(true);
  }, []);

  const acceptAll = useCallback(() => {
    persistConsent("all");
    setConsent("all");
    setShowBanner(false);
  }, []);

  const acceptEssential = useCallback(() => {
    persistConsent("essential");
    setConsent("essential");
    setShowBanner(false);
  }, []);

  const openPreferences = useCallback(() => {
    setShowBanner(true);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      ready,
      acceptAll,
      acceptEssential,
      openPreferences,
      showBanner,
      setShowBanner,
    }),
    [consent, ready, acceptAll, acceptEssential, openPreferences, showBanner]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
