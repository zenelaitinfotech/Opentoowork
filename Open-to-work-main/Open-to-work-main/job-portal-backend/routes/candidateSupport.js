import express from "express";
import Support from "../models/Support.js";
import { candidateAuth } from "../middleware/candidateAuth.js";

const router = express.Router();

// POST /api/candidate/contact
router.post("/contact", candidateAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const support = await Support.create({
      candidate: req.user.id,
      subject,
      message,
    });

    res.status(201).json({ message: "Support request sent", support });
  } catch (error) {
    console.error("Support Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;