
import { User } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { WhereOptions, InferAttributes, Op } from "sequelize";
import bcrypt from "bcrypt";
const UsersRouter = Router();

UsersRouter.get("/", async (req: IRequest, res: IResponse) => {
    const user  = await User.findOne({where:{email: "nafish.ahmed.dev@gmail.com"}});
    if(!user){
        await User.create({
            name:"Nafish Ahmed",
            email:"nafish.ahmed.dev@gmail.com",
            password : bcrypt.hashSync("12345678", 12)
        })
    }
    res.json({
        message: "Successful"
    })
})

UsersRouter.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: {} = req.body.filter;

    //build filter
    const where: WhereOptions<InferAttributes<User, {}>> = { };
    const paginated = await User.findAndCountAll({
        order: [["createdAt", "asc"]],
        limit: limit,
        offset: (page - 1) * limit,
        where: where
    });

    const pages = Math.ceil(paginated.count / limit);
    res.json({
        result: {
            page: page,
            pages: pages,
            records: paginated.rows
        },
        message: "Successful"
    })
})

UsersRouter.post("/", async (req: IRequest, res: IResponse) => {
    const body = req.body;
    const category = await User.create({
        ...body
    });
    res.json({
        result: category,
        message: "Successful"
    })
})

UsersRouter.put("/:userId", async (req: IRequest, res: IResponse) => {
    const userId = req.params.userId;

    const product = await User.findByPk(userId);
    if (!product) {
        res.status(404).json({
            message: "Product not found"
        })
        return;
    }

    await product.update({ ...req.body });
    res.json({
        result: product,
        message: "Successful"
    })
});

UsersRouter.delete("/:userId", async (req: IRequest, res: IResponse) => {
    const userId = req.params.userId;
    const category = await User.destroy({
        where: {
            id: userId
        }
    });
    if (!category) {
        res.status(404).json({
            message: "Category not found..."
        });
        return;
    }
    res.json({
        message: "Successful"
    })
});
export default UsersRouter;