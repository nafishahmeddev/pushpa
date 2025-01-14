
import { Invoice, Order, OrderItem, Product } from "@app/db/models";
import { InvoiceStatus } from "@app/db/models/invoice/invoice";
import { OrderStatus } from "@app/db/models/order/order";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import moment from "moment";
import { Op, Sequelize } from "sequelize";

const DashboardRouter = Router();

enum TimeFrame {
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Year = "Year",
    Custom = "Custom"
}

const filDates = (timeframe, data: Array<{label: string, value: number}>)=>{

}

DashboardRouter.post("/stats", async (req: IRequest, res: IResponse) => {
    const restaurantId: string = req.auth?.restaurantId as string;
    const timeFrame: TimeFrame = req.body.timeFrame || TimeFrame.Day;

    let start = moment().startOf("D");
    let end = moment().endOf("D");

    if (timeFrame == TimeFrame.Day) {
        start = moment().startOf("D");
        end = moment().endOf("D");
    } else if (timeFrame == TimeFrame.Week) {
        start = moment().startOf("week");
        end = moment().endOf("week");
    } else if (timeFrame == TimeFrame.Month) {
        start = moment().startOf("month");
        end = moment().endOf("month");
    } else if (timeFrame == TimeFrame.Year) {
        start = moment().startOf("year");
        end = moment().endOf("year");
    }
    else if (timeFrame == TimeFrame.Custom) {
        start = moment(req.body.from).startOf("day");
        end = moment(req.body.to).endOf("day");
    }

    const result: {
        tax: number,
        netSales: number,
        revenue: number,
        averageOrder: number,
        orders: number,
        topSellingItems: Array<{ name: string, count: number }>,
        salesChart: Array<{ label: string, value: number }>,
        orderChart: Array<{ label: string, value: number }>,
    } = {
        tax: 0,
        netSales: 0,
        revenue: 0,
        averageOrder: 0,
        orders: 0,
        topSellingItems: [],
        salesChart: [],
        orderChart: []
    }

    const invoices = await Invoice.findAll({
        where: {
            createdAt: {
                [Op.between]: [start.toDate(), end.toDate()]
            },
            restaurantId: restaurantId,
            status: InvoiceStatus.Paid
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
                required: true,
                where: {
                    restaurantId: restaurantId,
                    status: ["Paid", "Completed"]
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
        limit: 5,
    });

    let groupFunc = Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), "%Y-%m-%d %H:00:00");
    if (timeFrame == TimeFrame.Day) {
        groupFunc = Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), "%Y-%m-%d %H:%i:00");
    } else if (timeFrame == TimeFrame.Week) {
        groupFunc = Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), "%Y-%m-%d 00:00:00");
    } else if (timeFrame == TimeFrame.Month) {
        groupFunc = Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), "%Y-%m-%d 00:00:00");
    } else if (timeFrame == TimeFrame.Year) {
        groupFunc = Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), "%Y-01-01 00:00:00");
    } else {
        groupFunc = Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), "%Y-%m-%d 00:00:00");
    }

    result.salesChart = (await Invoice.findAll({
        attributes: [
            [groupFunc, 'label'], // Use Sequelize.fn for better compatibility
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'value'],
        ],
        group: ['label'],
        order: [['label', "ASC"]],
        where: {
            createdAt: {
                [Op.between]: [start.toDate(), end.toDate()]
            },
            restaurantId: restaurantId,
            status: [InvoiceStatus.Paid]
        },
    })).map((e) => {
        return e.toJSON() as unknown as { label: string; value: number };
    })

    result.orderChart = (await Order.findAll({
        attributes: [
            [groupFunc, 'label'], // Use Sequelize.fn for better compatibility
            [Sequelize.fn('COUNT', Sequelize.col('*')), 'value'],
        ],
        group: ['label'],
        order: [['label', "ASC"]],
        where: {
            createdAt: {
                [Op.between]: [start.toDate(), end.toDate()]
            },
            restaurantId: restaurantId,
            status: [OrderStatus.Paid, OrderStatus.Completed]
        },
    })).map((e) => {
        return e.toJSON() as unknown as { label: string; value: number };
    })


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