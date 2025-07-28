import { ec as EC } from "elliptic";
import SHA256 from "crypto-js/sha256";

// secp256k1 曲線（ビットコインやイーサリアムでも使用される）
const ec = new EC("secp256k1");

export function generateKeyPair() {
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate("hex"); // 16進数形式
  const publicKey = key.getPublic("hex");   // 16進数形式
  return { privateKey, publicKey };
}

export function signMessage(privateKey: string, message: string) {
  const key = ec.keyFromPrivate(privateKey, "hex");
  const msgHash = SHA256(message).toString(); // 16進文字列（hex）
  const signature = key.sign(msgHash);
  return signature.toDER("hex");
}

export function verifySignature(publicKey: string, message: string, signature: string) {
  const key = ec.keyFromPublic(publicKey, "hex");
  return key.verify(message, signature);
}
