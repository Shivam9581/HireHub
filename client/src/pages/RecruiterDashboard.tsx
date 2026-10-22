import { useState } from "react";

import CreateJobForm from "../components/CreateJobForm";
import MyJobs from "../components/MyJobs";
import { Alert, Icon, PageHeader, buttonClass } from "../components/ui";

function RecruiterDashboard() {
  const [refreshJobs, setRefreshJobs] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [flash, setFlash] = useState("");

  const openForm = () => {
    setFlash("");
    setShowForm(true);
  };

  const handleJobCreated = () => {
    setRefreshJobs((prev) => prev + 1);
    setShowForm(false);
    setFlash("Job published. Students can find it on the jobs page now.");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <PageHeader
        title="My postings"
        description="Publish openings, update them, and review who applied."
        action={
          !showForm && (
            <button onClick={openForm} className={buttonClass("primary", "md")}>
              <Icon.Plus /> Post a job
            </button>
          )
        }
      />

      <div className="mt-8 space-y-6">
        {flash && <Alert tone="success">{flash}</Alert>}

        {showForm && (
          <section className="rounded-xl border border-line bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Post a job</h2>
            <p className="mt-1 text-sm text-muted">
              Students see this exactly as you write it, so be specific about the work and the skills.
            </p>
            <div className="mt-7">
              <CreateJobForm onJobCreated={handleJobCreated} onCancel={() => setShowForm(false)} />
            </div>
          </section>
        )}

        <MyJobs refreshJobs={refreshJobs} onCreateClick={openForm} />
      </div>
    </div>
  );
}

export default RecruiterDashboard;
