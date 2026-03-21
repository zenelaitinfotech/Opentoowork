import express from "express";
import { signupEmployer, signinEmployer, forgotPasswordEmployer, resetPasswordEmployer } from "../controllers/employerAuthController.js";
import { getEmployerProfile } from "../controllers/employerController.js"; // must exist
import { authMiddleware } from "../middleware/authMiddleware.js"; // must exist


const router = express.Router();

// Auth routes
router.post("/employer/signup", signupEmployer);
router.post("/employer/signin", signinEmployer);
router.post("/employer/forgot-password", forgotPasswordEmployer);
router.post("/employer/reset-password", resetPasswordEmployer);


// Profile route
router.get("/employer/profile", authMiddleware, getEmployerProfile);

export default router;