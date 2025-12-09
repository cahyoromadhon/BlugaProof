import { useState, useEffect } from "react";
import {
  SuiClientProvider,
  useSuiClientContext,
  WalletProvider,
  ConnectButton,
} from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { networkConfig } from "./main";
import NotarizationTab from "@/tabs/NotarizationTab";
import VerifyTab from "./tabs/VerifyTab";

function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  const ENOKI_API_KEY = import.meta.env.VITE_ENOKI_API_KEY;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!isEnokiNetwork(network)) return;

    const { unregister } = registerEnokiWallets({
      apiKey: ENOKI_API_KEY!,
      providers: {
        google: { clientId: GOOGLE_CLIENT_ID! },
      },
      client: client as any,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}

function App() {
  const [activeTab, setActiveTab] =
    useState<"notarize" | "verify">("notarize");

  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <RegisterEnokiWallets />
      <WalletProvider autoConnect>
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Navbar */}
          <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Beluga<span className="text-cyan-400">.</span>
              </h1>
              <ConnectButton className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20" />
            </div>
          </header>

          {/* Content */}
          <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            {/* Tab Selector */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab("notarize")}
                className={`px-5 py-2 rounded-xl font-medium transition ${
                  activeTab === "notarize"
                    ? "bg-cyan-600 text-white shadow shadow-cyan-600/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Notarisasi
              </button>

              <button
                onClick={() => setActiveTab("verify")}
                className={`px-5 py-2 rounded-xl font-medium transition ${
                  activeTab === "verify"
                    ? "bg-cyan-600 text-white shadow shadow-cyan-600/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Verifikasi
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl min-h-[300px]">
              {activeTab === "notarize" && <NotarizationTab />}

              {activeTab === "verify" && <VerifyTab />}
            </div>
          </main>
        </div>
      </WalletProvider>
    </SuiClientProvider>
  );
}

export default App;
