import axios from 'axios';

export async function requestMintCertificate(data: {
  file_hash: string;
  filename: string;
  filetype: string;
  walrus_url: string;
  userAddress: string;
}) {
  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/sponsor/mint`,
    data
  );
  return res.data; // { digest }
}