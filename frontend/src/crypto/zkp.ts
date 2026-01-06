import * as CryptoJS from "crypto-js";

export function generateProof(vote: string, voterHash: string): string {
  return CryptoJS.SHA256(`${vote}|${voterHash}`).toString();
}

export function hashPublicKey(pubKey: string): string {
  return CryptoJS.SHA256(pubKey).toString();
}
