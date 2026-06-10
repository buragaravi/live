import { redirect } from "next/navigation";
import { AccessCodeForm } from "@/components/access-code-form";
import { PageHeader, PageShell } from "@/components/ui";
import { getAuthorizedLink } from "@/app/actions/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "View Results",
  description:
    "Enter your private access code to view consent logs and shared locations for your Locate link.",
  path: "/results",
  keywords: ["location results", "access code"],
});

export default async function ResultsPage() {
  const link = await getAuthorizedLink();
  if (link) redirect("/results/dashboard");

  return (
    <PageShell>
      <PageHeader
        title="View results"
        description="Enter the private access code from link creation to view consent logs, IP addresses, and shared locations."
      />
      <AccessCodeForm />
    </PageShell>
  );
}
