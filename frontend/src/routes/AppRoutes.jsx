import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreatePoll from "../pages/CreatePoll";
import PollPage from "../pages/PollPage";
import Analytics from "../pages/Analytics";
import PublicResults from "../pages/PublicResults";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* "/" = Home page (landing) — direct open hoti hai, login nahi */}
      <Route path="/" element={<Home />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected — login chahiye */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-poll"
        element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/:pollId"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Public routes — anyone */}
      <Route path="/poll/:code" element={<PollPage />} />
      <Route path="/results/:code" element={<PublicResults />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;