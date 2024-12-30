
import { ProductCategory, Product, User, Restaurant } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import bcrypt from "bcrypt";
import AuthMiddleware from "@app/middleware/auth";
import TokenHelper from "@app/helpers/token";

const AuthRouter = Router();

AuthRouter.post("/login", async (req: IRequest, res: IResponse) => {
    const email = req.body.email;
    const pass = req.body.pass;


    const user = await User.findOne({
        where: { email }, include: [{
            model: Restaurant,
            as: "restaurant"
        }]
    });
    if (!user) {
        res.status(401).json({
            message: "Invalid email id"
        });
        return;
    }

    const isValidPass = bcrypt.compareSync(pass, user.password);
    if (!isValidPass) {
        res.status(401).json({
            message: "Invalid password"
        });
        return;
    }

    const tokens = TokenHelper.generateTokens(user);

    user.loggedAt = new Date();

    await user.save();


    res.json({
        message: "Successful",
        result: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: { ...user.toJSON(), password: undefined }
        }
    })
})

AuthRouter.post("/tokens", async (req: IRequest, res: IResponse) => {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;


    const validated = TokenHelper.validateRefreshToken(refreshToken);
    if (!validated || validated.accessToken != accessToken) {
        res.status(401).json({
            code: 410,
            message: "Invalid email id"
        });
        return;
    }

    const user = await User.findByPk(validated.userId, {
        include: [{
            model: Restaurant,
            as: "restaurant"
        }]
    });
    if (!user) {
        res.status(401).json({
            message: "user has been deleted."
        });
        return;
    }
    const tokens = TokenHelper.generateTokens(user);
    res.json({
        message: "Successful",
        result: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: { ...user.toJSON(), password: undefined }
        }
    })
})

AuthRouter.get("/verify", AuthMiddleware, async (req: IRequest, res: IResponse) => {
    const user = await User.findByPk(req.auth?.userId, {
        include: [{
            model: Restaurant,
            as: "restaurant"
        }]
    });

    if (!user) {
        res.status(401).json({
            message: "user has been deleted."
        });
        return;
    }

    res.json({
        message: "Successful",
        result: {
            user: { ...user.toJSON(), password: undefined }
        }
    })
})

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

AuthRouter.get("/mig", async (req: IRequest, res: IResponse) => {
    const categories = await ProductCategory.findAll();
    for (const cat of categories) {
        cat.name = toTitleCase(cat.name);
        await cat.save();
    }

    const products = await Product.findAll();
    for (const prod of products) {
        prod.name = toTitleCase(prod.name);
        await prod.save();
    }


});
export default AuthRouter;