import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CandidateDashboard from "@/components/CandidateDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Call your backend to validate JWT/session
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // send cookies if using cookie-based session
      });

      if (!res.ok) {
        // Not logged in, redirect to auth page
        navigate("/candidate/auth");
        return;
      }

      const data = await res.json();
      if (data.user && data.user.role === "candidate") {
        setLoggedIn(true);
      } else {
        navigate("/candidate/auth");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/candidate/auth");
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {loggedIn && <CandidateDashboard />}
    </div>
  );
};

export default Dashboard;