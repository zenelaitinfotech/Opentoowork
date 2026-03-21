import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
 username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    otp: { type: DataTypes.STRING },
  },
  { tableName: "admins", timestamps: true }
);

export default Admin;