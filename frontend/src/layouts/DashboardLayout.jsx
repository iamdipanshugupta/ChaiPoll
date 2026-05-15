import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
