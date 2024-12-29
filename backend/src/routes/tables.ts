
import { Table } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";

const TablesRouter = Router();
TablesRouter.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: {
        createdAt?: [from: string, to: string],
        name?: string,
        categoryId?: string
    } = req.body.filter;

    //build filter
    const where: WhereOptions<InferAttributes<Table, {}>> = {
        restaurantId: req.auth?.restaurantId
    };
    if (filter.createdAt && filter.createdAt[0] && filter.createdAt[1]) {
        where.createdAt = {
            [Op.between]: filter.createdAt
        }
    }

    if (filter.name) {
        where.name = { [Op.like]: "%" + filter.name + "%" }
    }

    const paginatedOrders = await Table.findAndCountAll({
        order: [["name", "asc"]],
        limit: limit,
        offset: (page - 1) * limit,
        where: where,

    });

    const pages = Math.ceil(paginatedOrders.count / limit);
    res.json({
        result: {
            page: page,
            pages: pages,
            records: paginatedOrders.rows
        },
        message: "Successful"
    })
})


TablesRouter.post("/", async (req: IRequest, res: IResponse) => {
    const body = req.body;
    const category = await Table.create({
        ...body,
        restaurantId: req.auth?.restaurantId
    });
    res.json({
        result: category,
        message: "Successful"
    })
})

TablesRouter.put("/:productId", async (req: IRequest, res: IResponse) => {
    const productId = req.params.productId;

    const product = await Table.findByPk(productId);
    if (!product) {
        res.status(404).json({
            message: "Table not found"
        })
        return;
    }

    await product.update({ ...req.body });
    res.json({
        result: product,
        message: "Successful"
    })
});

TablesRouter.delete("/:productId", async (req: IRequest, res: IResponse) => {
    const productId = req.params.productId;
    const category = await Table.destroy({
        where: {
            id: productId
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
export default TablesRouter;