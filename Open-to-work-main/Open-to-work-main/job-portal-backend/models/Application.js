// models/Application.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Candidate from "./Candidate.js";
import Job from "./Job.js";

const Application = sequelize.define(
  "Application",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    resume: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("Applied", "Reviewed", "Rejected", "Selected"),
      defaultValue: "Applied",
    },
  },
  { tableName: "applications", timestamps: true }
);

Candidate.hasMany(Application, { foreignKey: "candidateId" });
Application.belongsTo(Candidate, { foreignKey: "candidateId", as: "applicant" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

export default Application;