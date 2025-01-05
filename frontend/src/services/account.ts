import { ApiRequest } from "@app/lib/axios"
import AuthStore from "@app/store/auth";
import { IRestaurant } from "@app/types/restaurant";
export default class AccountApi {
    static updateRestaurant = (data: { [key: string]: string }) => {

        return ApiRequest.post(`/account/update-restaurant`, data).then(res => {
            const response = res.data.result as {
                restaurant: IRestaurant
            }

            AuthStore.update({ restaurant: response.restaurant })
            return response;
        })
    }


}
