import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResultsDashboard } from "@/components/results-dashboard";
import { PageShell } from "@/components/ui";
import { getAuthorizedLink } from "@/app/actions/links";

export const metadata: Metadata = {
  title: "Results Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ResultsDashboardPage() {
  const link = await getAuthorizedLink();
  if (!link) redirect("/results");

  return (
    <PageShell>
      <ResultsDashboard link={link} />
    </PageShell>
  );
}
