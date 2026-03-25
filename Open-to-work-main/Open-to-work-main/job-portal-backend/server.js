import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cors from "cors";
import sequelize, { connectDB } from "./config/db.js";
// IMPORTANT: import models so associations are registered
import "./models/User.js";
import "./models/Candidate.js";
import "./models/Employer.js";
import "./models/Job.js";
import "./models/Application.js";
import "./models/Admin.js";
import "./models/Support.js";
import "./models/ExcelFile.js";
import "./models/SiteContent.js";
import authRoutes from "./routes/auth.js";
import candidateAuthRoutes from "./routes/candidateAuth.js";
import candidateRoutes from "./routes/candidate.js";
import employerAuthRoutes from "./routes/employerAuthRoutes.js";
import employerJobsRoutes from "./routes/employerJobsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminJobsRoutes from "./routes/adminJobs.js";
import candidateSupportRoutes from "./routes/candidateSupport.js";
import adminSupportRoutes from "./routes/adminSupport.js";
import excelRoutes from "./routes/excelRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

const __dirname = path.resolve();

// Middleware
const allowedOrigins = [
"http://localhost:8080", // local dev
"https://opentoowork.net", // Hostinger frontend
"https://job-portal-frontend.onrender.com" // old frontend
];

app.use(cors({
origin: function(origin, callback){
if(!origin) return callback(null, true); // allow Postman / curl
if(allowedOrigins.includes(origin)){
return callback(null, true);
} else {
return callback(new Error("Not allowed by CORS"));
}
},
credentials: true
}));
app.use(express.json());
app.use("/api/site-content", siteContentRoutes);
app.use("/api/contact", contactRoutes);
// Connect DB (ONLY ONCE)
await connectDB();
await sequelize.sync();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", candidateAuthRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/auth", employerAuthRoutes);
app.use("/api/employer/approved", jobsRoutes);
app.use("/api/employer", employerJobsRoutes);
app.use("/api", adminRoutes);
app.use("/api/admin", adminJobsRoutes);
app.use("/api/candidate", candidateSupportRoutes);
app.use("/api/admin", adminSupportRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/applications", applicationRoutes);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));