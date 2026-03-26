import express from "express";
import Support from "../models/Support.js";
import Candidate from "../models/Candidate.js";
import { authMiddleware,protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/admin/support-queries
router.get("/support-queries", authMiddleware,protectAdmin, async (req, res) => {
  try {
    const queries = await Support.findAll({
      include: [
        {
          model: Candidate,
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ queries });
  } catch (error) {
    console.error("Fetch Support Error:", error.message);
    res.status(500).json({ message: "Failed to fetch queries" });
  }
});

// POST /api/admin/support-queries/:id/resolve
router.post("/support-queries/:id/resolve", authMiddleware, async (req, res) => {
  try {
    const query = await Support.findByPk(req.params.id);

    if (!query) return res.status(404).json({ message: "Query not found" });

    await query.update({ status: "resolved" });

    res.json({ message: "Query resolved", query });
  } catch (error) {
    console.error("Resolve Error:", error.message);
    res.status(500).json({ message: "Failed to resolve" });
  }
});

// DELETE /api/admin/support-queries/:id
router.delete("/support-queries/:id", authMiddleware, async (req, res) => {
  try {
    const query = await Support.findByPk(req.params.id);

    if (!query) return res.status(404).json({ message: "Query not found" });

    await query.destroy();

    res.json({ message: "Query deleted" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Failed to delete" });
  }
});

export default router;