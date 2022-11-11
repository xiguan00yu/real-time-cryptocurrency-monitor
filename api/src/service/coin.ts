import fetch from "node-fetch";
import * as AppConfig from "../config/app";

export const getCoinAssets = () =>
  fetch("https://rest.coinapi.io/v1/assets", {
    headers: {
      "X-CoinAPI-Key": AppConfig.COINAPIKEY,
    },
    // 2s
    timeout: 1000 * 2,
  })
    .then((res) => res.json())
    .catch((e) => {
      console.warn("fetch coin assets get some error:", e);
      return { error: -1 };
    });
