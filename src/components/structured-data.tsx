import { APP_NAME } from "@/lib/constants";
import { CONTACT_EMAIL } from "@/lib/site";
import { DEFAULT_DESCRIPTION, SITE_TAGLINE, absoluteUrl } from "@/lib/seo";

export function StructuredData() {
  const siteUrl = absoluteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: siteUrl,
    email: CONTACT_EMAIL,
    description: DEFAULT_DESCRIPTION,
    logo: absoluteUrl("/icons/icon-512.png"),
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: siteUrl,
    description: SITE_TAGLINE,
    publisher: { "@type": "Organization", name: APP_NAME },
    inLanguage: "en-US",
  };

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    url: siteUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript and HTTPS",
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Consent-based location sharing",
      "Explicit recipient disclosure",
      "Private access code for results",
      "No hidden tracking",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication) }}
      />
    </>
  );
}
