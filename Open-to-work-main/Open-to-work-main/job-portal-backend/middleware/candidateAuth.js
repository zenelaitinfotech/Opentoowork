import jwt from "jsonwebtoken";
import Candidate from "../models/Candidate.js";

export const candidateAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const candidate = await Candidate.findByPk(decoded.id);

    if (!candidate) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: candidate.id };
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};