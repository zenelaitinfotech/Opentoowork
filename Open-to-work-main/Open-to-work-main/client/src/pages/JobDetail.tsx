import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = "http://localhost:5000";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const token = localStorage.getItem("token");

  const [job, setJob] = useState<any>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchJob();
    if (token) checkApplied();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`${API_URL}/api/employer/approved/${id}`);
      const data = await res.json();
      if (!res.ok) { setJob(null); return; }
      setJob(data.job);
    } catch (err) {
      console.error("Fetch job error:", err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const checkApplied = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return;
      const data = await res.json();
      const isApplied = data.applications?.some(
        (app: any) => app.job?._id === id || app.job === id
      ) || false;
      setApplied(isApplied);
    } catch (err) {
      console.error("Check applied error:", err);
    }
  };

  // ✅ Handle Apply Now button click
  const handleApplyClick = () => {
    if (!token) {
      // Not logged in — save redirect and go to login
      localStorage.setItem("redirectAfterLogin", `/jobs/${id}`);
      navigate("/candidate/auth");
      return;
    }
    // Logged in — open modal
    setIsModalOpen(true);
  };

  // ✅ Handle Submit Application
  const handleSubmit = async () => {
    if (!resume) {
      alert("Please upload your resume (PDF).");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("jobId", id!);
      formData.append("resume", resume);
      if (coverLetter.trim()) {
        formData.append("coverLetter", coverLetter);
      }

      const res = await fetch(`${API_URL}/api/applications/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Application failed");
        return;
      }

      alert("Applied successfully ✅");
      setApplied(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Apply error:", err);
      alert("Failed to apply");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!job) return <p className="p-10">Job not found</p>;

  return (
    <div>
      <Navbar />

      <div className="container mx-auto py-12 max-w-4xl">
        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

          <p className="text-gray-600 text-lg mb-2">
            {job.employer?.company_name || job.employer?.companyName}
          </p>

          <p className="text-gray-500 mb-4">📍 {job.location}</p>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 w-fit">
            ₹ {job.salary_min} - {job.salary_max} / year
          </div>

          <p className="mb-6 text-sm">🕒 {job.job_type}</p>

          {/* Skills */}
          <h3 className="font-semibold mb-2">Skills Required</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {job.skills_required?.map((skill: string, i: number) => (
              <span key={i} className="bg-blue-100 text-blue-600 px-3 py-1 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>

          {/* Description */}
          <h3 className="font-semibold mb-2">Job Description</h3>
          <p className="text-gray-700 mb-8">{job.description}</p>

          {/* ✅ Apply Button */}
          {applied ? (
            <Button disabled className="w-full">
              Already Applied ✅
            </Button>
          ) : (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleApplyClick}
            >
              Apply Now
            </Button>
          )}
        </Card>
      </div>

      {/* ✅ Apply Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                rows={5}
                placeholder="Tell the employer why you're a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 uppercase tracking-wide"
            >
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetail;