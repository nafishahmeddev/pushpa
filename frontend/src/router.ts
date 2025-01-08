
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import MainNavStore from "./store/main-nav";
const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
router.subscribe("onBeforeNavigate", ()=>{
    MainNavStore.close();
})
export default router;