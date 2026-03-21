import express from "express";
import { protectCandidate } from "../middleware/authMiddleware.js";
import {
  applyJob,
  getMyApplications,
} from "../controllers/applicationController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =====================================================
   APPLY JOB (Candidate)
   POST /api/applications/apply
===================================================== */
router.post(
  "/apply",
  protectCandidate,
  upload.single("resume"),
  applyJob
);

/* =====================================================
   GET MY APPLICATIONS
   GET /api/applications/my
===================================================== */
router.get(
  "/my",
  protectCandidate,
  getMyApplications
);

export default router;