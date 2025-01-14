import dotenv from "dotenv";
dotenv.config();
import path from 'path';
import express, { Application } from "express";
import consola from "consola";
import dayjs from "dayjs";

import { sequelize } from "@app/db/conn";

import cors from "cors";
import MainMiddleware from "@app/middleware/main";
import LocaleMiddleware from "@app/middleware/locale";
import AuthMiddleware from '@app/middleware/auth';

import MenuRouter from "@app/routes/menu";
import CategoriesRouter from "@app/routes/categories";
import ProductsRouter from "@app/routes/products";
import InvoicesRouter from "@app/routes/invoices";
import UsersRouter from '@app/routes/users';
import AuthRouter from '@app/routes/auth';
import TablesRouter from "@app/routes/tables";
import DashboardRouter from "@app/routes/dashboard";
import LocationsRouter from "@app/routes/locations";
import OrdersRouter from "@app/routes/orders";
import AccountRouter from "./routes/account";
import { uploadPath } from "./helpers/dirs";


const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(MainMiddleware);
app.use(LocaleMiddleware);

app.set("view engine", "ejs");
app.set('views', path.resolve('./views/'))

//set express locals
app.locals.dayjs = dayjs;


async function main() {
  consola.info("[DB]", "Booting the database")
  await sequelize.sync({ alter: true });

  consola.info("[HTTP]", "Attaching the routers")
  app.use("/api/v1/menu", AuthMiddleware, MenuRouter);
  app.use("/api/v1/dashboard", AuthMiddleware, DashboardRouter);
  app.use("/api/v1/invoices", AuthMiddleware, InvoicesRouter);
  app.use("/api/v1/categories", AuthMiddleware, CategoriesRouter);
  app.use("/api/v1/products", AuthMiddleware, ProductsRouter);
  app.use("/api/v1/orders", AuthMiddleware, OrdersRouter);
  app.use("/api/v1/users", AuthMiddleware, UsersRouter);
  app.use("/api/v1/locations", AuthMiddleware, LocationsRouter);
  app.use("/api/v1/tables", AuthMiddleware, TablesRouter);
  app.use("/api/v1/account", AuthMiddleware, AccountRouter);
  app.use("/api/v1/auth", AuthRouter);

  app.use("/public/uploads", express.static(uploadPath()))

  //start the server
  consola.info("[HTTP]", "Starting http server")
  app.listen({ port: port, hostname: "localhost" }, () => {
    consola.info("[HTTP]", `Server is running on ${port}`);
  });
}

main();
