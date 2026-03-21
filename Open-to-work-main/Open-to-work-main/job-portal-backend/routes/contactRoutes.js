import express from "express";
import Support from "../models/Support.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    await Support.create({
      subject: `[${name}] ${subject}`,
      message: `From: ${email}\n\n${message}`,
      status: "pending",
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;