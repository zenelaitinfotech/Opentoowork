import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protectCandidate } from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile,
  getApplications,
  uploadResume,
  contactSupport,
} from "../controllers/candidateController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", protectCandidate, updateProfile);
router.get("/applications", authMiddleware, getApplications);

router.post(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

router.post("/contact", authMiddleware, contactSupport);

export default router;