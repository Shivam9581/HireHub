import type { ChangeEvent } from "react";

import type { CreateJobData } from "../services/job.service";
import type { Job } from "../types/job";
import { Field, inputClass } from "./ui";

/** Form state for creating or editing a job. Skills and salary stay as raw text while typing. */
export interface JobFormValues {
  title: string;
  company: string;
  location: string;
  jobType: Job["jobType"];
  experience: string;
  salary: string;
  skills: string;
  description: string;
}

export const emptyJobForm: JobFormValues = {
  title: "",
  company: "",
  location: "",
  jobType: "Full-time",
  experience: "",
  salary: "",
  skills: "",
  description: "",
};

export function jobToForm(job: Job): JobFormValues {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    jobType: job.jobType,
    experience: job.experience,
    salary: job.salary !== undefined && job.salary !== null ? String(job.salary) : "",
    skills: job.skills.join(", "),
    description: job.description,
  };
}

export function formToJobData(values: JobFormValues): CreateJobData {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    description: values.description.trim(),
    location: values.location.trim(),
    salary: values.salary ? Number(values.salary) : undefined,
    skills: values.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    jobType: values.jobType,
    experience: values.experience.trim(),
  };
}

interface JobFieldsProps {
  values: JobFormValues;
  onChange: (values: JobFormValues) => void;
  idPrefix: string;
}

function JobFields({ values, onChange, idPrefix }: JobFieldsProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  const set =
    (key: keyof JobFormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ ...values, [key]: e.target.value } as JobFormValues);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Job title" htmlFor={id("title")}>
        <input
          id={id("title")}
          type="text"
          value={values.title}
          onChange={set("title")}
          placeholder="Frontend Developer"
          className={inputClass}
          required
        />
      </Field>

      <Field label="Company" htmlFor={id("company")}>
        <input
          id={id("company")}
          type="text"
          value={values.company}
          onChange={set("company")}
          placeholder="Your company name"
          className={inputClass}
          required
        />
      </Field>

      <Field label="Location" htmlFor={id("location")}>
        <input
          id={id("location")}
          type="text"
          value={values.location}
          onChange={set("location")}
          placeholder="Bengaluru, or Remote"
          className={inputClass}
          required
        />
      </Field>

      <Field label="Job type" htmlFor={id("jobType")}>
        <select
          id={id("jobType")}
          value={values.jobType}
          onChange={set("jobType")}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>
      </Field>

      <Field label="Experience" htmlFor={id("experience")}>
        <input
          id={id("experience")}
          type="text"
          value={values.experience}
          onChange={set("experience")}
          placeholder="0–2 years"
          className={inputClass}
          required
        />
      </Field>

      <Field label="Salary (₹, optional)" htmlFor={id("salary")}>
        <input
          id={id("salary")}
          type="number"
          min={0}
          inputMode="numeric"
          value={values.salary}
          onChange={set("salary")}
          placeholder="800000"
          className={inputClass}
        />
      </Field>

      <Field
        label="Skills"
        htmlFor={id("skills")}
        hint="Separate skills with commas."
        className="sm:col-span-2"
      >
        <input
          id={id("skills")}
          type="text"
          value={values.skills}
          onChange={set("skills")}
          placeholder="React, Node.js, MongoDB"
          className={inputClass}
          required
        />
      </Field>

      <Field label="Description" htmlFor={id("description")} className="sm:col-span-2">
        <textarea
          id={id("description")}
          value={values.description}
          onChange={set("description")}
          placeholder="What will this person work on, and what should they already know?"
          rows={6}
          className={`${inputClass} resize-y leading-6`}
          required
        />
      </Field>
    </div>
  );
}

export default JobFields;
