import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const NotarizationTab: React.FC = () => {
  const account = useCurrentAccount();
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

  if (!file) {
    alert("Pilih file terlebih dahulu.");
    return;
  }
  
  try {
    setIsProcessing(true);
    setStatusMessage("Mengirim file ke backend untuk diproses...");

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

    setStatusMessage("Upload berhasil!");
    } catch (err: any) {
      console.error("Error:", err);
      setStatusMessage(`Gagal: ${err.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-white">Notarization</h2>
        <p className="text-slate-400 max-w-md">
          Upload file Anda ke backend. Backend akan menghitung hash,
          mengunggah ke Walrus, dan (opsional) mencatat ke smart contract Sui.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-5">
        <label className="text-slate-300 font-medium">Pilih File</label>

        <div className="relative flex items-center justify-center w-full">
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="
              block w-full text-sm text-slate-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-cyan-500/10 file:text-cyan-400
              hover:file:bg-cyan-500/20
              cursor-pointer
            "
          />
        </div>

        <button
          onClick={handleProcessAndUpload}
          disabled={isProcessing || !file}
          className="
            w-full px-6 py-3 rounded-xl font-semibold text-white 
            bg-cyan-600 hover:bg-cyan-700 transition
            disabled:bg-slate-700 disabled:text-slate-400
            shadow-md shadow-cyan-600/20
          "
        >
          {isProcessing ? "Memproses..." : "Hash + Upload + Notarize"}
        </button>
      </div>

      {/* STATUS */}
      {statusMessage && (
        <div
          className="p-4 text-sm rounded-xl border border-cyan-800 bg-cyan-500/10 text-cyan-300"
        >
          <span className="font-semibold text-cyan-400">Status:</span>{" "}
          {statusMessage}
        </div>
      )}

      {/* RESULT: HASH + BLOB ID */}
      {(fileHash || blobId || walrusUrl) && (
        <div className="p-6 rounded-2xl border border-emerald-800 bg-emerald-500/10 space-y-4 shadow-md">
          <h3 className="text-xl font-semibold text-emerald-300">
            Hasil Notarisasi
          </h3>

          {file && (
            <p className="text-slate-200 text-sm">
              File <span className="font-semibold">{file.name}</span> berhasil
              diproses.
            </p>
          )}

          <div className="space-y-3">
            {fileHash && (
              <div>
                <p className="text-emerald-200 font-medium">SHA-256 Hash</p>
                <code className="block bg-slate-800 p-3 rounded-lg break-all text-slate-200">
                  {fileHash}
                </code>
              </div>
            )}

            {blobId && (
              <div>
                <p className="text-emerald-200 font-medium">Walrus Blob ID</p>
                <code className="block bg-slate-800 p-3 rounded-lg break-all text-slate-200">
                  {blobId}
                </code>
              </div>
            )}

            {walrusUrl && (
              <div>
                <p className="text-emerald-200 font-medium">Walrus URL</p>
                <a
                  href={walrusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-800 p-3 rounded-lg break-all text-cyan-400 underline"
                >
                  {walrusUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotarizationTab;
