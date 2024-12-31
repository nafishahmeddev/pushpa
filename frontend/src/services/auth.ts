import { ApiRequest } from "@app/lib/axios"
import { store } from "@app/store";
import { AuthActions } from "@app/store/slices/auth";
import { IUser } from "@app/types/user";
export default class AuthApi {
    static login = (payload: { email: string, pass: string }) => ApiRequest.post("/auth/login", payload).then(res => {
        const response = res.data.result as {
            accessToken: string,
            refreshToken: string,
            user: IUser
        }
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        store.dispatch(AuthActions.login({
            ...response,
            loggedIn: true,
            loading: false
        }));
        return response;
    });
    static tokens = (accessToken: string, refreshToken: string) => ApiRequest.post("/auth/tokens", { refreshToken, accessToken }).then(res => res.data.result as {
        accessToken: string,
        refreshToken: string,
        user: IUser
    });
    static verify = () => {
        if (!localStorage.getItem("accessToken")) {
            store.dispatch(AuthActions.logout());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return;
        }
        return ApiRequest.get(`/auth/verify`).then(res => {
            const response = res.data.result as {
                user: IUser
            }
            store.dispatch(AuthActions.login({
                accessToken: localStorage.getItem("accessToken") as string,
                refreshToken: localStorage.getItem("refreshToken") as string,
                ...response,
                loggedIn: true,
                loading: false
            }));
            return response;
        });
    }

    static logout = async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        store.dispatch(AuthActions.logout());
    };
}
