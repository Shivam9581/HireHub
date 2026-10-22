import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/auth.services";
import { useAuth } from "../context/AuthContext";
import { Alert, Field, buttonClass, inputClass } from "./ui";

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({ email, password });

      login(response.user, response.token);

      // Send each role to its home screen after logging in
      navigate(
        response.user.role === "recruiter" ? "/recruiter/dashboard" : "/student/dashboard"
      );
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Email or password is incorrect. Check both and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@college.edu"
          required
          className={inputClass}
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          className={inputClass}
        />
      </Field>

      {error && <Alert>{error}</Alert>}

      <button type="submit" disabled={loading} className={buttonClass("primary", "lg", "w-full")}>
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

export default LoginForm;
