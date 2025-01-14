
import { Invoice, Order, OrderItem, Product } from "@app/db/models";
import { InvoiceStatus } from "@app/db/models/invoice/invoice";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import { Op, Sequelize } from "sequelize";
import TimezoneHelper from "@app/helpers/timezone";
import { OrderStatus } from "@app/db/models/order/order";

const DashboardRouter = Router();

enum TimeFrame {
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Year = "Year",
    Custom = "Custom"
}

DashboardRouter.post("/stats", async (req: IRequest, res: IResponse) => {
    const restaurantId: string = req.auth?.restaurantId as string;
    const timeFrame: TimeFrame = req.body.timeFrame || TimeFrame.Day;
    const timezone = req.headers.timezone || "UTC";
    const offset = req.headers["utc-offset"] || "0";
    let start = dayjs().startOf("D");
    let end = dayjs().endOf("D");

    if (timeFrame == TimeFrame.Day) {
        start = dayjs().tz(timezone).startOf("D")
        end = dayjs().tz(timezone).endOf("D")
    } else if (timeFrame == TimeFrame.Week) {
        start = dayjs().tz(timezone).startOf("week")
        end = dayjs().tz(timezone).endOf("week")
    } else if (timeFrame == TimeFrame.Month) {
        start = dayjs().tz(timezone).startOf("month")
        end = dayjs().tz(timezone).endOf("month")
    } else if (timeFrame == TimeFrame.Year) {
        start = dayjs().tz(timezone).startOf("year")
        end = dayjs().tz(timezone).endOf("year")
    }
    else if (timeFrame == TimeFrame.Custom) {
        start = dayjs.tz(req.body.from, timezone).startOf("day")
        end = dayjs.tz(req.body.to, timezone).endOf("day")
    }
    
    const column = Sequelize.fn(
        'CONVERT_TZ',
        Sequelize.col('createdAt'),
        '+00:00',
        TimezoneHelper.convertOffsetToTimezoneFormat(offset)
    )

    let groupFunc = Sequelize.fn('DATE_FORMAT', column, "%Y-%m-%d %H:00:00");
    if (timeFrame == TimeFrame.Day) {
        groupFunc = Sequelize.fn('DATE_FORMAT', column, "%Y-%m-%d %H:00:00");
    } else if (timeFrame == TimeFrame.Week) {
        groupFunc = Sequelize.fn('DATE_FORMAT', column, "%Y-%m-%d 00:00:00");
    } else if (timeFrame == TimeFrame.Month) {
        groupFunc = Sequelize.fn('DATE_FORMAT', column, "%Y-%m-%d 00:00:00");
    } else if (timeFrame == TimeFrame.Year) {
        groupFunc = Sequelize.fn('DATE_FORMAT', column, "%Y-%m-01 00:00:00");
    } else {
        groupFunc = Sequelize.fn('DATE_FORMAT', column, "%Y-%m-%d 00:00:00");
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


    result.salesChart = (await Invoice.findAll({
        attributes: [
            [groupFunc, 'label'],
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'value'],
        ],
        group: ['label'],
        order: [['label', "ASC"]],
        where: {
            createdAt: {
                [Op.between]: [start.utc().toDate(), end.utc().toDate()]
            },
            restaurantId: restaurantId,
            status: [InvoiceStatus.Paid]
        },
    })).map((e) => {
        console.log(e.toJSON());
        return e.toJSON() as unknown as { label: string; value: number };
    }), timeFrame, start.toString(), end.toString()


    result.orderChart = (await Order.findAll({
        attributes: [
            [groupFunc, 'label'],
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
    }), timeFrame, start.toString(), end.toString()

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