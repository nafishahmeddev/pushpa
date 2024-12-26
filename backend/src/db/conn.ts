import consola from "consola";
import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize("pushpa", "master", "12345678", {
  host: "localhost",
  dialect: "mysql",
  logging : e=>consola.info("[SEQUELIZE]",e)
});
