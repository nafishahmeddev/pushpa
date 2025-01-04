import { IUser } from "@app/types/user";
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";


export interface AuthStateLoggedIn {
    user: IUser,
    accessToken: string,
    refreshToken: string,
    loggedIn: true,
    loading: boolean
}


export interface AuthStateLoggedOut {
    loggedIn: false,
    loading: boolean
}

export type AuthState = AuthStateLoggedIn | AuthStateLoggedOut;

const store = new Store<AuthState>({
    loggedIn: false,
    loading: true
});
export default class AuthStore {
    static state = store.state;
    static login = (payload: AuthStateLoggedIn) => store.setState((state) => ({ ...state, ...payload }));
    static update = (payload: { [key: string]: unknown }) => store.setState((state) => ({ ...state, ...payload }));
    static logout = () => store.setState(() => ({ loggedIn: false, loading: false }));
}

export function useAuthStore<TType>() {
    const auth = useStore(store, (state) => state as TType);
    return [auth, store.setState] as [TType, typeof store.setState]
}