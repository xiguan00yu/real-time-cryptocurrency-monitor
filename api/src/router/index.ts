import Router from "@koa/router";
import HomeRouter from "./home";
import CoinRouter from "./coin";

const router = new Router();

router.use("/", HomeRouter.routes());
router.use("/coin", CoinRouter.routes());

export default router;
