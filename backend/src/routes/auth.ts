
import { ProductCategory, Product, User } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import bcrypt from "bcrypt";
import AuthMiddleware from "@app/middleware/auth";
import TokenHelper from "@app/helpers/token";

const AuthRouter = Router();

AuthRouter.post("/login", async (req: IRequest, res: IResponse) => {
    const email = req.body.email;
    const pass = req.body.pass;


    const user = await User.findOne({ where: { email } });
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

    const user = await User.findByPk(validated.userId);
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
    const user = await User.findByPk(req.auth?.userId);

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
export default AuthRouter;