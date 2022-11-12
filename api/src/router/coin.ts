import Router from "@koa/router";
import HttpStatus from "http-status";
import Cache from "../middleware/lru-cache";
import { getCoinAssets } from "../service/coin";

const router = new Router();

// get coinapi assets
router.get("/assets", Cache, async (ctx, next) => {
  if (await ctx.cashed()) return;
  const data = await getCoinAssets();
  // error code or success code
  ctx.status = !!data?.error ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK;
  ctx.body = {
    ok: !data?.error,
    data: Array.isArray(data) ? data : [],
    msg: data?.error ?? "success",
  };
});

export default router;
