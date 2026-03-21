import express from "express";
import {
  createJob,
  getEmployerJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  getApprovedJobs,
  getSinglePublicJob
} from "../controllers/employerJobsController.js";
import { authMiddleware, protectEmployer } from "../middleware/authMiddleware.js";

const router = express.Router();

// EMPLOYER PROFILE
router.get("/profile", authMiddleware, protectEmployer, (req, res) => {
  res.json(req.employer);
});

// JOB CRUD
router.post("/jobs", authMiddleware, protectEmployer, createJob);
router.get("/jobs", authMiddleware, protectEmployer, getEmployerJobs);
router.get("/jobs/:id", authMiddleware, protectEmployer, getSingleJob);
router.put("/jobs/:id", authMiddleware, protectEmployer, updateJob);
router.delete("/jobs/:id", authMiddleware, protectEmployer, deleteJob);

// GET JOB APPLICANTS
router.get("/jobs/:id/applicants", authMiddleware, protectEmployer, getJobApplicants);

// PUBLIC JOBS
router.get("/approved", getApprovedJobs);
router.get("/approved/:id", getSinglePublicJob);

export default router;