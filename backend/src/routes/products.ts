
import { Product, ProductCategory } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";

const ProductsRouter = Router();

ProductsRouter.get("/", async (req: IRequest, res: IResponse) => {
    const menu = await Product.findAll({
        order: [["name", "asc"]],
        include: [
            {
                model: ProductCategory,
                as: "category",
                order: [["name", "asc"]]
            }
        ]
    });
    res.json({
        result: menu,
        message: "Successful"
    })
})


ProductsRouter.post("/paginate", async (req: IRequest, res: IResponse) => {
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 20);
    const filter: {
        createdAt?: [from: string, to: string],
        name?: string,
        categoryId?: string
    } = req.body.filter;

    //build filter
    const where: WhereOptions<InferAttributes<Product, {}>> = {};
    if (filter.createdAt && filter.createdAt[0] && filter.createdAt[1]) {
        where.createdAt = {
            [Op.between]: filter.createdAt
        }
    }

    if (filter.name) {
        where.name = { [Op.like]: "%" + filter.name + "%" }
    }

    if (filter.categoryId) {
        where.categoryId = filter.categoryId
    }

    const paginatedOrders = await Product.findAndCountAll({
        order: [["name", "asc"]],
        limit: limit,
        offset: (page - 1) * limit,
        include: [
            {
                model: ProductCategory,
                as: "category",
                order: [["name", "asc"]]
            }
        ],
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


ProductsRouter.post("/", async (req: IRequest, res: IResponse) => {
    const body = req.body;
    const category = await Product.create({
        ...body
    });
    res.json({
        result: category,
        message: "Successful"
    })
})

ProductsRouter.put("/:productId", async (req: IRequest, res: IResponse) => {
    const productId = req.params.productId;

    const product = await Product.findByPk(productId);
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

ProductsRouter.delete("/:productId", async (req: IRequest, res: IResponse) => {
    const productId = req.params.productId;
    const category = await Product.destroy({
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
export default ProductsRouter;