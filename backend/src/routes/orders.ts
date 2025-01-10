
import { sequelize } from "@app/db/conn";
import { Product, Order, OrderItem, Invoice, InvoiceItem, Kot, Table, Restaurant, User } from "@app/db/models";
import { OrderType, OrderStatus } from "@app/db/models/order/order";
import { OrderItemStatus } from "@app/db/models/order/order-item";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { ICartItem } from "@app/types/cart";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";

const OrdersRouter = Router();
OrdersRouter.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: {
        createdAt: [from: string, to: string]
    } = req.body.filter;
    const order = req.body.order || ["createdAt", "DESC"];

    //build filter
    const where: WhereOptions<InferAttributes<Order, {}>> = {
        restaurantId: req.auth?.restaurantId
    };

    if (filter.createdAt && filter.createdAt[0] && filter.createdAt[1]) {
        where.createdAt = {
            [Op.between]: filter.createdAt
        }
    }

    const paginated = await Order.findAndCountAll({
        order: [order],
        limit: limit,
        offset: (page - 1) * limit,
        where: where,
        include: [{ model: Table, as: "table" }, { model: User, as: "user" }]
    });

    const kots = await Kot.findAll({ where: { orderId: paginated.rows.map(e => e.id) } });

    paginated.rows = paginated.rows.map(e => {
        e = e.toJSON();
        e.kotList = kots.filter(k => k.orderId == e.id);
        return e;
    })

    const pages = Math.ceil(paginated.count / limit);
    res.json({
        result: {
            page: page,
            pages: pages,
            records: paginated.rows,
            count: paginated.count
        },
        message: "Successful"
    })
})

OrdersRouter.get("/pending-list", async (req: IRequest, res: IResponse) => {
    const orders = await Order.findAll({
        where: {
            status: [OrderStatus.Draft, OrderStatus.Ongoing],
            restaurantId: req.auth?.restaurantId
        },
        include: [
            {
                model: Table,
                as: "table"
            }
        ]
    });
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
            },
            {
                model: Kot,
                as: "kotList"
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
    const type: OrderType = req.body.type;
    const tableId: string | undefined = req.body.tableId;


    if (type == OrderType.DineIn) {
        const order = await Order.findOne({
            where: {
                status: [OrderStatus.Draft, OrderStatus.Ongoing],
                tableId: tableId
            }
        });

        if (order) {
            res.status(400).json({
                message: "An order already exist for same table."
            });
            return;
        }
    }

    const transaction = await sequelize.transaction();
    try {
        const order = await Order.create({
            restaurantId: req.auth?.restaurantId,
            userId: req.auth?.userId,
            tableId,
            type
        }, { transaction });

        await transaction.commit();

        await order.reload({
            include: [{
                model: Table,
                as: "table"
            }]
        })
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
    const order = await Order.findOne({
        where: {
            id: orderId
        },
        include: [
            {
                model: Table,
                as: "table"
            }
        ]
    });
    if (!order) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }
    const transaction = await sequelize.transaction();
    try {
        await Order.update({
            restaurantId: req.auth?.restaurantId,
            ...req.body,
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

    const count = await OrderItem.count({ where: { orderId } });

    if (count > 0) {
        res.status(400).json({
            message: "Order cannot be deleted with items"
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

OrdersRouter.post("/:orderId/kot-create", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
        where: {
            id: orderId,
            status: {
                [Op.notIn]: [OrderStatus.Paid, OrderStatus.Completed]
            }
        }
    });

    if (!order) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }

    const count = await OrderItem.count({
        where: {
            kotId: null,
            orderId: orderId
        },
    });

    if (!count) {
        res.status(404).json({
            message: "Order not found"
        })
        return;
    }

    const transaction = await sequelize.transaction();
    try {
        const kot = await Kot.create({
            orderId,
            restaurantId: order.restaurantId
        }, {
            transaction
        });

        await OrderItem.update({ kotId: kot.id, status: OrderItemStatus.Preparing }, {
            where: {
                orderId: orderId,
                kotId: null
            },
            transaction
        });

        order.status = OrderStatus.Ongoing;
        await order.save({
            transaction
        });
        transaction.commit();
        res.json({
            result: kot,
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

OrdersRouter.post("/:orderId/cancel", async (req: IRequest, res: IResponse) => {
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
                    where: {
                        kotId: { [Op.not]: null }
                    },
                    required: true
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

        await OrderItem.update({ status: OrderItemStatus.Cancelled }, { where: { orderId: order.id }, transaction });
        await Order.update({ status: OrderStatus.Cancelled }, { where: { id: order.id }, transaction });

        transaction.commit();
        res.json({
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
                    ], where: {
                        status: { [Op.not]: OrderItemStatus.Cancelled }
                    }
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
            subTotal: 0,
            discount: 0,
            amount: 0,
            tax: 0
        }, {
            transaction
        });
        await Promise.all((order.items ?? []).map(async (item) => {
            item.status = OrderItemStatus.Delivered;
            await item.save();

            const price = item?.product?.price ?? 0;
            const tax = item?.product?.tax ?? 0;
            const basePrice = price / (1 + (tax / 100));
            const amount = price * item.quantity;
            const invoiceItem = new InvoiceItem({
                invoiceId: invoice.id,
                quantity: item.quantity,
                name: item.product?.name ?? "",
                price: price,
                amount: amount,
                tax: (basePrice * (tax / 100)) * item.quantity
            });

            invoice.subTotal += invoiceItem.amount - invoiceItem.tax;
            invoice.tax += invoiceItem.tax;
            await invoiceItem.save({ transaction: transaction });
            return invoiceItem;
        }));
        invoice.discount = order.discount;
        invoice.amount = (invoice.subTotal + invoice.tax) - invoice.discount;

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


OrdersRouter.get("/:orderId/kots/:kotId/print", async (req: IRequest, res: IResponse) => {
    const orderId = req.params.orderId;
    const kotId = req.params.kotId;

    const kot = await Kot.findOne({
        where: {
            orderId: orderId,
            id: kotId
        },
        include: [
            {
                model: Order,
                as: "order"
            },
            {
                model: OrderItem,
                as: "items",
                include: [{
                    model: Product,
                    as: "product"
                }],
                where: {
                    status: { [Op.not]: OrderItemStatus.Cancelled }
                }
            },
            {
                model: Restaurant,
                as: "restaurant"
            }
        ]
    })

    if (!kot) {
        res.status(404).json({
            message: "kot not found"
        })
        return;
    }

    res.render("kot.ejs", { kot: kot.toJSON() })
});


export default OrdersRouter;