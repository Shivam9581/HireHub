import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "../services/job.service";
import type { Job } from "../types/job";
import {
  Alert,
  CompanyMark,
  EmptyState,
  Icon,
  Loading,
  MetaItem,
  PageHeader,
  Tag,
  buttonClass,
  formatSalary,
  inputClass,
  timeAgo,
} from "../components/ui";

const jobTypes = ["All", "Full-time", "Part-time", "Internship"] as const;
type TypeFilter = (typeof jobTypes)[number];

function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("All");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data.jobs);
      } catch (error) {
        console.error(error);
        setError("Couldn't load jobs. Check your connection and refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (type !== "All" && job.jobType !== type) return false;
      if (!q) return true;
      return [job.title, job.company, job.location, ...(job.skills ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [jobs, query, type]);

  const clearFilters = () => {
    setQuery("");
    setType("All");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <PageHeader
        title="Jobs and internships"
        description={
          loading
            ? "Openings from companies hiring students."
            : `${jobs.length} ${jobs.length === 1 ? "opening" : "openings"} from companies hiring students.`
        }
      />

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Icon.Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width={18} height={18} />
          <label htmlFor="job-search" className="sr-only">
            Search jobs
          </label>
          <input
            id="job-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, company, city or skill"
            className={`${inputClass} pl-10`}
          />
        </div>

        <div role="group" aria-label="Filter by job type" className="flex gap-1 overflow-x-auto rounded-lg border border-line bg-white p-1">
          {jobTypes.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`cursor-pointer whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                type === t ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loading label="Loading jobs…" />
        ) : error ? (
          <Alert>{error}</Alert>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No openings yet"
            description="New jobs show up here as soon as recruiters publish them. Check back soon."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No jobs match your search"
            description="Try a different keyword or job type."
            action={
              <button onClick={clearFilters} className={buttonClass("secondary", "md")}>
                Clear filters
              </button>
            }
          />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {filtered.map((job) => {
              const salary = formatSalary(job.salary);
              const skills = job.skills ?? [];

              return (
                <li key={job._id}>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="group flex gap-4 p-5 transition-colors hover:bg-canvas/60 focus-visible:bg-canvas/60 focus-visible:outline-none sm:gap-5 sm:p-6"
                  >
                    <CompanyMark name={job.company} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-ink group-hover:text-brand">
                          {job.title}
                        </h2>
                        <span className="shrink-0 text-[13px] text-muted">{timeAgo(job.createdAt)}</span>
                      </div>

                      <p className="text-sm text-muted">{job.company}</p>

                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink/80">
                        <MetaItem icon={<Icon.Pin width={14} height={14} />}>{job.location}</MetaItem>
                        <MetaItem icon={<Icon.Briefcase width={14} height={14} />}>{job.jobType}</MetaItem>
                        <MetaItem icon={<Icon.Clock width={14} height={14} />}>{job.experience}</MetaItem>
                        {salary && <MetaItem icon={<Icon.Wallet width={14} height={14} />}>{salary}</MetaItem>}
                      </div>

                      <p className="mt-3 line-clamp-2 max-w-3xl text-[15px] leading-6 text-muted">
                        {job.description}
                      </p>

                      {skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {skills.slice(0, 5).map((skill) => (
                            <Tag key={skill}>{skill}</Tag>
                          ))}
                          {skills.length > 5 && <Tag>+{skills.length - 5} more</Tag>}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Jobs;
