// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import { getJobById } from "../services/job.service";
// import { applyForJob } from "../services/application.service";
// import { useAuth } from "../context/AuthContext";
// import type { Job } from "../types/job";
// import {
//   Alert,
//   CompanyMark,
//   EmptyState,
//   Icon,
//   Loading,
//   MetaItem,
//   Tag,
//   buttonClass,
//   formatDate,
//   formatSalary,
// } from "../components/ui";

// function JobDetails() {
//   const { id } = useParams();
//   const { user } = useAuth();

//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [applying, setApplying] = useState(false);
//   const [applied, setApplied] = useState(false);
//   const [applyError, setApplyError] = useState("");

//   useEffect(() => {
//     const fetchJob = async () => {
//       if (!id) {
//         setError("This link is missing a job ID.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const data = await getJobById(id);
//         setJob(data.job);
//       } catch (error) {
//         console.error(error);
//         setError("Couldn't load this job. It may have been removed.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJob();
//   }, [id]);

//   const handleApply = async () => {
//     if (!id) return;

//     try {
//       setApplying(true);
//       setApplyError("");
//       await applyForJob(id);
//       setApplied(true);
//     } catch (error: any) {
//       console.error(error);
//       setApplyError(error.response?.data?.message || "Couldn't send your application. Try again.");
//     } finally {
//       setApplying(false);
//     }
//   };

//   const backLink = (
//     <Link
//       to="/jobs"
//       className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted hover:text-ink"
//     >
//       <Icon.ArrowLeft /> All jobs
//     </Link>
//   );

//   if (loading) return <Loading label="Loading job…" />;

//   if (error || !job) {
//     return (
//       <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
//         {backLink}
//         <div className="mt-6">
//           <EmptyState
//             title="Job not found"
//             description={error || "This job doesn't exist or is no longer open."}
//             action={
//               <Link to="/jobs" className={buttonClass("primary", "md")}>
//                 Browse other jobs
//               </Link>
//             }
//           />
//         </div>
//       </div>
//     );
//   }

//   const salary = formatSalary(job.salary);

//   const facts = [
//     { label: "Salary", value: salary ?? "Not disclosed" },
//     { label: "Job type", value: job.jobType },
//     { label: "Experience", value: job.experience },
//     { label: "Location", value: job.location },
//     { label: "Posted", value: formatDate(job.createdAt) },
//   ];

//   return (
//     <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
//       {backLink}

//       <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
//         {/* Main */}
//         <article className="rounded-xl border border-line bg-white p-6 sm:p-9">
//           <header className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-center">
//             <CompanyMark name={job.company} size="lg" />
//             <div>
//               <p className="text-sm font-medium text-muted">{job.company}</p>
//               <h1 className="mt-1 font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
//                 {job.title}
//               </h1>
//               <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/80">
//                 <MetaItem icon={<Icon.Pin width={15} height={15} />}>{job.location}</MetaItem>
//                 <MetaItem icon={<Icon.Briefcase width={15} height={15} />}>{job.jobType}</MetaItem>
//               </div>
//             </div>
//           </header>

//           <section className="pt-7">
//             <h2 className="font-display text-lg font-semibold">About the role</h2>
//             <p className="mt-3 max-w-[68ch] whitespace-pre-line text-[15px] leading-7 text-ink/80">
//               {job.description}
//             </p>
//           </section>

//           {job.skills?.length > 0 && (
//             <section className="pt-8">
//               <h2 className="font-display text-lg font-semibold">Skills you'll need</h2>
//               <div className="mt-3 flex flex-wrap gap-2">
//                 {job.skills.map((skill) => (
//                   <Tag key={skill}>{skill}</Tag>
//                 ))}
//               </div>
//             </section>
//           )}
//         </article>

//         {/* Apply panel */}
//         <aside className="self-start rounded-xl border border-line bg-white p-6 lg:sticky lg:top-24">
//           <dl className="divide-y divide-line">
//             {facts.map((f) => (
//               <div key={f.label} className="flex justify-between gap-4 py-3 text-sm first:pt-0">
//                 <dt className="text-muted">{f.label}</dt>
//                 <dd className="text-right font-medium text-ink">{f.value}</dd>
//               </div>
//             ))}
//           </dl>

//           <div className="mt-5 space-y-3">
//             {!user && (
//               <>
//                 <Link to="/login" className={buttonClass("primary", "lg", "w-full")}>
//                   Log in to apply
//                 </Link>
//                 <p className="text-center text-[13px] text-muted">
//                   New here?{" "}
//                   <Link to="/register" className="font-medium text-brand hover:underline">
//                     Create an account
//                   </Link>
//                 </p>
//               </>
//             )}

//             {user?.role === "student" && (
//               <>
//                 <button
//                   onClick={handleApply}
//                   disabled={applying || applied}
//                   className={buttonClass("primary", "lg", "w-full")}
//                 >
//                   {applied ? (
//                     <>
//                       <Icon.Check /> Applied
//                     </>
//                   ) : applying ? (
//                     "Applying…"
//                   ) : (
//                     "Apply now"
//                   )}
//                 </button>

//                 {applied && (
//                   <Alert tone="success">
//                     Application sent. Track its status in{" "}
//                     <Link to="/student/dashboard" className="font-semibold underline underline-offset-2">
//                       My applications
//                     </Link>
//                     .
//                   </Alert>
//                 )}

//                 {applyError && <Alert>{applyError}</Alert>}
//               </>
//             )}

//             {user?.role === "recruiter" && (
//               <Alert tone="info">You're signed in as a recruiter. Only student accounts can apply.</Alert>
//             )}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

// export default JobDetails;





import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getJobById } from "../services/job.service";
import { applyForJob } from "../services/application.service";
import { getProfile } from "../services/user.service";
import { useAuth } from "../context/AuthContext";
import type { Job } from "../types/job";
import {
  Alert,
  CompanyMark,
  EmptyState,
  Icon,
  Loading,
  MetaItem,
  Tag,
  buttonClass,
  formatDate,
  formatSalary,
} from "../components/ui";

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");

  // null = still checking, true/false = known
  const [hasResume, setHasResume] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.role !== "student") return;

    const checkResume = async () => {
      try {
        const data = await getProfile();
        setHasResume(Boolean(data.user?.resume?.url));
      } catch (error) {
        console.error(error);
        setHasResume(false);
      }
    };

    checkResume();
  }, [user?.role]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError("This link is missing a job ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getJobById(id);
        setJob(data.job);
      } catch (error) {
        console.error(error);
        setError("Couldn't load this job. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!id || !hasResume) return;

    try {
      setApplying(true);
      setApplyError("");
      await applyForJob(id);
      setApplied(true);
    } catch (error: any) {
      console.error(error);
      setApplyError(error.response?.data?.message || "Couldn't send your application. Try again.");
    } finally {
      setApplying(false);
    }
  };

  const backLink = (
    <Link
      to="/jobs"
      className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted hover:text-ink"
    >
      <Icon.ArrowLeft /> All jobs
    </Link>
  );

  if (loading) return <Loading label="Loading job…" />;

  if (error || !job) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        {backLink}
        <div className="mt-6">
          <EmptyState
            title="Job not found"
            description={error || "This job doesn't exist or is no longer open."}
            action={
              <Link to="/jobs" className={buttonClass("primary", "md")}>
                Browse other jobs
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const salary = formatSalary(job.salary);

  const facts = [
    { label: "Salary", value: salary ?? "Not disclosed" },
    { label: "Job type", value: job.jobType },
    { label: "Experience", value: job.experience },
    { label: "Location", value: job.location },
    { label: "Posted", value: formatDate(job.createdAt) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
      {backLink}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        {/* Main */}
        <article className="rounded-xl border border-line bg-white p-6 sm:p-9">
          <header className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-center">
            <CompanyMark name={job.company} size="lg" />
            <div>
              <p className="text-sm font-medium text-muted">{job.company}</p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/80">
                <MetaItem icon={<Icon.Pin width={15} height={15} />}>{job.location}</MetaItem>
                <MetaItem icon={<Icon.Briefcase width={15} height={15} />}>{job.jobType}</MetaItem>
              </div>
            </div>
          </header>

          <section className="pt-7">
            <h2 className="font-display text-lg font-semibold">About the role</h2>
            <p className="mt-3 max-w-[68ch] whitespace-pre-line text-[15px] leading-7 text-ink/80">
              {job.description}
            </p>
          </section>

          {job.skills?.length > 0 && (
            <section className="pt-8">
              <h2 className="font-display text-lg font-semibold">Skills you'll need</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Apply panel */}
        <aside className="self-start rounded-xl border border-line bg-white p-6 lg:sticky lg:top-24">
          <dl className="divide-y divide-line">
            {facts.map((f) => (
              <div key={f.label} className="flex justify-between gap-4 py-3 text-sm first:pt-0">
                <dt className="text-muted">{f.label}</dt>
                <dd className="text-right font-medium text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 space-y-3">
            {!user && (
              <>
                <Link to="/login" className={buttonClass("primary", "lg", "w-full")}>
                  Log in to apply
                </Link>
                <p className="text-center text-[13px] text-muted">
                  New here?{" "}
                  <Link to="/register" className="font-medium text-brand hover:underline">
                    Create an account
                  </Link>
                </p>
              </>
            )}

            {user?.role === "student" && (
              <>
                <button
                  onClick={handleApply}
                  disabled={applying || applied || hasResume !== true}
                  className={buttonClass("primary", "lg", "w-full")}
                >
                  {applied ? (
                    <>
                      <Icon.Check /> Applied
                    </>
                  ) : applying ? (
                    "Applying…"
                  ) : hasResume === null ? (
                    "Checking profile…"
                  ) : (
                    "Apply now"
                  )}
                </button>

                {hasResume === false && !applied && (
                  <Alert tone="info">
                    You need to upload your resume before applying.{" "}
                    <Link to="/student/profile" className="font-semibold text-brand underline underline-offset-2">
                      Upload resume
                    </Link>
                  </Alert>
                )}

                {applied && (
                  <Alert tone="success">
                    Application sent. Track its status in{" "}
                    <Link to="/student/dashboard" className="font-semibold underline underline-offset-2">
                      My applications
                    </Link>
                    .
                  </Alert>
                )}

                {applyError && <Alert>{applyError}</Alert>}
              </>
            )}

            {user?.role === "recruiter" && (
              <Alert tone="info">You're signed in as a recruiter. Only student accounts can apply.</Alert>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default JobDetails;