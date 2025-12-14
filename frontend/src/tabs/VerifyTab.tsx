import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import CopyButton from "@/components/CopyButton";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface VerifyResult {
  blobId: string;
  walrus_url: string;
  filename?: string;
  hash: string;
  storedAt?: string;
}

const VerifyTab = () => {
  const account = useCurrentAccount();
  const isConnected = !!account?.address;

  const [hash, setHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleCheck = async () => {
    if (!isConnected) {
      setError("Connect wallet terlebih dahulu.");
      return;
    }

    const sanitized = hash.trim().toLowerCase();
    const sha256Regex = /^[a-f0-9]{64}$/;

    setError(null);
    setResult(null);

    if (!sha256Regex.test(sanitized)) {
      setError("Hash harus berupa string hex 64 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/verify/${sanitized}`);
      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({ error: "Terjadi kesalahan di backend." }));
        throw new Error(data.error || "Gagal memverifikasi hash.");
      }

      const data = (await response.json()) as VerifyResult;
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan tak terduga.");
    } finally {
      setIsLoading(false);
    }
  };

  const walrusUrl = result
    ? `https://walruscan.com/testnet/blob/${result.blobId}`
    : null;

  const Row = ({
    label,
    value,
    isLink,
  }: {
    label: string;
    value: string;
    isLink?: boolean;
  }) => (
    <div className="space-y-1">
      <div className="text-[11px] font-medium text-slate-600">{label}</div>

      <div className="flex items-start gap-2">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 underline decoration-slate-300 underline-offset-2 hover:bg-slate-100 break-all cursor-pointer"
          >
            {value}
          </a>
        ) : (
          <code className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 break-all">
            {value}
          </code>
        )}

        <CopyButton value={value} ariaLabel={`Copy ${label}`} />
      </div>
    </div>
  );

  return (
    <div className="h-full min-h-0">
      <div className="grid h-full min-h-0 gap-4 lg:grid-cols-5">
        {/* Input */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white flex flex-col min-h-0">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-medium text-slate-900">Input</div>
            <div className="text-xs text-slate-500">Paste SHA-256</div>
          </div>

          <div className="p-4 space-y-3">
            <input
              type="text"
              placeholder="64-char hex"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />

            <button
              onClick={handleCheck}
              disabled={isLoading || hash.trim().length === 0 || !isConnected}
              className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? "Searching..." : "Verify"}
            </button>

            {!isConnected && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Connect wallet dulu untuk verifikasi.
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* FILLER */}
          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="text-[11px] font-medium text-slate-600">Session</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <div className="text-slate-500">Network</div>
                <div className="font-medium text-slate-800">testnet</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <div className="text-slate-500">Wallet</div>
                <div className="font-medium text-slate-800">
                  {isConnected ? "Connected" : "Not connected"}
                </div>
              </div>
            </div>

            {isConnected && account?.address && (
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                <div className="text-[11px] text-slate-500">Address</div>
                <div className="mt-1 text-[11px] font-medium text-slate-800 break-all">
                  {account.address}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white flex flex-col min-h-0">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-medium text-slate-900">Result</div>
            <div className="text-xs text-slate-500">Proof details</div>
          </div>

          <div className="p-4 space-y-3">
            {!result ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-xs text-slate-600">
                Masukkan hash untuk memulai verifikasi.
              </div>
            ) : (
              <>
                <Row label="Hash" value={result.hash} />
                <Row label="Blob ID" value={result.blobId} />
                {result.filename && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-medium text-slate-600">
                      Filename
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 break-all">
                      {result.filename}
                    </div>
                  </div>
                )}
                {walrusUrl && <Row label="Walrus Explorer" value={walrusUrl} isLink />}
              </>
            )}
          </div>

          {/* FILLER */}
          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="text-[11px] font-medium text-slate-600">Activity</div>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              {isLoading
                ? "Searching..."
                : result
                ? "Proof found."
                : "No activity yet."}
            </div>
            {result?.blobId && (
              <div className="mt-2 text-[11px] text-slate-500">
                Last blob:{" "}
                <span className="font-medium text-slate-700 break-all">
                  {result.blobId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTab;