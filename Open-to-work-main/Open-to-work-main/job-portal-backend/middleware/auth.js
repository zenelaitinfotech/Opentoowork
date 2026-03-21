import jwt from "jsonwebtoken";
import Candidate from "../models/Candidate.js";
import Employer from "../models/Employer.js";
import User from "../models/User.js";

const SECRET = process.env.JWT_SECRET || "opentooworksecretkey";

/* =====================================================
   BASE AUTH - Verify Token
===================================================== */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    // Attach basic info to req.user
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

/* =====================================================
   CANDIDATE ONLY
===================================================== */
export const candidateOnly = async (req, res, next) => {
  try {
    if (req.user.role !== "candidate")
      return res.status(403).json({ message: "Candidate access only" });

    const user = await Candidate.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(401).json({ message: "Candidate not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Candidate Auth Error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

/* =====================================================
   EMPLOYER ONLY
===================================================== */
export const employerOnly = async (req, res, next) => {
  try {
    if (req.user.role !== "employer")
      return res.status(403).json({ message: "Employer access only" });

    const user = await Employer.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(401).json({ message: "Employer not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Employer Auth Error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

/* =====================================================
   ADMIN ONLY
===================================================== */
export const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin access only" });

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user)
      return res.status(401).json({ message: "Admin not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};