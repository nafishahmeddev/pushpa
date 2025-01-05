
import { User, Restaurant } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import AuthMiddleware from "@app/middleware/auth";
const AccountRouter = Router();


AccountRouter.post("/update-restaurant", AuthMiddleware, async (req: IRequest, res: IResponse) => {
    const user = await User.findByPk(req.auth?.userId, {
        include: [{
            model: Restaurant,
            as: "restaurant"
        }]
    });

    if (!user || !user.restaurant) {
        res.status(401).json({
            message: "user or restaurant not found"
        });
        return;
    }

    await Restaurant.update({ ...req.body }, {
        where: {
            id: req.auth?.restaurantId
        }
    });

    await user.restaurant.reload();

    res.json({
        message: "Successful",
        result: {
            restaurant: user.restaurant.toJSON()
        }
    })
})

export default AccountRouter;