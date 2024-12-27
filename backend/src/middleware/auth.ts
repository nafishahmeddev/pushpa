import TokenHelper from "@app/helpers/token";
import { INext, IRequest, IResponse, Language } from "@app/interfaces/vendors/express"

export default function AuthMiddleware(req: IRequest, res: IResponse, next: INext) {
    const token: string = req.headers["authorization"] || "";
    const validated = TokenHelper.validateAccessToken(token);
    if (validated) {
        req.userId = validated.userId;
        req.permissions = validated.permissions;
        next();
    } else {
        res.status(401).json({
            code: 401,
            message: "Invalid token or token expired..."
        });
    }
}