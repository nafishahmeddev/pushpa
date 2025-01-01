
import { Invoice, Order, OrderItem, Product } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import moment from "moment";
import { Op, Sequelize } from "sequelize";

const DashboardRouter = Router();

DashboardRouter.post("/stats", async (req: IRequest, res: IResponse) => {
    const restaurantId: string = req.auth?.restaurantId as string;

    const start = moment().startOf("D");
    const end = moment().endOf("D");

    const result: {
        tax: number,
        netSales: number,
        revenue: number,
        averageOrder: number,
        orders: number,
        topSellingItems: Array<{ name: string, count: number }>,
    } = {
        tax: 0,
        netSales: 0,
        revenue: 0,
        averageOrder: 0,
        orders: 0,
        topSellingItems: [],
    }

    const invoices = await Invoice.findAll({
        where: {
            createdAt: {
                [Op.between]: [start.toDate(), end.toDate()]
            },
            restaurantId: restaurantId
        }
    });

    const topSellingItems = await OrderItem.findAll({
        attributes: [
            'productId',
            [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity']
        ],
        include: [
            {
                attributes: ['name'], // Fetch the product name
                model: Product,
                as: 'product'
            },
            {
                attributes: [],
                model: Order,
                as: 'order',
                where: {
                    restaurantId: restaurantId
                }
            }
        ],
        where: {
            createdAt: {
                [Op.between]: [start.toDate(), end.toDate()]
            }
        },
        group: ['productId', 'product.name'], // Include product name in the group for aggregation
        order: [[Sequelize.literal('total_quantity'), 'DESC']],
        subQuery: false, // Ensures Sequelize doesn’t wrap in unnecessary subqueries
        limit: 10
    });


    result.tax = invoices.reduce((t, c) => t + c.tax, 0);
    result.netSales = invoices.reduce((t, c) => t + (c.amount - c.tax), 0);
    result.revenue = invoices.reduce((t, c) => t + c.amount, 0);
    result.orders = invoices.length;
    result.averageOrder = result.revenue / result.orders;
    result.topSellingItems = topSellingItems.map((item) => {
        const prof = item.toJSON() as unknown as {
            productId: string, total_quantity: number, product: {
                name: string
            }
        };
        return {
            name: prof.product?.name,
            count: prof.total_quantity
        }
    });


    res.json({
        message: "Successful",
        result: result
    })
})

export default DashboardRouter;