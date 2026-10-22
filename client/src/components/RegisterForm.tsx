import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/auth.services";
import { Alert, Field, buttonClass, inputClass } from "./ui";

const roles = [
  { value: "student", title: "I'm a student", body: "Find jobs and internships" },
  { value: "recruiter", title: "I'm hiring", body: "Post jobs and review applicants" },
] as const;

function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "recruiter">("student");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password, role });
      navigate("/login", { state: { registered: true } });
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Couldn't create your account. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-ink">Account type</legend>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <label key={r.value} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="peer sr-only"
              />
              <span className="block h-full rounded-lg border border-line bg-white p-3.5 transition-colors peer-checked:border-brand peer-checked:bg-brand-soft/60 peer-checked:ring-1 peer-checked:ring-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-ink/25">
                <span className="block text-sm font-semibold text-ink">{r.title}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-muted">{r.body}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Full name" htmlFor="name">
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
          required
        />
      </Field>

      <Field label={role === "recruiter" ? "Work email" : "Email"} htmlFor="email">
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={role === "recruiter" ? "you@company.com" : "you@college.edu"}
          className={inputClass}
          required
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
          className={inputClass}
          required
        />
      </Field>

      {error && <Alert>{error}</Alert>}

      <button type="submit" disabled={loading} className={buttonClass("primary", "lg", "w-full")}>
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export default RegisterForm;
