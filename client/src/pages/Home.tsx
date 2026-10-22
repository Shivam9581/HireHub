import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { CompanyMark, Icon, MetaItem, Tag, buttonClass } from "../components/ui";

const trackerSteps = [
  { label: "Applied", note: "Application sent to Northwind Labs." },
  { label: "Pending", note: "A recruiter is reviewing your profile." },
  { label: "Accepted", note: "Northwind Labs accepted your application." },
];

/** Hero illustration: a sample posting whose application moves through each status once on load. */
function ApplicationTracker() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(2);
      return;
    }
    const timers = [
      window.setTimeout(() => setStep(1), 1100),
      window.setTimeout(() => setStep(2), 2600),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const accepted = step === 2;

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:mx-0">
      <div className="absolute inset-x-6 -bottom-3 h-full rounded-2xl border border-line bg-white/60" />

      <div className="relative rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_-28px_rgba(22,26,34,0.35)] sm:p-7">
        <div className="flex items-start gap-4">
          <CompanyMark name="Northwind Labs" size="lg" />
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold tracking-[-0.01em]">Frontend Developer Intern</p>
            <p className="text-sm text-muted">Northwind Labs</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink/80">
          <MetaItem icon={<Icon.Pin width={14} height={14} />}>Bengaluru</MetaItem>
          <MetaItem icon={<Icon.Briefcase width={14} height={14} />}>Internship</MetaItem>
          <MetaItem icon={<Icon.Wallet width={14} height={14} />}>₹3,60,000</MetaItem>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Tailwind CSS</Tag>
        </div>

        <div className="mt-7 border-t border-line pt-6">
          <ol className="relative grid grid-cols-3">
            <span className="absolute left-[16.66%] right-[16.66%] top-[13px] h-0.5 bg-line" />
            <span
              className="absolute left-[16.66%] top-[13px] h-0.5 bg-brand transition-[width] duration-700 ease-out"
              style={{ width: `${step * 33.33}%` }}
            />
            {trackerSteps.map((s, i) => {
              const done = i <= step;
              return (
                <li key={s.label} className="relative flex flex-col items-center gap-2">
                  <span
                    className={`flex size-7 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                      done ? "border-brand bg-brand text-white" : "border-line bg-white text-transparent"
                    }`}
                  >
                    <Icon.Check width={14} height={14} strokeWidth={2.6} />
                  </span>
                  <span className={`text-[13px] font-medium ${done ? "text-ink" : "text-muted"}`}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>

          <p
            className={`mt-5 rounded-lg px-4 py-3 text-sm transition-colors duration-500 ${
              accepted ? "bg-brand-soft text-brand-dark" : "bg-canvas text-muted"
            }`}
          >
            {trackerSteps[step].note}
          </p>
        </div>
      </div>
    </div>
  );
}

const flows = [
  {
    title: "For students",
    steps: [
      ["Create your account", "Sign up with your name and email. It takes under a minute."],
      ["Apply in one click", "Browse jobs and internships, read the details, and apply."],
      ["Watch your status", "Every application shows as pending, accepted or rejected."],
    ],
  },
  {
    title: "For recruiters",
    steps: [
      ["Post a job", "Add the role, location, pay and the skills you need."],
      ["Review applicants", "See everyone who applied, with their name and email."],
      ["Make a decision", "Accept or reject, and the student sees it right away."],
    ],
  },
];

function Home() {
  const { user } = useAuth();

  const primaryCta = user?.role === "recruiter"
    ? { to: "/recruiter/dashboard", label: "Go to my postings" }
    : { to: "/jobs", label: "Browse jobs" };

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
        <div>
          <h1 className="font-display text-[clamp(2.75rem,7vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.035em] text-ink">
            Apply once.
            <br />
            Know where you stand.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
            HireHub lists jobs and internships from companies hiring students. Apply in one click,
            then follow each application until you hear back.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={primaryCta.to} className={buttonClass("primary", "lg")}>
              {primaryCta.label}
            </Link>
            {!user && (
              <Link to="/register" className={buttonClass("secondary", "lg")}>
                Create an account
              </Link>
            )}
          </div>

          {!user && (
            <p className="mt-8 text-sm text-muted">
              Hiring?{" "}
              <Link to="/register" className="font-medium text-brand underline-offset-4 hover:underline">
                Post a job
              </Link>{" "}
              and review applicants in one place.
            </p>
          )}
        </div>

        <ApplicationTracker />
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">How HireHub works</h2>

          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
            {flows.map((flow) => (
              <div key={flow.title}>
                <h3 className="text-sm font-semibold text-brand">{flow.title}</h3>
                <ol className="mt-5 space-y-6">
                  {flow.steps.map(([title, body], i) => (
                    <li key={title} className="flex gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line font-display text-sm font-semibold text-ink">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{title}</p>
                        <p className="mt-1 text-[15px] leading-6 text-muted">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} HireHub</p>
        <p>Built for students and the teams hiring them.</p>
      </footer>
    </div>
  );
}

export default Home;
