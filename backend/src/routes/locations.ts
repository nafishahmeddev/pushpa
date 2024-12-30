
import { Location, Table } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";

const LocationsRouter = Router();

LocationsRouter.get("/", async (req: IRequest, res: IResponse) => {
    const locations = await Location.findAll({
        order: [["name", "asc"]],
        where: {
            restaurantId: req.auth?.restaurantId
        },
    });

    res.json({
        result: locations,
        message: "Successful"
    })
})

LocationsRouter.get("/scout", async (req: IRequest, res: IResponse) => {
    const locations = await Location.findAll({
        order: [["name", "asc"]],
        where: {
            restaurantId: req.auth?.restaurantId
        },
        include: [{
            model: Table,
            as: "tables"
        }]
    });

    res.json({
        result: locations,
        message: "Successful"
    })
})
LocationsRouter.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: {
        createdAt?: [from: string, to: string],
        name?: string,
        categoryId?: string
    } = req.body.filter;

    //build filter
    const where: WhereOptions<InferAttributes<Location, {}>> = {
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

    const paginatedOrders = await Location.findAndCountAll({
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


LocationsRouter.post("/", async (req: IRequest, res: IResponse) => {
    const body = req.body;
    const category = await Location.create({
        ...body,
        restaurantId: req.auth?.restaurantId
    });
    res.json({
        result: category,
        message: "Successful"
    })
})

LocationsRouter.put("/:locationId", async (req: IRequest, res: IResponse) => {
    const locationId = req.params.locationId;

    const product = await Location.findByPk(locationId);
    if (!product) {
        res.status(404).json({
            message: "Location not found"
        })
        return;
    }

    await product.update({ ...req.body });
    res.json({
        result: product,
        message: "Successful"
    })
});

LocationsRouter.delete("/:locationId", async (req: IRequest, res: IResponse) => {
    const locationId = req.params.locationId;
    const category = await Location.destroy({
        where: {
            id: locationId
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
export default LocationsRouter;