import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";

const rootEle = document.getElementById("root");

const App = () => <div className="App">Home Page</div>;

ReactDOM.createRoot(rootEle as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
