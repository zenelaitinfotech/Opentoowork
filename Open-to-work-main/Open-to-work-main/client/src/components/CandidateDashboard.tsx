import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast";
import Navbar from "./Navbar";
import {
  Building2, MapPin, Calendar, Clock, CheckCircle,
  XCircle, Pencil, FileText, Upload, LogOut
} from "lucide-react";


const API_URL = "http://localhost:5000";

const CandidateDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
 const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

 const location = useLocation();

useEffect(() => {
    fetchProfile();
    fetchApplications();
  }, [location.key]);

 const fetchProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/api/candidate/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();

    // ✅ Fix: Parse socialLinks if it's a string
    if (typeof data.socialLinks === "string") {
      try {
        data.socialLinks = JSON.parse(data.socialLinks);
      } catch {
        data.socialLinks = {};
      }
    }

    if (!data.socialLinks) data.socialLinks = {};

    setProfile(data);
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/candidate/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setApplications(data);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const res = await fetch(`${API_URL}/api/candidate/upload-resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      toast({ title: "Resume uploaded successfully 📄" });
      setResumeFile(null);
      fetchProfile();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Logged out successfully!" });
    navigate("/candidate/auth");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4" /> Accepted</span>;
      case "rejected":
        return <span className="flex items-center gap-1 text-red-500 text-sm font-medium"><XCircle className="w-4 h-4" /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 text-orange-500 text-sm font-medium"><Clock className="w-4 h-4" /> Pending</span>;
    }
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {profile.full_name?.split(" ")[0] || "Candidate"}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* ===== LEFT: MY PROFILE ===== */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
              <button
                onClick={() => navigate("/candidate/profile")}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
            </div>

           {/* Contact */}
<div>
  <p className="font-medium text-gray-700">Contact</p>
  
  {/* Email */}
  <p className="text-sm text-gray-700">{profile.email}</p>

  {/* Phone */}
  {profile.phone && <p className="text-sm text-gray-700">{profile.phone}</p>}

{/* ===== SOCIAL LINKS ===== */}
<div className="mt-3">  {/* Added margin-top */}
 

  {/* LinkedIn */}
  <p className="text-sm flex items-center gap-1">
    <span className="font-medium text-gray-700">LinkedIn:</span>
    {profile.socialLinks?.linkedin?.trim() ? (
      <a
        href={profile.socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {profile.socialLinks.linkedin}
      </a>
    ) : (
      <span className="text-gray-400">Not added</span>
    )}
  </p>

  {/* GitHub */}
  <p className="text-sm flex items-center gap-1">
    <span className="font-medium text-gray-700">GitHub:</span>
    {profile.socialLinks?.github?.trim() ? (
      <a
        href={profile.socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {profile.socialLinks.github}
      </a>
    ) : (
      <span className="text-gray-400">Not added</span>
    )}
  </p>
</div>
</div>

{/* ===== Add a Save button ===== */}
<div className="mt-4">
 
</div>

            {/* Details */}
            <div>
              <p className="font-medium text-gray-700 ">Details</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Work Auth:</span>
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">
                    {profile.work_authorization || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Experience:</span>
                  <span className="text-gray-800 font-medium">{profile.experience_years || 0} Years</span>
                </div>
                {profile.location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-800">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Resume */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Resume</p>

              {profile.resume_url && (
                 <a 
                  href={`${API_URL}${profile.resume_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full border border-blue-200 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition mb-3"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Current Resume
                  </span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </a>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 mb-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700"
              />

              <button
                onClick={handleResumeUpload}
                disabled={uploading || !resumeFile}
                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white text-sm font-medium py-2.5 rounded-lg transition"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Update Resume"}
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* ===== RIGHT: APPLICATION HISTORY ===== */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Application History</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                {applications.filter(a => a.job !== null).length} Applications
              </span>
            </div>

            {applications.filter(a => a.job !== null).length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No applications yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.filter(a => a.job !== null).map((app) => (
                  <div key={app._id || app.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {app.job?.title || "No Title"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {app.job?.employer?.company_name || app.job?.employer?.companyName || "Company"}
                          </span>
                          {app.job?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {app.job.location}
                            </span>
                          )}
                          {app.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Applied: {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-xs text-gray-400 mb-1 text-right">Status</p>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    {/* Cover letter / note */}
                    {app.cover_letter && (
                      <div className="mt-3 pt-3 border-t border-gray-50">
                        <p className="text-xs text-gray-400 mb-1">Your Note</p>
                        <p className="text-xs text-gray-600 italic">"{app.cover_letter}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;