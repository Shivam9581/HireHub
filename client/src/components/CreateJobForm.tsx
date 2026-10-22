import { useState } from "react";

import { createJob } from "../services/job.service";
import JobFields, { emptyJobForm, formToJobData } from "./JobFields";
import { Alert, buttonClass } from "./ui";

interface CreateJobFormProps {
  onJobCreated: () => void;
  onCancel?: () => void;
}

function CreateJobForm({ onJobCreated, onCancel }: CreateJobFormProps) {
  const [values, setValues] = useState(emptyJobForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createJob(formToJobData(values));
      setValues(emptyJobForm);
      onJobCreated();
    } catch (error: any) {
      console.error("Create job error:", error);
      setError(error.response?.data?.message || "Couldn't publish this job. Check the fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <JobFields values={values} onChange={setValues} idPrefix="create" />

      {error && <Alert>{error}</Alert>}

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <button type="submit" disabled={loading} className={buttonClass("primary", "md")}>
          {loading ? "Publishing…" : "Publish job"}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonClass("secondary", "md")}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CreateJobForm;
