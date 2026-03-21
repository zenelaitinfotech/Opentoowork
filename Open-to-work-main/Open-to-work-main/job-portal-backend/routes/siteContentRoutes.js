import express from "express";
import { getSiteContent, saveSiteContent } from "../controllers/siteContentController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public - frontend reads this
router.get("/", getSiteContent);

// Admin only - saves content
router.post("/", protectAdmin, saveSiteContent);

export default router;