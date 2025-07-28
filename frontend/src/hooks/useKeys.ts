import { generateKeyPair } from "../crypto";

export function useKeys() {
  const saveKeys = () => {
    const { privateKey, publicKey } = generateKeyPair();
    localStorage.setItem("privateKey", privateKey);
    localStorage.setItem("publicKey", publicKey);
  };

  const getKeys = () => ({
    privateKey: localStorage.getItem("privateKey"),
    publicKey: localStorage.getItem("publicKey"),
  });

  return { saveKeys, getKeys };
}
