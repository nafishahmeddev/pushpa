import { store } from '@app/store';
import { AuthActions } from '@app/store/slices/auth';
import axios, { AxiosError } from 'axios';
const ApiRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

ApiRequest.interceptors.request.use(config => {
    if (localStorage.getItem("accessToken")) {
        config.headers["Authorization"] = localStorage.getItem("accessToken");
    }
    return config;
})

ApiRequest.interceptors.response.use((response,) => {


    return response;
}, (error: AxiosError) => {
    if (error.status == 401) {
        store.dispatch(AuthActions.logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
    if ((error?.response?.data as { message: string })?.message) {
        error.message = (error?.response?.data as { message: string })?.message
    }
    return Promise.reject(error);
})

export { ApiRequest };