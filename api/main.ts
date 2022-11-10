import "dotenv/config";
import Koa from "koa";
import serve from "koa-static";
import * as AppConfig from "./src/config/app";
import Router from "./src/router";

const app = new Koa();

app.use(serve(__dirname + "/public/"));
app.use(Router.routes());
app.use(Router.allowedMethods());

app.listen(AppConfig.PORT, () => {
  console.log("listen http://localhost:" + AppConfig.PORT);
});
