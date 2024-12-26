//alias support
import 'module-alias/register'
import moduleAlias from 'module-alias'

moduleAlias.addAliases({
  '@app': __dirname
})

import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import consola from "consola";
import menuRouter from "@app/routes/menu";
import MainMiddleware from "@app/middleware/main";
import LocaleMiddleware from "@app/middleware/locale";
import { sequelize } from "@app/db/conn";
import cors from "cors";
import CartsRouter from "@app/routes/carts";
import CategoriesRouter from "@app/routes/categories";
import ProductsRouter from "@app/routes/products";
import OrdersRoute from "@app/routes/orders";
import path from 'path';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(MainMiddleware);
app.use(LocaleMiddleware);

async function main() {
  await sequelize.sync({ alter: true });
  app.use("/api/v1/menu", menuRouter);
  app.use("/api/v1/carts", CartsRouter);
  app.use("/api/v1/categories", CategoriesRouter);
  app.use("/api/v1/products", ProductsRouter);
  app.use("/api/v1/orders", OrdersRoute);
  app.use(express.static(path.resolve(process.env.FRONTEND_PATH || "")))
  app.listen(port, () => {
    consola.info("[HTTP]", `Listening to ${port}`);
  });
}

main();
