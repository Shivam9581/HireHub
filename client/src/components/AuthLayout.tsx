import type { ReactNode } from "react";

import { Icon } from "./ui";

interface AuthLayoutProps {
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
}

function AuthLayout({ title, description, footer, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_minmax(0,34rem)]">
      <div className="flex items-center justify-center px-5 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink">{title}</h1>
          <p className="mt-2 text-[15px] text-muted">{description}</p>

          <div className="mt-8">{children}</div>

          {footer && <p className="mt-8 text-sm text-muted">{footer}</p>}
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-brand-dark px-12 py-16 text-white lg:flex lg:flex-col lg:justify-end">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 size-96 rounded-full border-[48px] border-white/5"
        />
        <p className="relative font-display text-4xl font-bold leading-tight tracking-[-0.02em]">
          Every application, one clear status.
        </p>
        <ul className="relative mt-8 space-y-3 text-[15px] text-white/80">
          {[
            "Browse jobs and internships from companies hiring students",
            "Apply in one click, no cover letter maze",
            "See the moment a recruiter accepts you",
          ].map((line) => (
            <li key={line} className="flex gap-3">
              <Icon.Check className="mt-0.5 shrink-0 text-white" width={18} height={18} />
              {line}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default AuthLayout;
