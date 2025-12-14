import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import CopyButton from "@/components/CopyButton";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const NotarizationTab: React.FC = () => {
  const account = useCurrentAccount();
  const isConnected = !!account?.address;

  const [file, setFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [fileHash, setFileHash] = useState<string | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [walrusUrl, setWalrusUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileHash(null);
    setBlobId(null);
    setWalrusUrl(null);
    setStatusMessage(null);
  };

  const handleProcessAndUpload = async () => {
    if (!isConnected) return alert("Connect wallet terlebih dahulu.");
    if (!file) return alert("Pilih file terlebih dahulu.");

    try {
      setIsProcessing(true);
      setStatusMessage("Processing...");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/notarize`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend error (${res.status}): ${text}`);
      }

      const data = await res.json();
      setFileHash(data.file_hash || null);
      setBlobId(data.blobId || null);
      setWalrusUrl(data.walrus_url || null);
      setStatusMessage("Success.");
    } catch (err: any) {
      setStatusMessage(`Failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

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
        {/* Upload panel */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white flex flex-col min-h-0">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-medium text-slate-900">Upload</div>
          </div>

          <div className="p-4 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              {file ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0 text-[11px] text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ) : (
                <span className="text-slate-500">No file selected</span>
              )}
            </div>

            <input
              type="file"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-xl file:border file:border-slate-200 file:bg-white file:px-3 file:py-2 file:text-xs file:font-medium file:text-slate-900 hover:file:bg-slate-50 cursor-pointer"
            />

            <button
              onClick={handleProcessAndUpload}
              disabled={isProcessing || !file || !isConnected}
              className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Upload"}
            </button>

            {!isConnected && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Connect wallet dulu untuk memakai notarization.
              </div>
            )}
          </div>

          {/* FILLER: supaya tidak ada space kosong */}
          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="text-[11px] font-medium text-slate-600">Session</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <div className="text-slate-500">Network</div>
                <div className="font-medium text-slate-800">Testnet</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <div className="text-slate-500">Wallet</div>
                <div className="font-medium text-slate-800">
                  {isConnected ? "Connected" : "Not connected"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof panel */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white flex flex-col min-h-0">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-medium text-slate-900">Proof Output</div>
          </div>

          <div className="p-4 space-y-3">
            {!fileHash && !blobId && !walrusUrl ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-xs text-slate-600">
                Upload file untuk menghasilkan hash dan blob ID.
              </div>
            ) : (
              <>
                {fileHash && <Row label="SHA-256" value={fileHash} />}
                {blobId && <Row label="Blob ID" value={blobId} />}
                {walrusUrl && <Row label="Walrus URL" value={walrusUrl} isLink />}
              </>
            )}
          </div>

          {/* FILLER: isi ruang bawah */}
          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="text-[11px] font-medium text-slate-600">Activity</div>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              {statusMessage ? statusMessage : "No activity yet."}
            </div>

            {file && (
              <div className="mt-2 text-[11px] text-slate-500">
                Last file:{" "}
                <span className="font-medium text-slate-700">{file.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotarizationTab;