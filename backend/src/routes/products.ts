
import { Product, ProductCategory } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import UploadMiddleware from "@app/middleware/multer";
import { Router } from "express";
import { InferAttributes, Op, WhereOptions } from "sequelize";
import fs from "fs";
import { uploadPath } from "@app/helpers/dirs";
import { sequelize } from "@app/db/conn";

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
                order: [["name", "asc"]],
                where: {
                    restaurantId: req.auth?.restaurantId
                }
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

ProductsRouter.post("/", UploadMiddleware().single("image"), async (req: IRequest, res: IResponse) => {
    const transaction = await sequelize.transaction();
    try {
        const body = req.body;
        if (req.file) {
            fs.renameSync(req.file.path, uploadPath(req.file.filename));
            body.image = uploadPath(req.file.filename);
        }
        const product = await Product.create({
            ...body
        }, { transaction });
        await transaction.commit();
        res.json({
            result: product,
            message: "Successful"
        })
    } catch (e) {
        await transaction.rollback();
        res.status(500).json({
            message: "Error while saving product"
        })
    }
})

ProductsRouter.put("/:productId", UploadMiddleware().single("image"), async (req: IRequest, res: IResponse) => {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);
    if (!product) {
        res.status(404).json({
            message: "Product not found"
        })
        return;
    }
    const transaction = await sequelize.transaction();
    try {
        const body = Object.entries(req.body).reduce((result, [key, value]) => {
            result[key] = value === "" ? null : value;
            return result;
        }, {} as Record<string, unknown>);
        if (req.file) {
            fs.renameSync(req.file.path, uploadPath(req.file.filename));
            body.image = req.file.filename;
        }
        const oldImage = product.image;
        await product.update({ ...body }, { transaction: transaction });
        await transaction.commit();

        await product.reload();

        try {
            fs.rmSync(uploadPath(oldImage))
        } catch {

        }
        res.json({
            result: product,
            message: "Successful"
        })
    } catch (e) {
        await transaction.rollback();
        res.status(500).json({
            message: "Error while saving product"
        })
    }
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