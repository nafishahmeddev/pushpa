
import { Invoice, InvoiceItem, Kot, Order, Restaurant } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";

const InvoicesRouter = Router();

InvoicesRouter.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: {
        createdAt: [from: string, to: string]
    } = req.body.filter;
    const order = req.body.order || ["createdAt", "DESC"];

    //build filter
    const where: WhereOptions<InferAttributes<Invoice, {}>> = {
        restaurantId: req.auth?.restaurantId
    };

    if (filter.createdAt && filter.createdAt[0] && filter.createdAt[1]) {
        where.createdAt = {
            [Op.between]: filter.createdAt
        }
    }

    const paginated = await Invoice.findAndCountAll({
        order: [order],
        limit: limit,
        offset: (page - 1) * limit,
        where: where
    });

    const pages = Math.ceil(paginated.count / limit);
    res.json({
        result: {
            page: page,
            pages: pages,
            count: paginated.count,
            records: paginated.rows
        },
        message: "Successful"
    })
})

InvoicesRouter.get("/:invoiceId", async (req: IRequest, res: IResponse) => {
    const invoiceId = req.params.invoiceId;

    const invoice = await Invoice.findByPk(invoiceId, {
        include: [{
            model: InvoiceItem,
            as: "items"
        }]
    });
    if (!invoice) {
        res.status(404).json({
            message: "Invoice not found"
        })
        return;
    }

    await invoice.update({ ...req.body });
    res.json({
        result: invoice,
        message: "Successful"
    })
});

InvoicesRouter.get("/:invoiceId/receipt", async (req: IRequest, res: IResponse) => {
    const invoiceId = req.params.invoiceId;

    const invoice = await Invoice.findByPk(invoiceId, {
        include: [
            {
                model: InvoiceItem,
                as: "items"
            },
            {
                model: Restaurant,
                as: "restaurant"
            }
        ]
    });
    if (!invoice) {
        res.status(404).json({
            message: "Invoice not found"
        })
        return;
    }

    const order = await Order.findOne({
        where: {
            invoiceId: invoiceId
        },
        include: [
            {
                attributes: ["tokenNo"],
                model: Kot,
                as: "kotList"
            }
        ]
    })

    res.render("invoice-receipt.ejs", { invoice: invoice.toJSON(), order: order?.toJSON() })
});
export default InvoicesRouter;