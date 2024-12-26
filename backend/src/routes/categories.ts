
import { ProductCategory,Restaurant } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";

const CategoriesRouter = Router();

CategoriesRouter.get("/", async (req: IRequest, res: IResponse) => {
    const menu = await ProductCategory.findAll({
        order: [["name", "asc"]]
    });
    res.json({
        result: menu,
        message: "Successful"
    })
})

CategoriesRouter.put("/", async (req: IRequest, res: IResponse) => {
    const name = req.body.name;
    const restaurant = await Restaurant.findOne();
    const category = await ProductCategory.create({
        name,
        restaurantId: restaurant?.id
    });
    res.json({
        result: category,
        message: "Successful"
    })
})

CategoriesRouter.put("/:categoryId", async (req: IRequest, res: IResponse) => {
    const categoryId = req.params.categoryId;
    const name = req.body.name;
    const category = await ProductCategory.findOne({
        where: {
            id: categoryId
        }
    });
    if (!category) {
        res.status(404).json({
            message: "Category not found..."
        });
        return;
    }
    category.name = name;
    await category.save();
    res.json({
        result: category,
        message: "Successful"
    })
});

CategoriesRouter.delete("/:categoryId", async (req: IRequest, res: IResponse) => {
    const categoryId = req.params.categoryId;
    const category = await ProductCategory.destroy({
        where: {
            id: categoryId
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
export default CategoriesRouter;