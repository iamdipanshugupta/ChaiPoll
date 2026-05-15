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
    <header className="sticky top-0 z-30 bg-orange-500/4  border-orange-500/25 shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-200">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-slate-300/8 bg-slate-200/8 px-4 py-2 text-sm font-semibold text-white-900/5 transition hover:bg-slate-800/8"
              >
                Login
              </Link>
              <Link
                to="/register"  
                className="inline-flex items-center rounded-full bg-slate-200/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800/8"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <Link to="/" className="flex items-center gap-3 rounded-full bg-slate-200/8 px-4 py-2 text-orange-400 shadow-sm transition hover:bg-orange-900/4">
          <span className="text-lg font-bold">Chai-Poll</span>            
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
