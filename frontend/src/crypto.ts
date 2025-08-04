import { ec as EC } from "elliptic";
import SHA256 from "crypto-js/sha256";

const ec = new EC("secp256k1");

export function generateKeyPair() {
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate("hex");
  const publicKey = key.getPublic("hex");
  return { privateKey, publicKey };
}

export function signMessage(privateKey: string, message: string) {
  const key = ec.keyFromPrivate(privateKey, "hex");
  const msgHash = SHA256(message).toString();
  const signature = key.sign(msgHash);
  return signature.toDER("hex");
}

export function verifySignature(publicKey: string, message: string, signature: string) {
  const key = ec.keyFromPublic(publicKey, "hex");
  return key.verify(message, signature);
}
