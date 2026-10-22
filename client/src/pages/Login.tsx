import { Link, useLocation } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import { Alert } from "../components/ui";

function Login() {
  const location = useLocation();
  const registered = (location.state as { registered?: boolean } | null)?.registered;

  return (
    <AuthLayout
      title="Log in to HireHub"
      description="Pick up where you left off."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      {registered && (
        <div className="mb-6">
          <Alert tone="success">Account created. Log in to continue.</Alert>
        </div>
      )}
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
