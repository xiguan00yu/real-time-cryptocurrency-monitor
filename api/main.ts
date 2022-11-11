import "dotenv/config";
import * as AppConfig from "./src/config/app";
import app from "./src/app";

app.listen(AppConfig.PORT, () => {
  console.log("listen http://localhost:" + AppConfig.PORT);
});
