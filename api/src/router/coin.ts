import Router from "@koa/router";
import { getCoinAssets } from "../service/coin";

const router = new Router();

// get coinapi assets
router.get("/assets", async (ctx, next) => {
  const data = await getCoinAssets();
  ctx.body = {
    ok: !data?.error,
    data: Array.isArray(data) ? data : [],
    msg: data?.error ?? "success",
  };
});

export default router;
