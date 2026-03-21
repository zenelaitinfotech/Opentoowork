import Employer from "../models/Employer.js"; // adjust path if your model is elsewhere

// GET employer profile
export const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findByPk(req.user.id); // req.user set by authMiddleware
    if (!employer) return res.status(404).json({ message: "Employer not found" });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};