
import { User, Restaurant } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import AuthMiddleware from "@app/middleware/auth";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
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

AccountRouter.post("/update-profile", AuthMiddleware, async (req: IRequest, res: IResponse) => {
    const body = req.body;
    delete body.password;
    if (await User.findOne({ where: { email: body.email, id: { [Op.ne]: req.auth?.userId } } })) {
        res.status(400).json({
            message: "User already exist with same email"
        });
        return;
    }

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

    await user.update(body);

    res.json({
        message: "Successful",
        result: user.toJSON()
    })
})

AccountRouter.post("/update-password", AuthMiddleware, async (req: IRequest, res: IResponse) => {
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword != confirmPassword) {
        res.status(401).json({
            message: "password does not match."
        });
        return;
    }
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

    if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).json({
            message: "Invalid password"
        });
        return;
    }

    user.password = bcrypt.hashSync(newPassword, 12);
    await user.save();
    res.json({
        message: "Successful",
    })
})

export default AccountRouter;