import express from "express";
import { getApprovedJobs, getSinglePublicJob, getJobApplicants } from "../controllers/employerJobsController.js";
import { protectEmployer } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all approved jobs
router.get("/", getApprovedJobs);

// GET single job by ID (approved or not)
router.get("/:id", getSinglePublicJob);

router.get("/:id/applicants", protectEmployer, getJobApplicants);

export default router;