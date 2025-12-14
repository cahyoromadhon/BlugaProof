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
      providers: { google: { clientId: GOOGLE_CLIENT_ID! } },
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
        {/* Lock viewport: no page scroll */}
        <div className="h-screen overflow-hidden bg-linear-to-b from-white to-slate-50 text-slate-900">
          {/* Top bar fixed height */}
          <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white shadow-sm grid place-items-center">
                  <span className="text-sm font-semibold text-slate-900">B</span>
                </div>
                <div className="leading-tight">
                  <div className="text-base font-semibold tracking-tight">
                    Bluga Proof
                  </div>
                </div>
              </div>

              <ConnectButton className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 active:bg-slate-100 cursor-pointer disabled:cursor-not-allowed" />
            </div>
          </header>

          {/* Main takes remaining height */}
          <main className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-6 py-5">
            {/* Compact header + tabs (fixed height) */}
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight">
                  Dashboard
                </h1>
                <p className="text-xs text-slate-600">
                  Notarize and Verify with Bluga Proof.
                </p>
              </div>

              <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab("notarize")}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed",
                    activeTab === "notarize"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                  ].join(" ")}
                >
                  Notarize
                </button>
                <button
                  onClick={() => setActiveTab("verify")}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed",
                    activeTab === "verify"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                  ].join(" ")}
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Card grows to fill; internal content should also be no-scroll */}
            <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-3">
                <div className="text-sm font-medium text-slate-900">
                  {activeTab === "notarize" ? "Notarization Tool" : "Verify Tool"}
                </div>
                <div className="text-xs text-slate-500">
                  {activeTab === "notarize"
                    ? "Upload → Hash → Store → Proof"
                    : "Paste hash → fetch proof → open explorer"}
                </div>
              </div>

              {/* This area must not overflow */}
              <div className="min-h-0 flex-1 p-5">
                {activeTab === "notarize" && <NotarizationTab />}
                {activeTab === "verify" && <VerifyTab />}
              </div>
            </div>

            {/* Footer (small) */}
            <div className="pt-3 text-[11px] text-slate-500">
              Developed by <span className="underline underline-offset-2 font-medium"><a href="x.com/cahyorom">Cahyo</a></span>
            </div>
          </main>
        </div>
      </WalletProvider>
    </SuiClientProvider>
  );
}

export default App;
