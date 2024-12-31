
import { sequelize } from "@app/db/conn";
import { Product, Order, OrderItem, Invoice, InvoiceItem } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { ICartItem } from "@app/types/cart";
import { Router } from "express";
import { Op, or } from "sequelize";
import { v4 } from "uuid";

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

OrdersRouter.post("/", async (req: IRequest, res: IResponse) => {
    const name: string = req.body.name;
    const items: Array<ICartItem> = req.body.items;

    const transaction = await sequelize.transaction();
    try {
        const order = await Order.create({
            restaurantId: req.auth?.restaurantId,
            name: name
        }, { transaction });

        await Promise.all(items.map(item => OrderItem.create({
            ...item,
            orderId: order.id
        }, {
            transaction
        })))

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
        await Promise.all(items.map(item => OrderItem.upsert({
            ...item,
            orderId: orderId,
            id: (order.items ?? []).find(oi => oi.productId == item.productId)?.id ?? v4(),
        }, { transaction })));

        await OrderItem.destroy({
            where: { orderId: orderId, productId: { [Op.notIn]: items.map(e => e.productId) } },
            transaction
        });

        await Order.update({
            restaurantId: req.auth?.restaurantId,
            name: name
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

OrdersRouter.post("/place", async (req: IRequest, res: IResponse) => {
    const orderId = req.body.id;
    const name = req.body.name;
    const items: Array<ICartItem> = req.body.items;
    const transaction = await sequelize.transaction();

    try {
        let order;
        if (orderId) {
            order = await Order.findOne({
                where: {
                    id: orderId,
                    status: {
                        [Op.in]: ["Draft"]
                    }
                },
                include: [
                    {
                        model: OrderItem,
                        as: "items",
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
        } else {
            order = await Order.create({
                name: name,
                restaurantId: req.auth?.restaurantId
            }, { transaction });
        }


        if (orderId) {
            await OrderItem.destroy({
                where: { orderId: order.id, productId: { [Op.notIn]: items.map(e => e.productId) } },
                transaction
            });

            await Promise.all(items.map(item => OrderItem.upsert({
                ...item,
                orderId: order.id,
                id: (order.items ?? []).find(oi => oi.productId == item.productId)?.id ?? v4(),
            }, { transaction })));
        } else {
            await Promise.all(items.map(item => OrderItem.create({
                ...item,
                orderId: order.id,
            }, { transaction })));
        }



        const invoice = await Invoice.create({
            restaurantId: order.restaurantId,
            amount: 0,
            tax: 0
        }, {
            transaction
        });

        const cartItems = await OrderItem.findAll({
            where: { orderId: order.id }, include: [{
                model: Product,
                as: "product"
            }], transaction
        })

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

        await OrderItem.update({ status: "Delivered" }, { where: { orderId: order.id }, transaction });
        await order.update({ status: "Completed", invoiceId: invoice.id }, { transaction: transaction });


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

export default OrdersRouter;