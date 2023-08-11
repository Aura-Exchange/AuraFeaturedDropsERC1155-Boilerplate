import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, magicLink, metamaskWallet, coinbaseWallet, walletConnect, paperWallet, rainbowWallet } from "@thirdweb-dev/react";
import { getChainBySlug } from "@thirdweb-dev/chains";
import "./styles/globals.css";

const urlParams = new URL(window.location.toString()).searchParams;
const network = urlParams.get("network") || "ethereum";
const activeChain = getChainBySlug(network);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.CLIENTID}
      supportedWallets={[
        magicLink({
          apiKey: "pk_live_5BD2E64C36DC78AA",
        }),
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        // paperWallet({
        //   paperClientId: "PAPER_CLIENT_ID",
        // }),
        rainbowWallet()
      ]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
