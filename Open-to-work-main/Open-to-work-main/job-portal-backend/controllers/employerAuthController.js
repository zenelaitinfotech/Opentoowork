import Employer from "../models/Employer.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// ================= SEND OTP =================
export const forgotPasswordEmployer = async (req, res) => {
  try {
    const { email } = req.body;

    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    employer.resetOTP = otp;
    employer.resetOTPExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await employer.save();

    await sendEmail(email, "Employer Password Reset OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= RESET PASSWORD =================
export const resetPasswordEmployer = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const employer = await Employer.findOne({
      where: {
        email,
        resetOTP: otp,
        resetOTPExpire: { [Op.gt]: new Date() },
      },
    });

    if (!employer) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    employer.password = await bcrypt.hash(newPassword, 10);
    employer.resetOTP = null;
    employer.resetOTPExpire = null;

    await employer.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// ================= SIGNUP =================
export const signupEmployer = async (req, res) => {
  try {
    const { companyName, location, email, password } = req.body;

    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employer = await Employer.create({
      companyName,
      location,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: employer.id, role: "employer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      employer: {
        id: employer.id,
        email: employer.email,
        companyName: employer.companyName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= SIGNIN =================
export const signinEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: employer.id, role: "employer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      employer: {
        id: employer.id,
        email: employer.email,
        companyName: employer.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

