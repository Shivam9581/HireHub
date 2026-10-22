import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyJobs, updateJob, deleteJob } from "../services/job.service";
import type { Job } from "../types/job";
import JobFields, { formToJobData, jobToForm, type JobFormValues } from "./JobFields";
import {
  Alert,
  CompanyMark,
  EmptyState,
  Icon,
  Loading,
  MetaItem,
  buttonClass,
  formatSalary,
  timeAgo,
} from "./ui";

interface MyJobsProps {
  refreshJobs: number;
  onCreateClick?: () => void;
}

function MyJobs({ refreshJobs, onCreateClick }: MyJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<JobFormValues | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyJobs();
      setJobs(data.jobs);
    } catch (error) {
      console.error(error);
      setError("Couldn't load your job postings. Refresh the page to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [refreshJobs]);

  const closeEditor = () => {
    setEditingId(null);
    setEditValues(null);
    setEditError("");
  };

  // Escape closes the edit dialog; lock page scroll while it is open
  useEffect(() => {
    if (!editingId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeEditor();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [editingId]);

  const handleEdit = (job: Job) => {
    setEditingId(job._id);
    setEditValues(jobToForm(job));
    setMessage("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editValues) return;

    setUpdating(true);
    setEditError("");

    try {
      await updateJob(editingId, formToJobData(editValues));
      setMessage("Changes saved.");
      closeEditor();
      await fetchMyJobs();
    } catch (error: any) {
      console.error(error);
      setEditError(error.response?.data?.message || "Couldn't save changes. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (job: Job) => {
    const confirmed = window.confirm(
      `Delete "${job.title}"? Students will no longer see it, and this can't be undone.`
    );
    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await deleteJob(job._id);
      setMessage(`"${job.title}" deleted.`);
      await fetchMyJobs();
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Couldn't delete this job. Try again.");
    }
  };

  if (loading && jobs.length === 0) {
    return <Loading label="Loading your postings…" />;
  }

  return (
    <section className="space-y-4">
      {error && <Alert>{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs posted yet"
          description="Publish your first opening and students will be able to find and apply to it right away."
          action={
            onCreateClick && (
              <button onClick={onCreateClick} className={buttonClass("primary", "md")}>
                <Icon.Plus /> Post a job
              </button>
            )
          }
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {jobs.map((job) => {
            const salary = formatSalary(job.salary);

            return (
              <li key={job._id} className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 gap-4">
                  <CompanyMark name={job.company} />

                  <div className="min-w-0">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="font-display text-lg font-semibold tracking-[-0.01em] text-ink hover:text-brand"
                    >
                      {job.title}
                    </Link>
                    <p className="text-sm text-muted">{job.company}</p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink/80">
                      <MetaItem icon={<Icon.Pin width={14} height={14} />}>{job.location}</MetaItem>
                      <MetaItem icon={<Icon.Briefcase width={14} height={14} />}>{job.jobType}</MetaItem>
                      {salary && <MetaItem icon={<Icon.Wallet width={14} height={14} />}>{salary}</MetaItem>}
                      <MetaItem icon={<Icon.Clock width={14} height={14} />}>Posted {timeAgo(job.createdAt).toLowerCase()}</MetaItem>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                  <Link to={`/recruiter/jobs/${job._id}/applicants`} className={buttonClass("primary", "sm")}>
                    View applicants
                  </Link>
                  <button onClick={() => handleEdit(job)} className={buttonClass("secondary", "sm")}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job)}
                    className={buttonClass("ghost", "sm", "text-danger hover:bg-danger-soft hover:text-danger")}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Edit dialog */}
      {editingId && editValues && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-6"
          onMouseDown={(e) => e.target === e.currentTarget && closeEditor()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-job-heading"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-4">
              <h2 id="edit-job-heading" className="font-display text-xl font-semibold">
                Edit job
              </h2>
              <button onClick={closeEditor} className={buttonClass("ghost", "sm")} aria-label="Close">
                <Icon.Close width={18} height={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6 p-6">
              <JobFields values={editValues} onChange={setEditValues} idPrefix="edit" />

              {editError && <Alert>{editError}</Alert>}

              <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-6">
                <button type="button" onClick={closeEditor} className={buttonClass("secondary", "md")}>
                  Cancel
                </button>
                <button type="submit" disabled={updating} className={buttonClass("primary", "md")}>
                  {updating ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyJobs;
