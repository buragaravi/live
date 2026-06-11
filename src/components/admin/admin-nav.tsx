import Link from "next/link";
import { adminLogout } from "@/app/admin/actions";
import { Button } from "@/components/ui";

type Props = {
  adminName: string;
};

export function AdminNav({ adminName }: Props) {
  return (
    <header className="border-b border-[var(--border-light)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="text-sm font-semibold">
            ADMIN
          </Link>
          <nav className="flex gap-4 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            <Link href="/admin/dashboard" className="hover:text-[var(--text)]">
              Dashboard
            </Link>
            <Link href="/admin/posts" className="hover:text-[var(--text)]">
              Posts
            </Link>
            <Link href="/admin/posts/new" className="hover:text-[var(--text)]">
              New post
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)]">{adminName}</span>
          <Link href="/" className="text-xs underline text-[var(--text-muted)]">
            View site
          </Link>
          <form action={adminLogout}>
            <Button type="submit" variant="secondary" className="py-1.5 text-xs">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
