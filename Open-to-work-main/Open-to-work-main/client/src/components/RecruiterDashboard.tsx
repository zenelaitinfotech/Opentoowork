import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

const API_URL = "https://job-portal-backend.onrender.com";

const EmployerDashboard = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
 
const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false);

  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [payType, setPayType] = useState("Yearly");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [yearsRequired, setYearsRequired] = useState("");
  const [experienceAmount, setExperienceAmount] = useState("");
  const [candidateExperience, setCandidateExperience] = useState("");

  // Fetch profile and jobs
  useEffect(() => {
    if (!token) return;
    fetchProfile();
    fetchJobs();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/employer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
    } catch {
      toast({ title: "Failed to fetch profile", variant: "destructive" });
    } finally {
      setLoadingProfile(false);
    }
  };

const fetchJobs = async () => {
  if (!token) return window.location.href = "/login";
  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/employer/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    console.log("Jobs fetched:", data);

   setJobs(
  (Array.isArray(data.jobs)
    ? data.jobs
    : Array.isArray(data.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : []
  ).map(job => ({
    ...job,
    _id: job._id || job.id, // ensures _id exists for delete
  }))
);
} catch (err: any) {
  console.error("Fetch jobs error:", err);
  toast({ title: err.message, variant: "destructive" });
} finally {
  setLoading(false);
}
};
const fetchApplications = async (jobId: string) => {
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/employer/jobs/${jobId}/applicants`, {
      headers: { Authorization: `Bearer ${token}` }, // employer token
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch applicants");
    }

    const data = await res.json();
    console.log("Applicants data:", data); // debug
    setApplications(data.applicants || []);
 
const job = jobs.find(j => j._id === jobId);
setSelectedJob(job);

    setIsApplicationsOpen(true);
  } catch (err: any) {
    toast({ title: err.message, variant: "destructive" });
  }
};
// const fetchApplicants = async (jobId: string) => {
//   if (!token) return;

//   try {
//     const res = await fetch(`${API_URL}/api/employer/jobs/${jobId}/applicants`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "Failed to fetch applicants");
//     }

//     const data = await res.json();
//     setApplicants(data.applicants || []); // Make sure backend returns { applicants: [...] }
//     setIsApplicantsDialogOpen(true);
//   } catch (err: any) {
//     toast({ title: err.message, variant: "destructive" });
//   }
// };
  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Logged out successfully 👋" });
    window.location.href = "/login";
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setJobType("Full-time");
    setPayType("Yearly");
    setSalaryMin("");
    setSalaryMax("");
    setSkills([]);
    setSkillInput("");
    setEditingJobId(null);
    setYearsRequired("");
    setExperienceAmount("");
    setCandidateExperience("");
  };

  // Open dialog for new job
  const openNewJobDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Submit job
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    title,
    description,
    location,
    pay_type: payType,
    salary_min: parseInt(salaryMin),
    salary_max: parseInt(salaryMax),
    currency: "USD",
    job_type: jobType,
    skills_required: skills,
    years_required: yearsRequired ? parseInt(yearsRequired) : undefined,
    experience_amount: experienceAmount || undefined,
    candidate_experience: candidateExperience || undefined,
  };

  try {
    const res = await fetch(
      editingJobId
        ? `${API_URL}/api/employer/jobs/${editingJobId}`
        : `${API_URL}/api/employer/jobs`,
      {
        method: editingJobId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to save job");
    }

    toast({ title: editingJobId ? "Job updated ✅" : "Job posted ✅" });

    // Reset form
    resetForm();
    setIsDialogOpen(false);

    // ✅ Immediately fetch fresh jobs after posting/updating
    await fetchJobs();
  } catch (err: any) {
    toast({ title: err.message, variant: "destructive" });
  }
};

  // Edit job
  const handleEdit = (job: any) => {
    setEditingJobId(job._id);
    setTitle(job.title);
    setDescription(job.description);
    setLocation(job.location);
    setJobType(job.job_type);
    setPayType(job.pay_type);
    setSalaryMin(job.salary_min.toString());
    setSalaryMax(job.salary_max.toString());
    setSkills(job.skills_required || []);
    setYearsRequired(job.years_required?.toString() || "");
    setExperienceAmount(job.experience_amount || "");
    setCandidateExperience(job.candidate_experience || "");
    setIsDialogOpen(true);
  };

  // Delete job
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`${API_URL}/api/employer/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      toast({ title: "Job deleted successfully ✅" });
      setJobs(jobs.filter(j => j._id !== id));
    } catch {
      toast({ title: "Error deleting job", variant: "destructive" });
    }
  };

  if (loadingProfile) return <div className="p-8">Loading...</div>;
  if (!profile) return <div className="p-8 text-red-500">Profile not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <div className="flex gap-3">
          <div>
            {profile && (
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p><strong>Company:</strong> {profile.companyName || "N/A"}</p>
                <p><strong>Location:</strong> {profile.location || "N/A"}</p>
                <p><strong>Email:</strong> {profile.email || "N/A"}</p>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {/* Post/Edit Job Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openNewJobDialog}>
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </DialogTrigger>
     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJobId ? "Edit Job" : "Post a New Job"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Job Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />

            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} required />

            <Label>Job Type</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                 <SelectItem value="Part-time">Contract</SelectItem>
                  <SelectItem value="Part-time">W2</SelectItem>
                
              </SelectContent>
            </Select>

            <Label>Pay Type</Label>
            <Select value={payType} onValueChange={setPayType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Hourly">Hourly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

<div className="grid grid-cols-2 gap-4">
  {/* Min Pay */}
  <div>
    <Label>Min Pay</Label>
    <div className="flex items-center border rounded pl-3 h-10">
      <span className="text-gray-500">$</span>
      <Input
        type="number"
        value={salaryMin}
        onChange={(e) => setSalaryMin(e.target.value)}
        required
        className="ml-2 w-full border-none focus:ring-0" // fill remaining space
      />
    </div>
  </div>

  {/* Max Pay */}
  <div>
    <Label>Max Pay</Label>
    <div className="flex items-center border rounded pl-3 h-10">
      <span className="text-gray-500">$</span>
      <Input
        type="number"
        value={salaryMax}
        onChange={(e) => setSalaryMax(e.target.value)}
        required
        className="ml-2 w-full border-none focus:ring-0"
      />
    </div>
  </div>
</div>

            <Label>Add Skill</Label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
              <Button type="button" onClick={() => {
                const trimmed = skillInput.trim();
                if (!trimmed || skills.includes(trimmed)) return;
                setSkills([...skills, trimmed]);
                setSkillInput("");
              }}>Add</Button>
            </div>

            {/* Display added skills */}
            {skills.map((skill, index) => (
              <div key={index} className="flex justify-between border p-2 rounded mt-1">
                <span>{skill}</span>
                <Button type="button" size="sm" variant="destructive" onClick={() => setSkills(skills.filter((_, i) => i !== index))}>Remove</Button>
              </div>
            ))}

            <Button type="submit" className="w-full mt-4">{editingJobId ? "Update Job" : "Post Job"}</Button>
          </form>
        </DialogContent>
      </Dialog>
            <Dialog open={isApplicationsOpen} onOpenChange={setIsApplicationsOpen}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Applicants for Job</DialogTitle>
      {selectedJob && (
  <div className="mb-4 p-3 border rounded">
    <h2 className="text-lg font-bold">{selectedJob.title}</h2>
    <p><strong>Description:</strong> {selectedJob.description}</p>
    <p><strong>Location:</strong> {selectedJob.location}</p>
    <p><strong>Job Type:</strong> {selectedJob.job_type}</p>
    <p><strong>Salary:</strong> ${selectedJob.salary_min} - ${selectedJob.salary_max}</p>
    <p><strong>Skills:</strong> {selectedJob.skills_required?.join(", ")}</p>
  </div>
)}
    </DialogHeader>

{applications.map((app: any) => {
  const candidate = app.applicant;
  if (!candidate) return null;

  // Safely normalize resume path
  const resumePath = candidate.resume
    ? candidate.resume.replaceAll("\\", "/").replace(/^uploads\//, "")
    : null;

  return (
    <Card key={app._id} className="p-4 flex justify-between items-center">
      <div>
        <p><strong>Name:</strong> {candidate.full_name}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
      </div>

      {resumePath && (
        <a
          href={`${API_URL}/uploads/${resumePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Resume
        </a>
      )}
    </Card>
  );
})}
  </DialogContent>
</Dialog>
      {/* Job List */}
      <Card className="p-6">
        {jobs.map(job => (
          <Card key={job._id} className="p-4 flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.location} • {job.job_type}</p>
            </div>
           
             <div className="flex gap-2">
  <Button size="sm" variant="outline" onClick={() => handleEdit(job)}>
    <Pencil className="h-4 w-4" />
  </Button>
  <Button size="sm" variant="destructive" onClick={() => handleDelete(job._id)}>
    <Trash2 className="h-4 w-4" />
  </Button>
  <Button size="sm" variant="secondary" onClick={() => fetchApplications(job._id)}>
    <Eye className="h-4 w-4" /> View Applications
  </Button>
</div>
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default EmployerDashboard;