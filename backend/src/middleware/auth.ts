import TokenHelper from "@app/helpers/token";
import { INext, IRequest, IResponse, Language } from "@app/interfaces/vendors/express"

export default function AuthMiddleware(req: IRequest, res: IResponse, next: INext) {
    const token: string = req.headers["authorization"] || req.query.authorization as string || "";
    const validated = TokenHelper.validateAccessToken(token);
    if (validated) {
        req.auth = {
            userId: validated.userId,
            permissions: validated.permissions,
            restaurantId: validated.restaurantId
        }
        next();
    } else {
        res.status(401).json({
            code: 401,
            message: "Invalid token or token expired..."
        });
    }
}