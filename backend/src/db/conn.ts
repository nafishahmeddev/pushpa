import consola from "consola";
import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASS as string, {
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  dialect: "mysql",
  logging: e => consola.info("[SEQUELIZE]", e)
});
