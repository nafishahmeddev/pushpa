
import { Product, ProductCategory } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";

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