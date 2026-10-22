// import { Link } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";
// import { Avatar, PageHeader, buttonClass } from "../components/ui";

// function Profile() {
//   const { user } = useAuth();

//   if (!user) return null;

//   const rows = [
//     { label: "Full name", value: user.name },
//     { label: "Email", value: user.email },
//     { label: "Account type", value: user.role === "student" ? "Student" : "Recruiter" },
//   ];

//   return (
//     <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
//       <PageHeader title="Profile" description="Your account details." />

//       <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
//         <div className="flex items-center gap-5 border-b border-line p-6 sm:p-8">
//           <Avatar name={user.name} size="lg" />
//           <div className="min-w-0">
//             <p className="truncate font-display text-2xl font-semibold tracking-[-0.01em]">{user.name}</p>
//             <p className="truncate text-sm text-muted">{user.email}</p>
//           </div>
//         </div>

//         <dl className="divide-y divide-line px-6 sm:px-8">
//           {rows.map((row) => (
//             <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
//               <dt className="text-sm text-muted">{row.label}</dt>
//               <dd className="break-all text-[15px] font-medium text-ink">{row.value}</dd>
//             </div>
//           ))}
//         </dl>
//       </div>

//       <div className="mt-6 flex flex-wrap gap-3">
//         <Link to="/student/dashboard" className={buttonClass("primary", "md")}>
//           View my applications
//         </Link>
//         <Link to="/jobs" className={buttonClass("secondary", "md")}>
//           Browse jobs
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Profile;





import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { deleteResume, getProfile, uploadResume } from "../services/user.service";
import type { Resume } from "../types/auth";
import { Alert, Avatar, PageHeader, buttonClass } from "../components/ui";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB, same as the backend limit

function Profile() {
  const { user } = useAuth();

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"upload" | "delete" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setResume(data.user?.resume?.url ? data.user.resume : null);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Couldn't load your resume. Refresh the page to try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the user pick the same file again later

    if (!file) return;

    setError("");
    setSuccess("");

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("The file is too large. Maximum size is 5 MB.");
      return;
    }

    try {
      setBusy("upload");
      const data = await uploadResume(file);
      setResume({ url: data.resume.url });
      setSuccess("Resume uploaded successfully.");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Couldn't upload your resume. Try again.");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your resume? You won't be able to apply for jobs until you upload a new one.")) {
      return;
    }

    try {
      setBusy("delete");
      setError("");
      setSuccess("");
      await deleteResume();
      setResume(null);
      setSuccess("Resume deleted.");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Couldn't delete your resume. Try again.");
    } finally {
      setBusy(null);
    }
  };

  const rows = [
    { label: "Full name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Account type", value: user.role === "student" ? "Student" : "Recruiter" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
      <PageHeader title="Profile" description="Your account details." />

      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex items-center gap-5 border-b border-line p-6 sm:p-8">
          <Avatar name={user.name} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-display text-2xl font-semibold tracking-[-0.01em]">{user.name}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <dl className="divide-y divide-line px-6 sm:px-8">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="break-all text-[15px] font-medium text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Resume */}
      <section className="mt-6 rounded-xl border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">Resume</h2>
        <p className="mt-1 text-sm text-muted">
          A PDF resume (max 5 MB) is required before you can apply for any job.
        </p>

        <div className="mt-5 space-y-4">
          {error && <Alert>{error}</Alert>}
          {success && <Alert tone="success">{success}</Alert>}

          {loading ? (
            <p className="text-sm text-muted">Loading your resume…</p>
          ) : (
            <>
              <p className="text-[15px] font-medium text-ink">
                {resume ? "Your resume is uploaded." : "You haven't uploaded a resume yet."}
              </p>

              <div className="flex flex-wrap gap-3">
                {resume && (
                  <a
                    href={resume.url}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClass("secondary", "md")}
                  >
                    View resume
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={busy !== null}
                  className={buttonClass(resume ? "secondary" : "primary", "md")}
                >
                  {busy === "upload" ? "Uploading…" : resume ? "Replace resume" : "Upload resume (PDF)"}
                </button>

                {resume && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={busy !== null}
                    className={buttonClass("secondary", "md", "hover:border-danger/40 hover:text-danger")}
                  >
                    {busy === "delete" ? "Deleting…" : "Delete"}
                  </button>
                )}

                <input
                  ref={fileInput}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </>
          )}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/student/dashboard" className={buttonClass("primary", "md")}>
          View my applications
        </Link>
        <Link to="/jobs" className={buttonClass("secondary", "md")}>
          Browse jobs
        </Link>
      </div>
    </div>
  );
}

export default Profile;