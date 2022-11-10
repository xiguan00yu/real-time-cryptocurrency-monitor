import "dotenv/config";
import Koa from "koa";
import serve from "koa-static";
import * as AppConfig from "./src/config/app";
import HomeRouter from "./src/router/home";

const app = new Koa();

app.use(serve(__dirname + '/public/'));
app.use(HomeRouter.routes());
app.use(HomeRouter.allowedMethods());

app.listen(AppConfig.PORT, () => {
  console.log("listen port:", AppConfig.PORT);
});
