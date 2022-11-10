import React from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { useComponentSize } from "react-use-size";
import CurrencyCard from "../CurrencyCard";
import useCoinAssets from "../../hooks/useCoinAssets";
import "./styles.css";

const App: React.FC<{}> = () => {
  // 1. fetch data
  // 2. render array data
  const { data: response, error } = useCoinAssets();
  const { ref, height, width } = useComponentSize();
  const total = response?.data?.length ?? 0;
  //calc row and column
  const columnCount = Math.min(Math.floor(width / 320), 3) + 1;
  const rowCount = Math.round(total / columnCount);
  return (
    <div className="app">
      <h1>Cryptocurrency Realtime Price</h1>
      <div ref={ref}>
        {error && <span>failed to load</span>}
        {!response && <span>loading...</span>}
        {!!response?.data && (
          <Grid
            className="app-grid"
            columnCount={Math.min(columnCount, total)}
            height={height}
            width={width}
            rowCount={rowCount}
            rowHeight={180}
            columnWidth={Math.min(width / columnCount, 280)}
          >
            {({ columnIndex, rowIndex, style }) => {
              const item = response?.data[rowIndex * columnCount + columnIndex];
              return (
                <div style={style}>
                  <CurrencyCard key={item.assetId} {...item} />
                </div>
              );
            }}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default App;
