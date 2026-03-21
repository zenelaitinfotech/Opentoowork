import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sequelize, { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    await sequelize.sync();

    const email = "admin@opentoowork.com";
    const password = "admin123";

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({ email, password: hashedPassword });

    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();