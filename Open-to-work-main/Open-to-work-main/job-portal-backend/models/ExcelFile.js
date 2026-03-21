import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ExcelFile = sequelize.define(
  "ExcelFile",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fileName: { type: DataTypes.STRING, allowNull: false },
    headers: { type: DataTypes.JSON, allowNull: false }, // array of strings
    rows: { type: DataTypes.JSON, allowNull: false }, // array of objects/arrays
  },
  { tableName: "excel_files", timestamps: true }
);

export default ExcelFile;