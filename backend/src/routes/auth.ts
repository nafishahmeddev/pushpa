
import { ProductCategory, Product, User } from "@app/db/models";
import { IRequest, IResponse } from "@app/interfaces/vendors/express";
import { Router } from "express";
import bcrypt from "bcrypt";

const AuthRouter = Router();

AuthRouter.post("/login", async (req: IRequest, res: IResponse) => {
    const email = req.body.email;
    const pass = req.body.pass;
    

    const user = await User.findOne({where:{email}});
    if(!user){
        res.status(401).json({
            message:"Invalid email id"
        });
        return;
    }

    const isValidPass = bcrypt.compareSync(pass, user.password);
    if(!isValidPass){
        res.status(401).json({
            message:"Invalid password"
        });
        return;
    }
    
    res.json({
        message: "Successful",
        result: {
            token: 8476893476893497643896
        }
    })
})
export default AuthRouter;