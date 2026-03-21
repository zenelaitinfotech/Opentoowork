import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Employer from "../models/Employer.js";

export const applyJob = async (req, res) => {
  try {
    const candidateId = req.user?.id; // now numeric PK
    const { jobId } = req.body;

    if (!candidateId) return res.status(401).json({ message: "Unauthorized" });
    if (!jobId) return res.status(400).json({ message: "Job ID required" });
    if (!req.file) return res.status(400).json({ message: "Resume PDF required" });

    const exists = await Application.findOne({
      where: { candidateId, jobId },
    });

    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      candidateId,
      jobId,
      resume: req.file.path,
    });

    res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { candidateId: req.user.id },
      include: [
        {
          model: Job,
          as: "job",
          include: [
            {
              model: Employer,
              attributes: ["companyName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};