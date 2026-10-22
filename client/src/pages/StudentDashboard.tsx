import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyApplications } from "../services/application.service";
import { useAuth } from "../context/AuthContext";
import type { Application } from "../types/application";
import {
  Alert,
  CompanyMark,
  EmptyState,
  Loading,
  PageHeader,
  StatusBadge,
  buttonClass,
  formatDate,
} from "../components/ui";

function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data.applications);
      } catch (error) {
        console.error(error);
        setError("Couldn't load your applications. Refresh the page to try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const count = (status: string) => applications.filter((a) => a.status === status).length;

  const summary = [
    { label: "Total", value: applications.length },
    { label: "Pending", value: count("pending") },
    { label: "Accepted", value: count("accepted") },
    { label: "Rejected", value: count("rejected") },
  ];

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <PageHeader
        title={firstName ? `Hi, ${firstName}` : "My applications"}
        description="Every job you've applied to, and where each one stands."
        action={
          <Link to="/jobs" className={buttonClass("primary", "md")}>
            Browse jobs
          </Link>
        }
      />

      {loading ? (
        <Loading label="Loading your applications…" />
      ) : error ? (
        <div className="mt-8">
          <Alert>{error}</Alert>
        </div>
      ) : (
        <>
          <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-white sm:grid-cols-4">
            {summary.map((s, i) => (
              <div
                key={s.label}
                className={`px-5 py-4 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}
              >
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-12 font-display text-xl font-semibold">Applications</h2>

          <div className="mt-4">
            {applications.length === 0 ? (
              <EmptyState
                title="You haven't applied anywhere yet"
                description="Find a job or internship that fits your skills. Applications you send will show up here."
                action={
                  <Link to="/jobs" className={buttonClass("primary", "md")}>
                    Browse jobs
                  </Link>
                }
              />
            ) : (
              <div className="overflow-hidden rounded-xl border border-line bg-white">
                <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_8rem_7rem] gap-4 border-b border-line bg-canvas/60 px-6 py-3 text-[13px] font-medium text-muted md:grid">
                  <span>Role</span>
                  <span>Location</span>
                  <span>Applied</span>
                  <span>Status</span>
                </div>

                <ul className="divide-y divide-line">
                  {applications.map((application) => {
                    const job = application.job;

                    return (
                      <li
                        key={application._id}
                        className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_8rem_7rem] md:items-center md:gap-4 md:px-6"
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <CompanyMark name={job?.company ?? "?"} />
                          <div className="min-w-0">
                            {job ? (
                              <Link
                                to={`/jobs/${job._id}`}
                                className="block truncate font-semibold text-ink hover:text-brand"
                              >
                                {job.title}
                              </Link>
                            ) : (
                              <p className="font-semibold text-muted">Job no longer listed</p>
                            )}
                            <p className="truncate text-sm text-muted">{job?.company}</p>
                          </div>
                        </div>

                        <span className="text-sm text-ink/80 md:truncate">
                          <span className="text-muted md:hidden">Location: </span>
                          {job?.location ?? "—"}
                        </span>
                        <span className="text-sm text-ink/80">
                          <span className="text-muted md:hidden">Applied: </span>
                          {formatDate(application.createdAt)}
                        </span>
                        <span>
                          <StatusBadge status={application.status} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StudentDashboard;
