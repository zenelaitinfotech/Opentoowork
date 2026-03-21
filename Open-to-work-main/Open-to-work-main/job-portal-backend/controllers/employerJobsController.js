// controllers/employerJobsController.js
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Candidate from "../models/Candidate.js";
import Employer from "../models/Employer.js";

/* ===============================
   CREATE JOB
=================================*/
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      employerId: req.employer.id,
      approved: true,
    });
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(400).json({ message: err.message });
  }
};

/* ===============================
   GET MY JOBS (Employer)
=================================*/
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { employerId: req.employer.id } });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET SINGLE JOB
=================================*/
export const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE JOB
=================================*/
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const updated = await job.update(req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ===============================
   DELETE JOB
=================================*/
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (job) await job.destroy();
    await Application.destroy({ where: { jobId: req.params.id } });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ===============================
   GET JOB APPLICANTS
=================================*/
export const getJobApplicants = async (req, res) => {
  const jobId = req.params.id;
  try {
    console.log("Fetching applicants for jobId:", jobId);

    const applicants = await Application.findAll({
      where: { jobId },
      include: [{ model: Candidate, as: "applicant", attributes: ["id", "full_name", "email", "resume_url"] }],
      order: [["createdAt", "DESC"]],
    });

    console.log("Applicants found:", applicants);

    res.json({ applicants });
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getApprovedJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { approved: true },
      include: [{ model: Employer, attributes: ["companyName", "location"] }],
    });
    res.json({ jobs });
  } catch (err) {
    console.error("Error fetching approved jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET SINGLE PUBLIC JOB
   GET /api/employer/:id
===================================================== */
export const getSinglePublicJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: Employer, attributes: ["companyName", "location"] }],
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ message: "Server error" });
  }
};
