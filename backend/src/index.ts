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
import UsersRouter from './routes/users';
import AuthMiddleware from './middleware/auth';
import AuthRouter from './routes/auth';
import moment from "moment";
import TablesRouter from "./routes/tables";
import DashboardRouter from "./routes/dashboard";
import LocationsRouter from "./routes/locations";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(MainMiddleware);
app.use(LocaleMiddleware);
app.set("view engine", "ejs");
app.set('views', path.resolve('./views/'))
app.locals.moment = moment;

async function main() {
  await sequelize.sync({ alter: true });
  app.use("/api/v1/menu", AuthMiddleware, menuRouter);
  app.use("/api/v1/dashboard", AuthMiddleware, DashboardRouter);
  app.use("/api/v1/carts", AuthMiddleware, CartsRouter);
  app.use("/api/v1/categories", AuthMiddleware, CategoriesRouter);
  app.use("/api/v1/products", AuthMiddleware, ProductsRouter);
  app.use("/api/v1/orders", AuthMiddleware, OrdersRoute);
  app.use("/api/v1/users", AuthMiddleware, UsersRouter);
  app.use("/api/v1/locations", AuthMiddleware, LocationsRouter);
  app.use("/api/v1/tables", AuthMiddleware, TablesRouter);
  app.use("/api/v1/auth", AuthRouter);
  app.use(express.static(path.resolve(process.env.FRONTEND_PATH || "")))
  app.use("*", express.static(path.resolve(path.join(process.env.FRONTEND_PATH || "", "index.html"))))
  app.listen(port, () => {
    consola.info("[HTTP]", `Listening to ${port}`);
  });
}

main();
