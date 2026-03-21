import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SiteContent = sequelize.define("SiteContent", {
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default SiteContent;