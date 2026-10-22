import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getApplicants, updateApplicationStatus } from "../services/application.service";
import type { Applicant } from "../types/application";
import {
  Alert,
  Avatar,
  EmptyState,
  Icon,
  Loading,
  PageHeader,
  StatusBadge,
  buttonClass,
  formatDate,
} from "../components/ui";

const filters = ["all", "pending", "accepted", "rejected"] as const;
type Filter = (typeof filters)[number];

const filterLabels: Record<Filter, string> = {
  all: "All",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

function Applicants() {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");
      if (!jobId) {
        setError("This link is missing a job ID.");
        return;
      }
      const data = await getApplicants(jobId);
      setApplicants(data.applicants || []);
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Couldn't load applicants. Refresh the page to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId: string, status: "accepted" | "rejected") => {
    try {
      setUpdatingId(applicationId);
      setError("");
      await updateApplicationStatus(applicationId, status);

      setApplicants((current) =>
        current.map((a) => (a._id === applicationId ? { ...a, status } : a))
      );
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Couldn't update this application. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const countFor = (f: Filter) =>
    f === "all" ? applicants.length : applicants.filter((a) => a.status === f).length;

  const visible = filter === "all" ? applicants : applicants.filter((a) => a.status === filter);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
      <PageHeader
        title="Applicants"
        description="Review each applicant and accept or reject them. Students see your decision on their dashboard."
      >
        <Link
          to="/recruiter/dashboard"
          className="mb-4 inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted hover:text-ink"
        >
          <Icon.ArrowLeft /> My postings
        </Link>
      </PageHeader>

      {loading ? (
        <Loading label="Loading applicants…" />
      ) : (
        <div className="mt-8 space-y-4">
          {error && <Alert>{error}</Alert>}

          {applicants.length === 0 && !error ? (
            <EmptyState
              title="No applicants yet"
              description="When students apply to this job, they'll appear here for you to review."
            />
          ) : (
            applicants.length > 0 && (
              <>
                <div role="group" aria-label="Filter applicants by status" className="flex gap-1 overflow-x-auto border-b border-line">
                  {filters.map((f) => (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={filter === f}
                      onClick={() => setFilter(f)}
                      className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                        filter === f
                          ? "border-brand text-ink"
                          : "border-transparent text-muted hover:text-ink"
                      }`}
                    >
                      {filterLabels[f]}
                      <span className="ml-1.5 rounded-full bg-canvas px-1.5 py-0.5 text-xs tabular-nums text-muted">
                        {countFor(f)}
                      </span>
                    </button>
                  ))}
                </div>

                {visible.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted">
                    No {filterLabels[filter].toLowerCase()} applicants.
                  </p>
                ) : (
                  <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
                    {visible.map((applicant) => {
                      const busy = updatingId === applicant._id;

                      return (
                        <li
                          key={applicant._id}
                          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <Avatar name={applicant.student.name} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-ink">{applicant.student.name}</p>
                              <a
                                href={`mailto:${applicant.student.email}`}
                                className="inline-flex max-w-full items-center gap-1.5 truncate text-sm text-muted hover:text-brand"
                              >
                                <Icon.Mail width={14} height={14} className="shrink-0" />
                                <span className="truncate">{applicant.student.email}</span>
                              </a>


                               <p className="mt-0.5 text-[13px] text-muted">
                                Applied {formatDate(applicant.createdAt)}
                              </p>
                              {applicant.student.resume?.url ? (
                                <a
                                  href={applicant.student.resume.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-1 inline-block text-sm font-medium text-brand hover:underline"
                                >
                                  View resume
                                </a>
                              ) : (
                                <p className="mt-1 text-[13px] text-muted">No resume uploaded</p>
                              )}                             

                             
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                            {applicant.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(applicant._id, "accepted")}
                                  disabled={busy}
                                  className={buttonClass("primary", "sm")}
                                >
                                  {busy ? "Saving…" : "Accept"}
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(applicant._id, "rejected")}
                                  disabled={busy}
                                  className={buttonClass("secondary", "sm", "hover:border-danger/40 hover:text-danger")}
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <StatusBadge status={applicant.status} />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Applicants;
