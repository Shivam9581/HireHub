import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <AuthLayout
      title="Create your account"
      description="Free for students and recruiters."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
