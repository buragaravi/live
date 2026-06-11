import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/login-form";
import { PageHeader, PageShell } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLoginPage() {
  return (
    <PageShell className="max-w-lg">
      <PageHeader
        title="Admin"
        description="Sign in to manage blog posts and content."
      />
      <AdminLoginForm />
    </PageShell>
  );
}
