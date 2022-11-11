import Koa from "koa";
import serve from "koa-static";
import Router from "./router";

const app = new Koa();

app.use(serve(__dirname + "/../public/"));
app.use(Router.routes());
app.use(Router.allowedMethods());

export default app;
