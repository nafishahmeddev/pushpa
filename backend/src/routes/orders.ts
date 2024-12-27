
import { Order, OrderItem } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";

const OrdersRoute = Router();

OrdersRoute.get("/", async (req: IRequest, res: IResponse) => {
    const menu = await Order.findAll({
        order: [["name", "asc"]],
    });
    res.json({
        result: menu,
        message: "Successful"
    })
})

OrdersRoute.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: {
        createdAt: [from: string, to: string]
    } = req.body.filter;

    //build filter
    const where :WhereOptions<InferAttributes<Order, {}>>  = {

    };

    if(filter.createdAt && filter.createdAt[0] && filter.createdAt[1]){
        where.createdAt = {
            [Op.between]: filter.createdAt
        }
    }

    const paginatedOrders = await Order.findAndCountAll({
        order: [["createdAt", "asc"]],
        limit: limit,
        offset: (page - 1) * limit,
        where:where
    });

    const pages = Math.ceil(paginatedOrders.count / limit);
    res.json({
        result: {
            page: page,
            pages: pages,
            records: paginatedOrders.rows
        },
        message: "Successful"
    })
})

OrdersRoute.get("/:orderId", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;

    const order = await Order.findByPk(orderId, {
        include: [{
            model: OrderItem,
            as: "items"
        }]
    });
    if (!order) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }

    await order.update({ ...req.body });
    res.json({
        result: order,
        message: "Successful"
    })
});
export default OrdersRoute;