import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const candidateToken = localStorage.getItem("candidateToken");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ===== CANDIDATE LOGGED IN =====
  if (candidateToken) {
    return (
      <nav className="border-b border-border/40 bg-background/95 sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            <Link to="/" className="flex items-center gap-2">
              <img
                src="/src/assets/open-to-work-icon1.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-bold text-primary tracking-wide">
                Open Too Work
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/jobs">
                <Button variant="ghost" className="text-base">Find Jobs</Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="text-base">About</Button>
              </Link>
              <Link to="/candidate/dashboard">
                <Button variant="ghost" className="text-base">Dashboard</Button>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </nav>
    );
  }

  // ===== NOT LOGGED IN =====
  return (
    <nav className="border-b border-border/40 bg-background/95 sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">

          <Link to="/" className="flex items-center gap-2">
            <img
              src="/src/assets/open-to-work-icon1.png"
              alt="Logo"
              className="h-24 w-24 object-contain"
            />
            <span className="text-xl font-bold text-primary tracking-wide">
              OPEN TOO WORK
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/jobs">
              <Button variant="ghost" className="text-base">Find Jobs</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-base">About</Button>
            </Link>
            <Link to="/employer/auth">
              <Button variant="outline" className="text-base border-primary">For Recruiter</Button>
            </Link>
            <Link to="/candidate/auth">
              <Button variant="outline" className="text-base border-primary">For Candidate</Button>
            </Link><Link to="/employer/auth">
              <Button variant="outline" className="text-base border-primary">For Bench</Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" className="text-base border-primary">Admin</Button>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;