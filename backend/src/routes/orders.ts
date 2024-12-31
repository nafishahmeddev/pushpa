
import { sequelize } from "@app/db/conn";
import { Product, Order, OrderItem, Invoice, InvoiceItem } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { Op } from "sequelize";

const OrdersRouter = Router();

OrdersRouter.get("/", async (req: IRequest, res: IResponse) => {
    const orders = await Order.findAll();
    res.json({
        result: orders,
        message: "Successful"
    })
})

OrdersRouter.get("/drafts", async (req: IRequest, res: IResponse) => {
    const orders = await Order.findAll({ where: { status: "Draft" } });
    res.json({
        result: orders,
        message: "Successful"
    })
})

OrdersRouter.post("/", async (req: IRequest, res: IResponse) => {
    const count = await Order.count({ where: { status: "Draft" } });
    if (count > 5) {
        res.status(400).json({
            message: "Maximum order number reached..."
        })
        return;
    }
    const order = new Order({
        restaurantId: req.auth?.restaurantId,
    });

    await order.save();
    res.json({
        result: order,
        message: "Successful"
    });
});

OrdersRouter.get("/:orderId", async (req: IRequest, res: IResponse) => {
    const order = await Order.findOne({
        where: {
            id: req.params.orderId
        },
        include: [
            {
                model: OrderItem,
                as: "items",
                include: [
                    {
                        model: Product,
                        as: "product"
                    },
                ]
            }
        ]
    });
    if (!order) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }
    res.json({
        result: order,
        message: "Successful"
    })
});

OrdersRouter.put("/:orderId/items", async (req: IRequest, res: IResponse) => {
    const productId: string = req.body.productId;
    const quantity: number = req.body.quantity;
    const orderId: string = req.params.orderId;

    const [order, product] = await Promise.all([
        Order.findByPk(orderId),
        Product.findByPk(productId),
    ]);


    if (!order || !product) {
        res.status(404).json({
            message: "Invalid data...",
        });
        return;
    }


    let item = await OrderItem.findOne({
        where: {
            productId,
            orderId
        },
    })
    if (!item) {
        item = new OrderItem({
            productId,
            orderId,
            quantity: 0
        })
    }

    item.quantity = quantity;
    if (quantity) {
        await item.destroy();
    } else {
        await item.save();
    }

    res.json({
        message: "Successful",
    });
});

OrdersRouter.post("/:orderId/items", async (req: IRequest, res: IResponse) => {
    const productId: string = req.body.productId;
    const orderId: string = req.params.orderId;

    const [order, product] = await Promise.all([
        Order.findByPk(orderId),
        Product.findByPk(productId),
    ]);


    if (!order || !product) {
        res.status(404).json({
            message: "Invalid data...",
        });
        return;
    }


    let item = await OrderItem.findOne({
        where: {
            productId,
            orderId
        },
    })
    if (!item) {
        item = new OrderItem({
            productId,
            orderId,
            quantity: 0
        })
    }

    item.quantity += 1;
    await item.save();

    res.json({
        message: "Successful",
    });
});

OrdersRouter.delete("/:orderId/items", async (req: IRequest, res: IResponse) => {
    const orderId: string = req.params.orderId;
    const productId: string = req.body.productId;

    const [order, product, item] = await Promise.all([
        Order.findByPk(orderId),
        Product.findByPk(productId),
        OrderItem.findOne({
            where: {
                productId,
                orderId
            },
        })
    ]);

    if (!order || !product || !item) {
        res.status(404).json({
            message: "Invalid data...",
        });
        return;
    }

    item.quantity -= 1;

    if (item.quantity < 1) {
        await item.destroy();
    } else {
        await item.save();
    }
    res.json({
        message: "Successful",
    });
});

OrdersRouter.get("/:orderId/place", async (req: IRequest, res: IResponse) => {
    const order = await Order.findOne({
        where: {
            id: req.params.orderId,
            status: {
                [Op.notIn]: ["Completed"]
            }
        },
        include: [
            {
                model: OrderItem,
                as: "items",
                include: [
                    {
                        model: Product,
                        as: "product"
                    },
                ]
            }
        ]
    });
    if (!order) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }
    let invoiceId: string = "";
    await sequelize.transaction({}, async (transaction) => {
        const invoice = await Invoice.create({
            restaurantId: order.restaurantId,
            amount: 0,
            tax: 0
        });

        const cartItems = order.items ?? [];
        await Promise.all(cartItems.map(async (item) => {
            const price = item?.product?.price ?? 0;
            const tax = item?.product?.tax ?? 0;
            const basePrice = price / (1 + (tax / 100));
            const amount = price * item.quantity;
            const orderItem = new InvoiceItem({
                invoiceId: invoice.id,
                quantity: item.quantity,
                name: item.product?.name ?? "",
                price: price,
                amount: amount,
                tax: (basePrice * (tax / 100)) * item.quantity
            });

            invoice.tax += orderItem.tax;
            invoice.amount += orderItem.amount;
            await orderItem.save({ transaction: transaction });
            return orderItem;
        }));

        await invoice.save({ transaction: transaction });

        await OrderItem.update({ status: "Delivered" }, { where: { orderId: order.id } });
        await order.update({ status: "Completed", invoiceId: invoice.id }, { transaction: transaction });

        invoiceId = invoice.id;
    }).catch(er => {
        console.log(er);
        return undefined;
    })

    if (invoiceId) {
        const createdOrder = await Invoice.findOne({
            where: { id: invoiceId },
            include: [{
                model: InvoiceItem,
                as: "items",
            }],
        })
        res.json({
            result: createdOrder,
            message: "Successful"
        })
    } else {
        res.status(400).json({
            message: "Something went wrong..."
        })
    }
});

export default OrdersRouter;