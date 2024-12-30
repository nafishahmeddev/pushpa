
import { Order } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import moment from "moment";
import { Op } from "sequelize";

const DashboardRouter = Router();

DashboardRouter.post("/stats", async (req: IRequest, res: IResponse) => {
    const restaurantId: string = req.auth?.restaurantId as string;

    const start = moment().startOf("D");
    const end = moment().endOf("D");

    const sales = await Order.sum("amount", {
        where: {
            createdAt: {
                [Op.between]: [start.toDate(), end.toDate()]
            },
            restaurantId: restaurantId
        }
    })

    const orders = await Order.count({
        where: {
            createdAt: {
                [Op.between]: [start.toDate(), end.toDate()]
            },
            restaurantId: restaurantId
        }
    })
    res.json({
        message: "Successful",
        result: {
            sales,
            orders
        }
    })
})

export default DashboardRouter;