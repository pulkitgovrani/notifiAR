import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ArweaveWalletKit } from "arweave-wallet-kit";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ArweaveWalletKit>
      <App />
    </ArweaveWalletKit>
  </React.StrictMode>
);
