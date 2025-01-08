import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

export type MainNavState = {
    open: boolean,
}

const store = new Store<MainNavState>({
    open: false
});
export default class MainNavStore {
    static getState<T>() { return store.state as T };
    static open = () => store.setState(() => ({ open: true }));
    static close = () => store.setState(() => ({ open: false }));
}

export function useMainNavStore() {
    const menu = useStore(store, (state) => state as MainNavState);
    return [menu, store.setState] as [MainNavState, typeof store.setState]
}