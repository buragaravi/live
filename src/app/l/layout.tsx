import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location Consent",
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

export default function LinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
