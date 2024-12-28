
import { sequelize } from "@app/db/conn";
import { Product, Cart, CartItem, Restaurant, Order, OrderItem } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";

const CartsRouter = Router();

CartsRouter.get("/", async (req: IRequest, res: IResponse) => {
    const carts = await Cart.findAll();
    res.json({
        result: carts,
        message: "Successful"
    })
})

CartsRouter.post("/", async (req: IRequest, res: IResponse) => {
    const count = await Cart.count();
    if (count > 9) {
        res.status(400).json({
            message: "Maximum cart number reached..."
        })
        return;
    }
    const cart = new Cart({
        restaurantId: req.auth?.restaurantId,
        name: (count + 1).toString()
    });

    await cart.save();
    res.json({
        result: cart,
        message: "Successful"
    });
});

CartsRouter.get("/:cartId", async (req: IRequest, res: IResponse) => {
    const cart = await Cart.findOne({
        where: {
            id: req.params.cartId
        },
        include: [
            {
                model: CartItem,
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
    if (!cart) {
        res.status(404).json({
            message: "Cart not found"
        })
        return;
    }
    res.json({
        result: cart,
        message: "Successful"
    })
});

CartsRouter.put("/:cartId/items", async (req: IRequest, res: IResponse) => {
    const productId: string = req.body.productId;
    const quantity: number = req.body.quantity;
    const cartId: string = req.params.cartId;

    const [cart, product] = await Promise.all([
        Cart.findByPk(cartId),
        Product.findByPk(productId),
    ]);


    if (!cart || !product) {
        res.status(404).json({
            message: "Invalid data...",
        });
        return;
    }


    let item = await CartItem.findOne({
        where: {
            productId,
            cartId
        },
    })
    if (!item) {
        item = new CartItem({
            productId,
            cartId,
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

CartsRouter.post("/:cartId/items", async (req: IRequest, res: IResponse) => {
    const productId: string = req.body.productId;
    const cartId: string = req.params.cartId;

    const [cart, product] = await Promise.all([
        Cart.findByPk(cartId),
        Product.findByPk(productId),
    ]);


    if (!cart || !product) {
        res.status(404).json({
            message: "Invalid data...",
        });
        return;
    }


    let item = await CartItem.findOne({
        where: {
            productId,
            cartId
        },
    })
    if (!item) {
        item = new CartItem({
            productId,
            cartId,
            quantity: 0
        })
    }

    item.quantity += 1;
    await item.save();

    res.json({
        message: "Successful",
    });
});

CartsRouter.delete("/:cartId/items", async (req: IRequest, res: IResponse) => {
    const cartId: string = req.params.cartId;
    const productId: string = req.body.productId;

    const [cart, product, item] = await Promise.all([
        Cart.findByPk(cartId),
        Product.findByPk(productId),
        CartItem.findOne({
            where: {
                productId,
                cartId
            },
        })
    ]);

    if (!cart || !product || !item) {
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

CartsRouter.get("/:cartId/place", async (req: IRequest, res: IResponse) => {
    const cart = await Cart.findOne({
        where: {
            id: req.params.cartId
        },
        include: [
            {
                model: CartItem,
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
    if (!cart) {
        res.status(404).json({
            message: "Cart not found"
        })
        return;
    }
    let orderId: string = "";
    await sequelize.transaction({}, async (transaction) => {
        const order = new Order({
            restaurantId: cart.restaurantId,
            amount: 0,
            cgst: 0,
            sgst: 0
        });

        await order.save();

        const cartItems = cart.items ?? [];

        await Promise.all(cartItems.map(async (item) => {
            const price = item?.product?.price ?? 0;
            const cgst = item?.product?.sgst ?? 0;
            const sgst = item?.product?.sgst ?? 0;
            const basePrice = price / (1 + ((cgst + sgst) / 100));
            const amount = price * item.quantity;
            const orderItem = new OrderItem({
                orderId: order.id,
                quantity: item.quantity,
                name: item.product?.name ?? "",
                price: price,
                amount: amount,
                cgst: (basePrice * ((item.product?.cgst ?? 0) / 100)) * item.quantity,
                sgst: (basePrice * ((item.product?.sgst ?? 0) / 100)) * item.quantity,
            });

            order.cgst += orderItem.cgst;
            order.sgst += orderItem.sgst;
            order.amount += orderItem.amount;
            await orderItem.save({ transaction: transaction });
            return orderItem;
        }));

        await order.save({ transaction: transaction });

        await CartItem.destroy({ where: { cartId: cart.id }, transaction: transaction });
        await cart.destroy({ transaction: transaction });

        orderId = order.id;
    }).catch(er => {
        console.log(er);
        return undefined;

    })

    if (orderId) {
        const createdOrder = await Order.findOne({
            where: { id: orderId },
            include: [{
                model: OrderItem,
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

export default CartsRouter;