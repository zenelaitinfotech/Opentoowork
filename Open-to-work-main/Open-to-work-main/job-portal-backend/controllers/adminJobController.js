import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Employer from "../models/Employer.js";
import Candidate from "../models/Candidate.js";

/* ===============================
   GET ALL JOBS (ADMIN)
=================================*/
export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        { model: Employer, attributes: ["id", "companyName", "email"] },
        {
          model: Application,
          include: [
            { model: Candidate, as: "applicant", attributes: ["id", "full_name", "email"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   CREATE JOB
=================================*/
export const createJobAdmin = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   UPDATE JOB
=================================*/
export const updateJobAdmin = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updated = await job.update(req.body);
    res.json({ message: "Job updated successfully", job: updated });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   DELETE JOB
=================================*/
export const deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (job) await job.destroy();

    await Application.destroy({ where: { jobId: req.params.id } });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(400).json({ message: error.message });
  }
};

/* ===============================
   TOGGLE APPROVAL
=================================*/
export const toggleApproveJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.update({ approved: !job.approved });

    res.json({
      message: `Job ${job.approved ? "Approved" : "Disapproved"}`,
      job,
    });
  } catch (error) {
    console.error("Error toggling approval:", error);
    res.status(400).json({ message: error.message });
  }
};


export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Employer, attributes: ["companyName", "email"] },
        {
          model: Application,
          include: [{ model: Candidate, as: "applicant", attributes: ["full_name", "email"] }],
        },
      ],
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    // Map applicants to a safe format for frontend
    const applicants = (job.Applications || []).map(app => ({
      id: app.id,
      name: app.applicant?.full_name || "N/A",
      email: app.applicant?.email || "N/A",
      resume: app.resume,
      status: app.status || "Applied",
      appliedAt: app.createdAt,
    }));

    res.json({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      pay_type: job.pay_type,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      currency: job.currency,
      skills_required: job.skills_required || [],
      years_required: job.years_required,
      experience_amount: job.experience_amount,
      candidate_experience: job.candidate_experience,
      approved: job.approved,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      employer: {
        name: job.Employer?.companyName || "N/A",
        email: job.Employer?.email || "N/A",
      },
      applicants,
    });
  } catch (err) {
    console.error("Error fetching job by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getJobByIdAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findByPk(jobId, {
      include: [
        { model: Employer, attributes: ["companyName", "email"] },
        {
          model: Application,
          include: [{ model: Candidate, as: "applicant", attributes: ["full_name", "email"] }],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Format response for frontend (optional, cleaner)
    const formattedJob = {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      pay_type: job.pay_type,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      currency: job.currency,
      skills_required: job.skills_required,
      candidate_experience: job.candidate_experience,
      approved: job.approved,
      employer: {
        name: job.Employer?.companyName,
        email: job.Employer?.email,
      },
      applicants: (job.Applications || []).map((app) => ({
        id: app.id,
        name: app.applicant?.full_name || "N/A",
        email: app.applicant?.email || "N/A",
        resume: app.resume,
        status: app.status,
      })),
    };

    res.json({ job: formattedJob });
  } catch (err) {
    console.error("Fetch Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};