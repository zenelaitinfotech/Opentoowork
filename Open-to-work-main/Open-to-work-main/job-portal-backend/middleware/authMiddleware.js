import jwt from "jsonwebtoken";
import Candidate from "../models/Candidate.js";
import Employer from "../models/Employer.js";
import Admin from "../models/Admin.js";

const SECRET = process.env.JWT_SECRET || "opentooworksecretkey";

/* =====================================================
   BASE AUTH - VERIFY TOKEN
===================================================== */
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, SECRET); // ← change process.env.JWT_SECRET to SECRET
    
    const candidate = await Candidate.findByPk(decoded.id);
    
    if (!candidate) return res.status(401).json({ message: "Candidate not found" });

    req.user = candidate;
    
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

/* =====================================================
   ROLE PROTECTION
===================================================== */

export const protectCandidate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    const candidate = await Candidate.findByPk(decoded.id);
    if (!candidate)
      return res.status(403).json({ message: "Forbidden" });

    req.user = candidate; // set user
    next();
  } catch (err) {
    console.error("Candidate auth error:", err);
    res.status(403).json({ message: "Forbidden" });
  }
};

export const protectEmployer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    if (decoded.role !== "employer")
      return res.status(403).json({ message: "Employer access only" });

    const employer = await Employer.findByPk(decoded.id); // ✅ use id
    if (!employer) return res.status(401).json({ message: "Employer not found" });

    req.employer = employer;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admin access only" });

    const admin = await Admin.findByPk(decoded.id); // ✅ CHECK ADMIN TABLE

    if (!admin)
      return res.status(401).json({ message: "Admin not found" });

    req.admin = admin; // ✅ store admin
    next();

  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// export const verifyAdmin = (req, res, next) => {
//   if (!req.user)
//     return res.status(401).json({ message: "Unauthorized" });

//   if (req.user.role !== "admin")
//     return res.status(403).json({ message: "Admin access only" });

//   next();
// };