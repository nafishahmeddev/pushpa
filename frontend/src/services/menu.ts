import { ApiRequest } from "@app/lib/axios"
export default class MenuApi {
    static menu = () => ApiRequest.get("/menu").then(res => res.data.result).catch(error=>({error}));
}
