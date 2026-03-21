import Application from "../models/Application.js";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import Employer from "../models/Employer.js";

/* ================= PROFILE ================= */
export const getProfile = async (req, res) => {
  const candidate = await Candidate.findByPk(req.user.id, { raw: true });
  
  if (!candidate) return res.status(404).json({ message: "Candidate not found" });

  // Remove password from response
  const { password, ...profileData } = candidate;

  res.json(profileData);
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  console.log("REQ.USER:", req.user);

  const candidate = await Candidate.findByPk(req.user.id);

  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  const updated = await candidate.update(req.body);

  res.json(updated);
};
/* ================= APPLICATIONS ================= */
export const getApplications = async (req, res) => {
  const apps = await Application.findAll({
    where: { candidateId: req.user.id },
    include: [
      {
        model: Job,
        as: "job",
        include: [{ model: Employer, attributes: ["companyName"] }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json(apps);
};

/* ================= RESUME UPLOAD ================= */
export const uploadResume = async (req, res) => {
  const filePath = `/uploads/resumes/${req.file.filename}`;

  const candidate = await Candidate.findByPk(req.user.id);
  if (!candidate) return res.status(404).json({ message: "Candidate not found" });

  const user = await candidate.update({ resume_url: filePath });

  res.json({
    message: "Uploaded",
    resume_url: user.resume_url,
  });
};

/* ================= CONTACT SUPPORT ================= */
export const contactSupport = async (req, res) => {
  console.log(req.body);
  res.json({ message: "Message received" });
};