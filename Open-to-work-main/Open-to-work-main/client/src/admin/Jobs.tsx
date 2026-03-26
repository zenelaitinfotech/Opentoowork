import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Check, X, Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";



const AdminJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewJob, setViewJob] = useState<any>(null);
  const [editJob, setEditJob] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // ✅ inside component

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [payType, setPayType] = useState("Monthly");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return void (window.location.href = "/admin");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      setJobs(data.jobs || data);
    } catch (err: any) {
      toast({ title: err.message || "Failed to fetch jobs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setLocation("");
    setJobType("Full-time"); setPayType("Monthly");
    setSalaryMin(""); setSalaryMax("");
    setSkills([]); setSkillInput(""); setEditJob(null);
  };

  const openEdit = (job: any) => {
    setEditJob(job);
    setTitle(job?.title || "");
    setDescription(job?.description || "");
    setLocation(job?.location || "");
    setJobType(job?.job_type || "Full-time");
    setPayType(job?.pay_type || "Monthly");
    setSalaryMin(job?.salary_min?.toString() || "");
    setSalaryMax(job?.salary_max?.toString() || "");
    setSkills(job?.skills_required || []);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(salaryMin) > Number(salaryMax)) {
      return toast({ title: "Min salary cannot exceed Max", variant: "destructive" });
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/jobs/${editJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title, description, location,
          job_type: jobType, pay_type: payType,
          salary_min: Number(salaryMin), salary_max: Number(salaryMax),
          skills_required: skills,
        }),
      });
      if (!res.ok) throw new Error("Failed to update job");
      toast({ title: "Job updated successfully ✅" });
      resetForm(); setIsDialogOpen(false); fetchJobs();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(salaryMin) > Number(salaryMax)) {
      return toast({ title: "Min salary cannot exceed Max", variant: "destructive" });
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title, description, location,
          job_type: jobType, pay_type: payType,
          salary_min: Number(salaryMin), salary_max: Number(salaryMax),
          skills_required: skills,
        }),
      });
      if (!res.ok) throw new Error("Failed to create job");
      toast({ title: "Job created successfully ✅" });
      resetForm(); setIsAddDialogOpen(false); fetchJobs();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  const handleToggleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/jobs/${id}/toggle-approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to toggle approval");
      const updatedJob = await res.json();
      setJobs((prev) => prev.map((job) => job.id === id ? { ...job, approved: updatedJob.approved ?? !job.approved } : job));
      toast({ title: updatedJob.approved ? "Job Approved ✅" : "Job Rejected ❌" });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this job?")) return;
    await fetch(`${API_URL}/api/admin/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchJobs();
  };

  // Reusable form fields
  const JobFormFields = () => (
    <div className="space-y-4">
      <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
      <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
      <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} required /></div>
      <div>
        <Label>Job Type</Label>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
            <SelectItem value="Hourly">Hourly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Pay Type</Label>
        <Select value={payType} onValueChange={setPayType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Hourly">Hourly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Salary Min</Label><Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} required /></div>
        <div><Label>Salary Max</Label><Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} required /></div>
      </div>
      <div>
        <Label>Skills Required</Label>
        <div className="flex gap-2 flex-wrap mb-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {skill}
              <button type="button" onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="text-red-500">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" />
          <Button type="button" onClick={() => {
            if (skillInput.trim() && !skills.includes(skillInput.trim())) {
              setSkills([...skills, skillInput.trim()]);
              setSkillInput("");
            }
          }}>Add</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Jobs Management</h2>
        <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Job
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 shadow">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.location} • {job.job_type}</p>
              <p>${job.salary_min} - ${job.salary_max}</p>
              <p>Company: {job.employer?.companyName}</p>
              <p>Email: {job.employer?.email}</p>
              <p>Status: {job.approved ? "Approved ✅" : "Pending ⏳"}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => setViewJob(job)}><Eye className="h-4 w-4" /></Button>
                <Button size="sm" onClick={() => openEdit(job)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant={job.approved ? "destructive" : "secondary"} onClick={() => handleToggleApprove(job.id)}>
                  {job.approved ? <X /> : <Check />}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}><Trash2 /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewJob && (
        <Dialog open={true} onOpenChange={() => setViewJob(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{viewJob.title}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p><strong>Location:</strong> {viewJob.location}</p>
              <p><strong>Job Type:</strong> {viewJob.job_type}</p>
              <p><strong>Salary:</strong> ₹{viewJob.salary_min} - ₹{viewJob.salary_max}</p>
              <p><strong>Status:</strong> {viewJob.approved ? "Approved ✅" : "Pending ⏳"}</p>
              <p><strong>Description:</strong> {viewJob.description}</p>
              {viewJob.skills_required?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {viewJob.skills_required.map((s: string, i: number) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              )}
              {viewJob.employer && (
                <div>
                  <p><strong>Company:</strong> {viewJob.employer.companyName}</p>
                  <p><strong>Email:</strong> {viewJob.employer.email}</p>
                  <p><strong>Location:</strong> {viewJob.employer.location}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Applicants ({viewJob.applications?.length || 0})</h3>
                {viewJob.applications?.map((app: any) => (
                  <div key={app.id} className="border p-3 rounded-lg flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{app.applicant?.name}</p>
                      <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                    </div>
                    {app.resume && (
                      <a href={`${API_URL}/${app.resume}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View Resume</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => setViewJob(null)}>Close</Button>
          </DialogContent>
        </Dialog>
      )}

      {/* EDIT MODAL */}
      {editJob && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Job ✏️</DialogTitle></DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <JobFormFields />
              <Button type="submit" className="w-full">Update Job</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ADD JOB MODAL */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Job ➕</DialogTitle></DialogHeader>
          <form onSubmit={handleAddJob} className="space-y-4">
            <JobFormFields />
            <Button type="submit" className="w-full">Create Job</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminJobs;