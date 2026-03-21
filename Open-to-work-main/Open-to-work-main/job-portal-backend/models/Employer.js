// models/Employer.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Employer = sequelize.define(
  "Employer",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: { type: DataTypes.STRING, allowNull: false },
    location: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    resetOTP: DataTypes.STRING,
    resetOTPExpire: DataTypes.DATE,
  },
  { tableName: "employers", timestamps: true }
);

export default Employer;