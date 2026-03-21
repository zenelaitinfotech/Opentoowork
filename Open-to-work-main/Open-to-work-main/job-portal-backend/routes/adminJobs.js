import express from "express";
import {
  getAllJobsAdmin,
  createJobAdmin,
  updateJobAdmin,
  deleteJobAdmin,
  toggleApproveJob,
  getJobByIdAdmin,
} from "../controllers/adminJobController.js";
import Job from "../models/Job.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   ADMIN JOB ROUTES
=================================*/

// GET all jobs
router.get("/jobs", protectAdmin, getAllJobsAdmin);

// GET single job (VIEW)
router.get("/jobs/:id", protectAdmin, getJobByIdAdmin);

// CREATE
router.post("/jobs", protectAdmin, createJobAdmin);

// UPDATE
router.put("/jobs/:id", protectAdmin, updateJobAdmin);

// DELETE
router.delete("/jobs/:id", protectAdmin, deleteJobAdmin);

// APPROVE TOGGLE

router.patch("/jobs/:id/toggle-approve", protectAdmin, async (req, res) => {
  try {

    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.approved = !job.approved;
    await job.save();

    res.json(job);

  } catch (error) {
    console.error("Toggle approve error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;