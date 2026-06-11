import Link from "next/link";
import { ReactNode } from "react";
import { APP_GUTTER, APP_MAX_FULL } from "@/lib/ad-slots";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  /** narrow = readable prose (blog posts, legal). full = default, uses all available width */
  width?: "full" | "narrow" | "medium";
};

export function PageShell({
  children,
  className = "",
  width = "full",
}: PageShellProps) {
  const widthClass =
    width === "narrow"
      ? "max-w-4xl mx-auto"
      : width === "medium"
        ? "max-w-6xl mx-auto"
        : "w-full max-w-none";

  return (
    <div className={`${widthClass} py-4 sm:py-6 md:py-8 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-[var(--border-light)] pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-[var(--border-light)] bg-[var(--surface)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants = {
    primary:
      "bg-[var(--accent)] text-white border border-[var(--border)] hover:bg-[#2a2a2a]",
    secondary:
      "bg-white text-[var(--text)] border border-[var(--border)] hover:bg-[#f0f0f0]",
    ghost:
      "bg-transparent text-[var(--text)] border border-transparent hover:border-[var(--border-light)]",
    danger:
      "bg-white text-[#8b0000] border border-[#8b0000] hover:bg-[#fff5f5]",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
      <input
        className="w-full border border-[var(--border-light)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--border)]"
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-[#8b0000]">{error}</span> : null}
    </label>
  );
}

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
      <textarea
        className="min-h-24 w-full resize-y border border-[var(--border-light)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--border)]"
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-[#8b0000]">{error}</span> : null}
    </label>
  );
}

export function Select({
  label,
  error,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
      <select
        className="w-full border border-[var(--border-light)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--border)]"
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-xs text-[#8b0000]">{error}</span> : null}
    </label>
  );
}

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex-1 border-r border-[var(--border-light)] px-5 py-4 last:border-r-0">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "pending";
}) {
  const tones = {
    neutral: "border-[var(--border-light)] bg-[#f3f3f3] text-[var(--text)]",
    success: "border-[#1a1a1a] bg-white text-[#1a1a1a]",
    warning: "border-[#8a6d00] bg-[#fffbea] text-[#8a6d00]",
    danger: "border-[#8b0000] bg-[#fff5f5] text-[#8b0000]",
    pending: "border-[var(--border-light)] bg-white text-[var(--text-muted)]",
  };

  return (
    <span
      className={`inline-flex border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SiteNav() {
  return (
    <header className="border-b border-[var(--border-light)] bg-white">
      <div className={`mx-auto flex w-full ${APP_MAX_FULL} ${APP_GUTTER} items-center justify-between py-3`}>
        <Link href="/" className="text-sm font-semibold tracking-tight">
          LOCATE
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--text)]">
            Create
          </Link>
          <Link href="/results" className="hover:text-[var(--text)]">
            Results
          </Link>
          <Link href="/blog" className="hover:text-[var(--text)]">
            Blog
          </Link>
          <Link href="/about" className="hover:text-[var(--text)]">
            About
          </Link>
          <Link href="/contact" className="hover:text-[var(--text)]">
            Contact
          </Link>
          <Link href="/terms" className="hover:text-[var(--text)]">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-[var(--text)]">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}
