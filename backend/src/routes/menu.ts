
import { ProductCategory, Product } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";

const MenuRouter = Router();

MenuRouter.get("/", async (req: IRequest, res: IResponse) => {
    const menu = await ProductCategory.findAll({
        where:{
            restaurantId: req.auth?.restaurantId
        },
        include: [
            {
                model: Product,
                as: "products",
            }
        ]
    });
    res.json({
        result: menu,
        message: "Successful"
    })
})
export default MenuRouter;