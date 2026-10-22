import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import StudentDashboard from "../pages/StudentDashboard";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import Profile from "../pages/Profile";

import ProtectedRoute from "./ProtectedRoute";

import Applicants from "../pages/Applicants";

function AppRoutes() {
  return (
    <Routes>

      {/* Public routes */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/jobs"
        element={<Jobs />}
      />

      <Route
        path="/jobs/:id"
        element={<JobDetails />}
      />


      {/* Student routes */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          />
        }
      >
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/profile"
          element={<Profile />}
        />
      </Route>


      {/* Recruiter routes */}

      <Route
        element={<ProtectedRoute allowedRoles={["recruiter"]}/>}>
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route path="/recruiter/jobs/:jobId/applicants"
        element = {<Applicants/>}/>
      </Route>

    </Routes>
  );
}

export default AppRoutes;