
import { Table } from "@app/db/models";
import { Location } from "@app/db/models/restaurant/location";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";

const TablesRouter = Router();
TablesRouter.get("/", async (req: IRequest, res: IResponse) => {
    const tables = await Table.findAll({
        order: [["name", "asc"]],
        include: [{
            model: Location,
            as: "location",
            where: {
                restaurantId: req.auth?.restaurantId
            },
            required: true
        }]

    });

    res.json({
        result: tables,
        message: "Successful"
    })
})
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

    };
    if (filter.createdAt && filter.createdAt[0] && filter.createdAt[1]) {
        where.createdAt = {
            [Op.between]: filter.createdAt
        }
    }

    if (filter.name) {
        where.name = { [Op.like]: "%" + filter.name + "%" }
    }

    const paginated = await Table.findAndCountAll({
        order: [["name", "asc"]],
        limit: limit,
        offset: (page - 1) * limit,
        where: where,
        include: [{
            model: Location,
            as: "location",
            where: {
                restaurantId: req.auth?.restaurantId
            },
            required: true
        }]

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

TablesRouter.put("/:tableId", async (req: IRequest, res: IResponse) => {
    const tableId = req.params.tableId;

    const product = await Table.findByPk(tableId);
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

TablesRouter.delete("/:tableId", async (req: IRequest, res: IResponse) => {
    const tableId = req.params.tableId;
    const category = await Table.destroy({
        where: {
            id: tableId
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