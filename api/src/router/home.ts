import Router from "@koa/router";

const router = new Router();

// will render home page
router.get("/", (ctx, next) => {
  ctx.redirect("/index.html");
});

export default router;
