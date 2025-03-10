
import { Restaurant, User } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { WhereOptions, InferAttributes, Op } from "sequelize";
import bcrypt from "bcrypt";
import { UserDesignation } from "@app/db/models/user/user";
const UsersRouter = Router();


UsersRouter.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: { [key: string]: any } = req.body.filter;
    const order = req.body.order;


    //build filter
    const where: WhereOptions<InferAttributes<User, {}>> = {
        id: { [Op.ne]: req.auth?.userId },
        restaurantId: req.auth?.restaurantId
    };
    if (filter.name) {
        where.name = { [Op.like]: "%" + filter.name + "%" }
    }
    const paginated = await User.findAndCountAll({
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
            records: paginated.rows.map(e => ({ ...e.toJSON(), password: undefined }))
        },
        message: "Successful"
    })
})

UsersRouter.post("/", async (req: IRequest, res: IResponse) => {
    const body = req.body;
    const email = req.body.email;
    if (await User.findOne({ where: { email } })) {
        res.status(400).json({
            message: "User already exist with same email"
        });
        return;
    }
    body.restaurantId = req.auth?.restaurantId;
    const user = await User.create({
        ...body,
        password: bcrypt.hashSync(req.body.password, 12)
    });
    res.json({
        result: user,
        message: "Successful"
    })
})

UsersRouter.put("/:userId", async (req: IRequest, res: IResponse) => {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);
    if (!user) {
        res.status(404).json({
            message: "Product not found"
        })
        return;
    }

    if (await User.findOne({ where: { email: req.body.email, id: { [Op.ne]: userId } } })) {
        res.status(400).json({
            message: "User already exist with same email"
        });
        return;
    }

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 12);
    } else {
        delete req.body.password;
    }

    await user.update({ ...req.body });
    res.json({
        result: user,
        message: "Successful"
    })
});

UsersRouter.delete("/:userId", async (req: IRequest, res: IResponse) => {
    const userId = req.params.userId;
    const user = await User.destroy({
        where: {
            id: userId,
            designation: { [Op.ne]: UserDesignation.Owner }
        }
    });
    if (!user) {
        res.status(404).json({
            message: "User not found..."
        });
        return;
    }
    res.json({
        message: "Successful"
    })
});
export default UsersRouter;