import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface VerifyResult {
  blobId: string;
  walrus_url: string;
  filename?: string;
  hash: string;
  storedAt?: string;
}

const VerifyTab = () => {
  const [hash, setHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleCheck = async () => {
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-white">Verifikasi Bukti</h2>
        <p className="text-slate-400">
          Masukkan hash SHA-256 file Anda. Sistem akan mencari blob ID yang
          terkait lalu menyiapkan tautan Walrus Explorer.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-4">
        <label className="text-slate-300 font-medium" htmlFor="verify-hash">
          Hash SHA-256
        </label>
        <input
          id="verify-hash"
          type="text"
          placeholder="contoh: 5feceb66ffc86f38d952f299a0df0..."
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
        />

        <button
          onClick={handleCheck}
          disabled={isLoading || hash.length === 0}
          className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isLoading ? "Mencari..." : "Cari di Walrus"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-900 bg-red-500/10 text-red-300">
          {error}
        </div>
      )}

      {result && walrusUrl && (
        <div className="p-6 rounded-2xl border border-emerald-800 bg-emerald-500/10 space-y-4 shadow-md">
          <h3 className="text-xl font-semibold text-emerald-300">
            Bukti ditemukan
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-emerald-200 font-medium">Hash</p>
              <code className="block bg-slate-800 p-3 rounded-lg break-all text-slate-200">
                {result.hash}
              </code>
            </div>

            <div>
              <p className="text-emerald-200 font-medium">Walrus Blob ID</p>
              <code className="block bg-slate-800 p-3 rounded-lg break-all text-slate-200">
                {result.blobId}
              </code>
            </div>

            {result.filename && (
              <div>
                <p className="text-emerald-200 font-medium">Nama File</p>
                <p className="text-slate-200 break-all">{result.filename}</p>
              </div>
            )}

            <div>
              <p className="text-emerald-200 font-medium">Walrus Explorer</p>
              <a
                href={walrusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-slate-800 p-3 rounded-lg break-all text-cyan-400 underline"
              >
                {walrusUrl}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyTab;
