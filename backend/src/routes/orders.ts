
import { sequelize } from "@app/db/conn";
import { Product, Order, OrderItem, Invoice, InvoiceItem, Kot } from "@app/db/models";
import { OrderStatus } from "@app/db/models/order/order";
import { OrderItemStatus } from "@app/db/models/order/order-item";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { ICartItem } from "@app/types/cart";
import { Router } from "express";
import { Op, or } from "sequelize";
import { v4 } from "uuid";

const OrdersRouter = Router();

OrdersRouter.get("/pending-list", async (req: IRequest, res: IResponse) => {
    const orders = await Order.findAll({ where: { status: ["Draft", "Pending"] } });
    res.json({
        result: orders,
        message: "Successful"
    })
})

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
                    {
                        model: Kot,
                        as: "kot"
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

OrdersRouter.post("/", async (req: IRequest, res: IResponse) => {
    const transaction = await sequelize.transaction();
    try {
        const order = await Order.create({
            restaurantId: req.auth?.restaurantId,
        }, { transaction });

        await transaction.commit();

        res.json({
            result: order,
            message: "Successful"
        });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({
            message: "Something went wrong"
        });

    }
});

OrdersRouter.put("/:orderId", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const name: string = req.body.name;
    const items: Array<ICartItem> = req.body.items;

    const order = await Order.findOne({
        where: {
            id: orderId
        },
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
    const transaction = await sequelize.transaction();
    try {

        await OrderItem.destroy({
            where: { orderId: orderId, kotId: null },
            transaction
        });

        await Promise.all(items.map(item => OrderItem.create({
            ...item,
            orderId: order.id
        }, {
            transaction
        })))

        await Order.update({
            restaurantId: req.auth?.restaurantId,
        }, { transaction, where: { id: orderId } });

        await transaction.commit();
        await order.reload();

        res.json({
            result: order,
            message: "Successful"
        });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({
            message: "Something went wrong"
        });

    }
});

OrdersRouter.delete("/:orderId", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
        where: {
            id: orderId,
            status: "Draft"
        },

    });
    if (!order) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }
    const transaction = await sequelize.transaction();
    try {
        await OrderItem.destroy({ where: { orderId: orderId } });
        await Order.destroy({ where: { id: orderId } });
        await transaction.commit();
        res.json({
            message: "Successful"
        });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({
            message: "Something went wrong"
        });

    }
});

OrdersRouter.post("/:orderId/place", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const transaction = await sequelize.transaction();
    try {
        let order = await Order.findOne({
            where: {
                id: orderId,
                status: {
                    [Op.notIn]: ["Paid", "Completed"]
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
                        }
                    ]
                }
            ],
            transaction
        },);
        if (!order) {
            res.status(404).json({
                message: "Order not found"
            })
            return;
        }


        const invoice = await Invoice.create({
            restaurantId: order.restaurantId,
            amount: 0,
            tax: 0
        }, {
            transaction
        });
        await Promise.all((order.items ?? []).map(async (item) => {
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

        await OrderItem.update({ status: OrderItemStatus.Delivered }, { where: { orderId: order.id }, transaction });
        await order.update({ status: OrderStatus.Completed, invoiceId: invoice.id }, { transaction: transaction });


        const createdInvoice = await Invoice.findOne({
            where: { id: invoice.id },
            include: [{
                model: InvoiceItem,
                as: "items",
            }],
            transaction
        })

        transaction.commit();
        res.json({
            result: createdInvoice,
            message: "Successful"
        })
    } catch (error) {
        console.log(error);
        transaction.rollback();
        res.status(400).json({
            message: "Something went wrong..."
        })
    }
});

OrdersRouter.post("/:orderId/complete", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const transaction = await sequelize.transaction();
    try {
        let order = await Order.findOne({
            where: {
                id: orderId,
                status: {
                    [Op.notIn]: ["Paid", "Completed"]
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
                        }
                    ]
                }
            ],
            transaction
        },);
        if (!order) {
            res.status(404).json({
                message: "Order not found"
            })
            return;
        }


        const invoice = await Invoice.create({
            restaurantId: order.restaurantId,
            amount: 0,
            tax: 0
        }, {
            transaction
        });
        await Promise.all((order.items ?? []).map(async (item) => {
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

        await OrderItem.update({ status: OrderItemStatus.Delivered }, { where: { orderId: order.id }, transaction });
        await order.update({ status: OrderStatus.Completed, invoiceId: invoice.id }, { transaction: transaction });


        const createdInvoice = await Invoice.findOne({
            where: { id: invoice.id },
            include: [{
                model: InvoiceItem,
                as: "items",
            }],
            transaction
        })

        transaction.commit();
        res.json({
            result: createdInvoice,
            message: "Successful"
        })
    } catch (error) {
        console.log(error);
        transaction.rollback();
        res.status(400).json({
            message: "Something went wrong..."
        })
    }
});

OrdersRouter.post("/:orderId/items", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const item: ICartItem = req.body.item;

    let order = await Order.findOne({
        where: {
            id: orderId
        },
    });


    if (!order) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }

    let orderItem = await OrderItem.findOne({
        where: {
            orderId: orderId,
            productId: item.productId,
            kotId: null
        },
    });

    const transaction = await sequelize.transaction();
    try {

        if (!orderItem) {
            orderItem = await OrderItem.create({
                ...item,
                orderId: orderId,
            }, { transaction: transaction })
        } else {
            orderItem.quantity = item.quantity;
            await orderItem.save({ transaction: transaction })
        }

        await transaction.commit();
        await order.reload({
            include: [{
                model: OrderItem,
                as: "items",
                include: [
                    {
                        model: Product,
                        as: "product"
                    },
                    {
                        model: Kot,
                        as: "kot"
                    }
                ]
            }]
        });

        res.json({
            result: order,
            message: "Successful"
        });
    } catch (err) {
        console.log(err);
        await transaction.rollback();
        res.status(500).json({
            message: "Something went wrong"
        });

    }
});

OrdersRouter.delete("/:orderId/items", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const productId = req.body.productId;
    let orderItem = await OrderItem.findOne({
        where: {
            productId: productId,
            orderId: orderId,
            kotId: null
        },
    });

    if (!orderItem) {
        res.status(404).json({
            message: "Order item not found"
        })
        return;
    }

    const transaction = await sequelize.transaction();
    try {
        await orderItem.destroy({ transaction });
        await transaction.commit();
        res.json({
            message: "Successful"
        });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({
            message: "Something went wrong"
        });

    }
});


OrdersRouter.patch("/:orderId/items/cancel", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const orderItemId = req.body.orderItemId;
    let orderItem = await OrderItem.findOne({
        where: {
            id: orderItemId,
            orderId: orderId,
            kotId: { [Op.not]: null }
        },
        include: [
            {
                model: Product,
                as: "product"
            },
            {
                model: Kot,
                as: "kot"
            },
            {
                model: Order,
                as: "order",
                required: true,
                where: {
                    id: orderId
                }
            }
        ]
    });

    if (!orderItem) {
        res.status(404).json({
            message: "Order item not found"
        })
        return;
    }

    const transaction = await sequelize.transaction();
    try {

        if (orderItem.kotId) {
            orderItem.status = OrderItemStatus.Cancelled;
            await orderItem.save({ transaction });
        } else {
            await orderItem.destroy({ transaction });
            orderItem = null;
        }

        await transaction.commit();

        res.json({
            result: orderItem,
            message: "Successful"
        });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({
            message: "Something went wrong"
        });

    }
});




export default OrdersRouter;