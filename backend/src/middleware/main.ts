import { INext, IRequest, IResponse } from "@app/interfaces/vendors/express"
export default function MainMiddleware(req: IRequest, res: IResponse, next: INext) {
    res.success = (body, status = 200) => res.status(status).json(body);
    res.error = (body, status = 500) => res.status(status).json(body);
    return next()
}