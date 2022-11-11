import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App";
import "./main.css";

const rootEle = document.getElementById("root");

ReactDOM.createRoot(rootEle as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
