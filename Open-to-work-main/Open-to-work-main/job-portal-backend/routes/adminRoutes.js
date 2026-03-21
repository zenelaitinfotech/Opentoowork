import express from "express";
import Candidate from "../models/Candidate.js";
import Employer from "../models/Employer.js";
import multer from "multer";

import {
  authMiddleware,
  protectAdmin,
  protectCandidate,
} from "../middleware/authMiddleware.js";

import {
  applyJob,
  getMyApplications,
} from "../controllers/applicationController.js";

import {
  getAllJobsAdmin,
  createJobAdmin,
  updateJobAdmin,
  deleteJobAdmin,
  toggleApproveJob,
  getJobById,
} from "../controllers/adminJobController.js";

const router = express.Router();

/* ===============================
   MULTER STORAGE
=================================*/
const storage = multer.diskStorage({
  destination: "uploads/resumes",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===============================
   APPLY JOB (Candidate)
=================================*/
router.post("/", protectCandidate, upload.single("resume"), applyJob);

/* ===============================
   GET MY APPLICATIONS
=================================*/
router.get("/my", protectCandidate, getMyApplications);

/* ===============================
   ADMIN USERS LIST
=================================*/
router.get("/admin/users", protectAdmin, async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      attributes: ["id", "full_name", "email", "location", "createdAt"],
    });

    const employers = await Employer.findAll({
      attributes: ["id", "companyName", "email", "location", "createdAt"],
    });

    const users = [
      ...candidates.map(c => ({
        id: c.id,
        name: c.full_name,
        email: c.email,
        location: c.location || "N/A",
        role: "Candidate",
        joined: c.createdAt,
      })),
      ...employers.map(e => ({
        id: e.id,
        name: e.companyName,
        email: e.email,
        location: e.location || "N/A",
        role: "Employer",
        joined: e.createdAt,
      })),
    ];

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

router.delete("/admin/users/:role/:id", protectAdmin, async (req, res) => {
  try {
    const { role, id } = req.params;

    if (role === "Candidate") {
      await Candidate.destroy({ where: { id } });
    } else if (role === "Employer") {
      await Employer.destroy({ where: { id } });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

/* ===============================
   ADMIN JOB ROUTES
=================================*/
router.get("/jobs/:id", getJobById);
router.get("/jobs", protectAdmin, getAllJobsAdmin);
router.post("/jobs", protectAdmin, createJobAdmin);
router.put("/jobs/:id", protectAdmin, updateJobAdmin);
router.delete("/jobs/:id", protectAdmin, deleteJobAdmin);


export default router;