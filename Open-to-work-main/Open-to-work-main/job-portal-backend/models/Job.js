// models/Job.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employer from "./Employer.js";

const Job = sequelize.define(
  "Job",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    job_type: {
      type: DataTypes.ENUM("Full-time", "Part-time", "Contract", "Internship"),
      defaultValue: "Full-time",
    },
    pay_type: {
      type: DataTypes.ENUM("Hourly", "Monthly", "Yearly"),
      defaultValue: "Monthly",
    },
    salary_min: { type: DataTypes.FLOAT, allowNull: false },
    salary_max: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, defaultValue: "USD" },
    skills_required: { type: DataTypes.JSON }, // array of strings
    years_required: { type: DataTypes.INTEGER, defaultValue: 0 },
    experience_amount: { type: DataTypes.STRING, defaultValue: "" },
    candidate_experience: { type: DataTypes.STRING, defaultValue: "" },
    approved: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "jobs", timestamps: true }
);

// associations (see below for Application)
Employer.hasMany(Job, { foreignKey: "employerId" });
Job.belongsTo(Employer, { foreignKey: "employerId" });

export default Job;