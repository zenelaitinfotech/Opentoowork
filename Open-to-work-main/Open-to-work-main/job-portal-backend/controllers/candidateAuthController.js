import Candidate from "../models/Candidate.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Op } from "sequelize";

export const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Candidate.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: "candidate" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= SIGNUP =================
export const signup = async (req, res) => {
  const { fullName, email, phone, location, password } = req.body;

  const existing = await Candidate.findOne({ where: { email } });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const candidate = await Candidate.create({
    full_name: fullName,
    email,
    phone,
    location,
    password: hashedPassword,
  });

  res.json({ message: "Account created successfully" });
};


// ================= SIGNIN =================
export const signin = async (req, res) => {
  const { email, password } = req.body;

  const candidate = await Candidate.findOne({ where: { email } });
  if (!candidate)
    return res.status(400).json({ message: "Invalid email" });

  const isMatch = await bcrypt.compare(password, candidate.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
  {
    id: candidate.id,
     email: candidate.email,
    role: "candidate"
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

  res.json({ token });
};


// ================= FORGOT PASSWORD (OTP) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Candidate.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 IMPORTANT: convert to string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save();

    console.log("Generated OTP:", otp); // check in terminal

    // 👉 Here you send OTP via email

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    console.log("Entered OTP:", otp);

    const user = await Candidate.findOne({
      where: {
        email,
        resetOTP: otp,
        resetOTPExpire: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetOTP = null;
    user.resetOTPExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};