import { ApiRequest } from "@app/lib/axios"
export default class MenuApi {
    static menu = () => ApiRequest.get("/menu").then(res => res).catch(error=>({error}));
}
