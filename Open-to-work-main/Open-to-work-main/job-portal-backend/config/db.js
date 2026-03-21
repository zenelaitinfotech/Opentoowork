import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected");
  } catch (error) {
    console.error("Error connecting to MySQL:", error.message);
    process.exit(1);
  }
};

export default sequelize;