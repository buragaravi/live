import { CookieConsentProvider } from "@/components/cookie-consent-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { AdScripts } from "@/components/ad-scripts";
import { SiteChrome } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = rootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        <CookieConsentProvider>
          <SiteChrome>{children}</SiteChrome>
          <CookieBanner />
          <AdScripts />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
