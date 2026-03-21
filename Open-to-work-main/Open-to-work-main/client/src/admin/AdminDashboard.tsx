import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import Users from "./Users";
import Jobs from "./Jobs";
import { useSiteContent } from "../contexts/SiteContentContext";
import Support from "./Support";
import Excel from "./ExcelManager";
import ExcelManager from "./ExcelManager";
import SiteContentPage from "./SiteContentPage";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { content, setContent } = useSiteContent();

  const handleLogout = () => {
    // remove login flag (if using localStorage)
    localStorage.removeItem("token");

    navigate("/admin"); // back to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* 🔥 Header Section */}
      <div className="flex items-center justify-between mb-10">
        
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-2xl">
            <Shield className="text-blue-600 w-8 h-8" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Panel
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Manage users, jobs, and site content
            </p>
          </div>
        </div>

        {/* 🔴 Right Side Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition shadow"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

      {/* 🔵 Top Tabs */}
      <div className="bg-gray-200 rounded-full flex gap-2 p-2 w-fit mb-10">
        <NavLink
          to="users"
          className={({ isActive }) =>
            `px-6 py-2 rounded-full font-medium transition ${
              isActive
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:text-black"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="jobs"
          className={({ isActive }) =>
            `px-6 py-2 rounded-full font-medium transition ${
              isActive
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:text-black"
            }`
          }
        >
          Jobs
        </NavLink>

        <NavLink
          to="site-content"
          className={({ isActive }) =>
            `px-6 py-2 rounded-full font-medium transition ${
              isActive
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:text-black"
            }`
          }
        >
          Site Content
        </NavLink>
        <NavLink
          to="support"
          className={({ isActive }) =>
            `px-6 py-2 rounded-full font-medium transition ${
              isActive
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:text-black"
            }`
          }
        >
          Support
        </NavLink>
        <NavLink
          to="excel"
          className={({ isActive }) =>
            `px-6 py-2 rounded-full font-medium transition ${
              isActive
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:text-black"
            }`
          }
        >
          Excel File
        </NavLink>
      </div>

      {/* 📄 Page Content */}
      <Routes>
        <Route path="/" element={<Navigate to="users" />} />
        <Route path="users" element={<Users />} />
        <Route path="jobs" element={<Jobs />} />
       
        <Route path="site-content" element={<SiteContentPage />} />
        <Route path="support" element={<Support />} />
        <Route path="excel" element={<ExcelManager />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
