import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Candidate = sequelize.define(
  "Candidate",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: DataTypes.STRING,
    location: DataTypes.STRING,
    password: { type: DataTypes.STRING, allowNull: false },
    about: DataTypes.STRING,
    skills: { type: DataTypes.JSON }, // array of strings
    socialLinks: { type: DataTypes.JSON }, // { linkedin, github }
    resume_url: DataTypes.STRING,
    resetOTP: DataTypes.STRING,
    resetOTPExpire: DataTypes.DATE,
  },
  { tableName: "candidates", timestamps: true }
);
export default Candidate;