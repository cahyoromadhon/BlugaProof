export interface EnokiSponsorResponse {
  digest: string;
  bytes: string; // transaction bytes base64 (nama field bisa berbeda, kita treat as generic)
  [key: string]: any;
}

export interface EnokiCompleteResponse {
  sponsoredTransaction: string; // base64
  digest: string;
  [key: string]: any;
}

export interface WalrusUploadResult {
  blobId: string;
  walrus_url: string;
}
