import { store } from '@app/store';
import { AuthActions } from '@app/store/slices/auth';
import axios from 'axios';
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
    if(response.status==401){
        store.dispatch(AuthActions.logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
    return response;
})

export { ApiRequest };