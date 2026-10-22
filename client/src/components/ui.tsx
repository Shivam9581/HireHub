import type { ReactNode, SVGProps } from "react";

/* ---------- Buttons & inputs ---------- */

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-55";

const buttonVariants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "border border-line bg-white text-ink hover:border-ink/25 hover:bg-canvas",
  danger: "bg-danger text-white hover:bg-danger/90",
  ghost: "text-muted hover:bg-canvas hover:text-ink",
};

const buttonSizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${extra}`;
}

export const inputClass =
  "block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15";

export function Field({
  label,
  htmlFor,
  hint,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) {
  const tones = {
    error: "border-danger/20 bg-danger-soft text-danger",
    success: "border-brand/20 bg-brand-soft text-brand-dark",
    info: "border-line bg-white text-muted",
  };

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm leading-6 ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

/* ---------- Labels & badges ---------- */

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-canvas px-2 py-0.5 text-[13px] text-ink/80 ring-1 ring-line ring-inset">
      {children}
    </span>
  );
}

const statusStyles: Record<string, { label: string; cls: string; dot: string }> = {
  pending: { label: "Pending", cls: "bg-pending-soft text-pending", dot: "bg-pending" },
  accepted: { label: "Accepted", cls: "bg-brand-soft text-brand-dark", dot: "bg-brand" },
  rejected: { label: "Rejected", cls: "bg-danger-soft text-danger", dot: "bg-danger" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = statusStyles[status] ?? {
    label: status,
    cls: "bg-canvas text-muted",
    dot: "bg-muted",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium ${s.cls}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

const markPalette = [
  ["#e3f1ed", "#0a5447"],
  ["#e7e9fb", "#2e3a9e"],
  ["#fbf1df", "#83500c"],
  ["#f4e5f0", "#7a2e6b"],
  ["#e2edf6", "#1f4e79"],
  ["#eceadf", "#4d4a2a"],
];

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Square monogram for a company, coloured consistently from its name. */
export function CompanyMark({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const [bg, fg] = markPalette[hash(name || "?") % markPalette.length];
  const dims = size === "lg" ? "size-14 text-xl rounded-xl" : "size-11 text-base rounded-lg";

  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: bg, color: fg }}
      className={`inline-flex shrink-0 items-center justify-center font-display font-bold ${dims}`}
    >
      {(name || "?").trim()[0]?.toUpperCase()}
    </span>
  );
}

/** Round initials avatar for people. */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const [bg, fg] = markPalette[hash(name || "?") % markPalette.length];
  const dims = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-16 text-xl" }[size];

  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: bg, color: fg }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${dims}`}
    >
      {initials(name || "?")}
    </span>
  );
}

/* ---------- Layout helpers ---------- */

export function PageHeader({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {children}
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div role="status" className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
      <span className="size-6 animate-spin rounded-full border-2 border-line border-t-brand" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-ink/15 bg-white px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function MetaItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-muted/70">{icon}</span>
      {children}
    </span>
  );
}

/* ---------- Formatting ---------- */

export function formatSalary(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return null;
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatDate(value);
}

/* ---------- Icons ---------- */

type IconProps = SVGProps<SVGSVGElement>;

function Svg(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export const Icon = {
  Pin: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Svg>
  ),
  Briefcase: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
    </Svg>
  ),
  Clock: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  Wallet: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M16 13h2M3 10h18" />
    </Svg>
  ),
  Search: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  ),
  ArrowLeft: (p: IconProps) => (
    <Svg {...p}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Svg>
  ),
  Menu: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  ),
  Close: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  ),
  Check: (p: IconProps) => (
    <Svg {...p}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Svg>
  ),
  Plus: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  Mail: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  ),
};
