import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Candidate from "./Candidate.js";
 
const Support = sequelize.define(
  "Support",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      defaultValue: "pending",
    },
    candidateId: {
      type:       DataTypes.INTEGER,
      allowNull:  true,  // true = contact form works without login
      references: { model: "candidates", key: "id" },
    },
  },
  { tableName: "supports", timestamps: true }
);
 
Candidate.hasMany(Support, { foreignKey: "candidateId" });
Support.belongsTo(Candidate, { foreignKey: "candidateId" });
 
export default Support;
 