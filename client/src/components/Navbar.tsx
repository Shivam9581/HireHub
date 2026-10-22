import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Avatar, Icon, buttonClass } from "./ui";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-canvas text-ink" : "text-muted hover:text-ink"
  }`;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand font-display text-base font-bold text-white">
        H
      </span>
      <span className="font-display text-xl font-bold tracking-[-0.02em] text-ink">HireHub</span>
    </Link>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = (
    <>
      <NavLink to="/jobs" className={linkClass}>
        Jobs
      </NavLink>

      {user?.role === "student" && (
        <>
          <NavLink to="/student/dashboard" className={linkClass}>
            My applications
          </NavLink>
          <NavLink to="/student/profile" className={linkClass}>
            Profile
          </NavLink>
        </>
      )}

      {user?.role === "recruiter" && (
        <NavLink to="/recruiter/dashboard" className={linkClass}>
          My postings
        </NavLink>
      )}
    </>
  );

  const account = user ? (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5">
        <Avatar name={user.name} size="sm" />
        <div className="leading-tight">
          <p className="max-w-[10rem] truncate text-sm font-medium text-ink">{user.name}</p>
          <p className="text-xs capitalize text-muted">{user.role}</p>
        </div>
      </div>
      <button onClick={handleLogout} className={buttonClass("secondary", "sm")}>
        Log out
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link to="/login" className={buttonClass("ghost", "sm")}>
        Log in
      </Link>
      <Link to="/register" className={buttonClass("primary", "sm")}>
        Sign up
      </Link>
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden items-center gap-1 md:flex">{links}</div>
        </div>

        <div className="hidden md:block">{account}</div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={buttonClass("ghost", "sm", "md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <Icon.Close width={20} height={20} /> : <Icon.Menu width={20} height={20} />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">{links}</div>
          <div className="mt-4 border-t border-line pt-4">{account}</div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
