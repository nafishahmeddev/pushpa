import { ApiRequest } from "@app/lib/axios"
import AuthStore, { AuthStateLoggedIn } from "@app/store/auth";
import { IRestaurant } from "@app/types/restaurant";
import { IUser } from "@app/types/user";
export default class AccountApi {
    static updateRestaurant = (data: { [key: string]: string }) => {

        return ApiRequest.post(`/account/update-restaurant`, data).then(res => {
            const response = res.data.result as {
                restaurant: IRestaurant
            }
            console.log(response);
            AuthStore.update({
                user: {
                    ...AuthStore.getState<AuthStateLoggedIn>().user,
                    ...response,
                }
            })
            return response;
        })
    }

    static updateProfile = (data: Partial<IUser>) => {

        return ApiRequest.post(`/account/update-profile`, data).then(res => {
            const response = res.data.result as Partial<IUser>

            console.log(response);
            AuthStore.update({
                user: {
                    ...AuthStore.getState<AuthStateLoggedIn>().user,
                    ...response,
                }
            })
            return response;
        })
    }


    static updatePassword = (data: { password: string, newPassword: string }) => {
        return ApiRequest.post(`/account/update-password`, data);
    }


}
