import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar sticky top-0 z-30">
      <div className="navbar-inner">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
          Poll App
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-600">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
