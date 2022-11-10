import useSWR from "swr";

type CurrencyItem = {
  assetId: string;
  name: string;
  price: number;
  volume: number;
};

type CurrencyResponse = {
  ok: boolean;
  data: CurrencyItem[];
  error: string;
};

const toSimple = (atom: any): CurrencyItem => {
  return {
    assetId: atom.asset_id,
    name: atom.name,
    volume:
      (atom.volume_1hrs_usd && `${atom.volume_1hrs_usd}(1hrs)`) ??
      (atom.volume_1day_usd && `${atom.volume_1day_usd}(1day)`) ??
      (atom.volume_1mth_usd && `${atom.volume_1mth_usd}(1mth)`),
    price: atom.price_usd ?? "UNKOWN",
  };
};

const useCoinAssets = () => {
  return useSWR<CurrencyResponse>(
    "/coin/assets",
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((res) => ({ ...res, data: res?.data?.map(toSimple) })),
    { refreshInterval: 1000 }
  );
};

export default useCoinAssets;
