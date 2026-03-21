import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;   // ✅ changed

    const admin = await Admin.findOne({ where: { username } }); // ✅ changed
    if (!admin) {
      return res.status(400).json({ message: "Invalid Username" }); // ✅ optional change
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error); // ✅ ADD THIS (very important for debugging)
    res.status(500).json({ message: "Server Error" });
  }
};