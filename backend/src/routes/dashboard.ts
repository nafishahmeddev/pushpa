
import { Invoice, Order, OrderItem, Product } from "@app/db/models";
import { InvoiceStatus } from "@app/db/models/invoice/invoice";
import { OrderStatus } from "@app/db/models/order/order";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import moment, { Moment, unitOfTime } from "moment";
import { Op, Sequelize } from "sequelize";

const DashboardRouter = Router();

enum TimeFrame {
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Year = "Year",
    Custom = "Custom"
}
function enumerateDates(
    timeFrame: TimeFrame,
    start: string,
    end: string
): string[] {
    let diff: string;
    let format: string;

    // Determine diff and format based on TimeFrame
    if ([TimeFrame.Day].includes(timeFrame)) {
        diff = 'hour';
        format = 'YYYY-MM-DD HH:00:00';
    } else if ([TimeFrame.Week].includes(timeFrame)) {
        diff = 'day';
        format = 'YYYY-MM-DD 00:00:00';
    } else if ([TimeFrame.Month].includes(timeFrame)) {
        diff = 'day';
        format = 'YYYY-MM-DD 00:00:00';
    } else if ([TimeFrame.Year].includes(timeFrame)) {
        diff = 'month';
        format = 'YYYY-MM-01 00:00:00';
    } else if ([TimeFrame.Custom].includes(timeFrame)) {
        diff = 'day';
        format = 'YYYY-MM-DD 00:00:00';
    } else {
        throw new Error("Invalid TimeFrame");
    }

    const startDate = moment(start);
    const endDate = moment(end);
    const result: string[] = [];

    // Enumerate dates
    let current = startDate.clone();
    while (current.isSameOrBefore(endDate)) {
        result.push(current.format(format));
        current.add(1, diff as moment.unitOfTime.DurationConstructor);
    }

    return result;
}
function fillMissingDates(
    data: Array<{ label: string; value: number }>,
    timeFrame: TimeFrame,
    start: string,
    end: string
): Array<{ label: string; value: number }> {
    // Generate the full range of dates
    const fullDates = enumerateDates(timeFrame, start, end);

    // Create a map of existing data for quick lookup
    const dataMap = new Map(data.map(item => [item.label, item.value]));
    console.log(dataMap, fullDates);

    // Fill in missing dates with value 0
    const filledData = fullDates.map(date => ({
        label: date,
        value: dataMap.get(date) || 0
    }));

    return filledData;
}

DashboardRouter.post("/stats", async (req: IRequest, res: IResponse) => {
    const restaurantId: string = req.auth?.restaurantId as string;
    const timeFrame: TimeFrame = req.body.timeFrame || TimeFrame.Day;

    let start = moment().startOf("D");
    let end = moment().endOf("D");

    if (timeFrame == TimeFrame.Day) {
        start = moment().startOf("D");
        end = moment.min(moment().endOf("D"), moment());
    } else if (timeFrame == TimeFrame.Week) {
        start = moment().startOf("week");
        end = moment.min(moment().endOf("week"), moment());
    } else if (timeFrame == TimeFrame.Month) {
        start = moment().startOf("month");
        end = moment.min(moment().endOf("month"), moment());
    } else if (timeFrame == TimeFrame.Year) {
        start = moment().startOf("year");
        end = moment.min(moment().endOf("year"), moment());
    }
    else if (timeFrame == TimeFrame.Custom) {
        start = moment(req.body.from).startOf("day");
        end = moment.min(moment(req.body.to).endOf("day"), moment());
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
        groupFunc = Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), "%Y-%m-%d %H:00:00");
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

    result.salesChart = fillMissingDates(result.salesChart,timeFrame,start.toString(), end.toString())

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

    result.orderChart = fillMissingDates(result.orderChart,timeFrame,start.toString(), end.toString())


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