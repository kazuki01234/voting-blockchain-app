import { useEffect, useState } from "react";
import { useKeys } from "../hooks/useKeys";
import { signMessage } from "../crypto";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { generateProof, hashPublicKey } from "../crypto/zkp";

import pythonIcon from "../assets/icons/python.svg";
import javascriptIcon from "../assets/icons/javascript.svg";
import javaIcon from "../assets/icons/java.svg";
import rubyIcon from "../assets/icons/ruby.svg";
import goIcon from "../assets/icons/go.svg";
import rustIcon from "../assets/icons/rust.svg";
import cppIcon from "../assets/icons/cpp.svg";
import csharpIcon from "../assets/icons/csharp.svg";
import phpIcon from "../assets/icons/php.svg";
import swiftIcon from "../assets/icons/swift.svg";
import kotlinIcon from "../assets/icons/kotlin.svg";
import typescriptIcon from "../assets/icons/typescript.svg";

const languages = [
  { name: "Python", icon: pythonIcon },
  { name: "JavaScript", icon: javascriptIcon },
  { name: "Java", icon: javaIcon },
  { name: "Ruby", icon: rubyIcon },
  { name: "Go", icon: goIcon },
  { name: "Rust", icon: rustIcon },
  { name: "C++", icon: cppIcon },
  { name: "C#", icon: csharpIcon },
  { name: "PHP", icon: phpIcon },
  { name: "Swift", icon: swiftIcon },
  { name: "Kotlin", icon: kotlinIcon },
  { name: "TypeScript", icon: typescriptIcon },
];

export const VoteForm = () => {
  const { getKeys, saveKeys } = useKeys();
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const { privateKey, publicKey } = getKeys();
    if (!privateKey || !publicKey) {
      saveKeys();
    }

    if (publicKey) {
      const voted = localStorage.getItem(`voted_${publicKey}`);
      if (voted) setHasVoted(true);
    }
  }, [getKeys, saveKeys]);

  const handleVote = async () => {
    const { privateKey, publicKey } = getKeys();

    if (!privateKey || !publicKey || !selected) {
      setStatus("⚠️ Key pair missing or no vote selected.");
      return;
    }

    try {
      // voter_hash（匿名識別子）
      const voterHash = hashPublicKey(publicKey);
      // ZKP proof（最低限スタブ）
      const proof = generateProof(selected, voterHash);
      // 署名（proof + voter_hash）
      const message = `${proof}|${voterHash}`;
      // 投票送信（vote は送らない）
      const signature = signMessage(privateKey, message);

      await axios.post(`${BACKEND_URL}/vote`, {
        voter_public_key: publicKey,
        proof,
        signature,
      });

      setStatus("✅ Vote submitted (ZKP verified)");
      localStorage.setItem(`voted_${publicKey}`, "true");
      setHasVoted(true);

      setTimeout(() => navigate("/blockchain"), 1000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setStatus(`❌ ${err.response?.data?.detail || err.message}`);
      } else {
        setStatus("❌ Vote failed.");
      }
    }
  };

  const handleViewBlockchain = () => {
    navigate("/blockchain");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Vote (ZKP Protected)
      </h1>

      <div className="space-y-4 mb-8">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-9 gap-0">
            {Array.from({ length: 9 }).map((_, col) => {
              const isIconSlot = col % 2 === 1;
              const langIndex = row * 4 + Math.floor(col / 2);
              const lang = languages[langIndex];

              if (isIconSlot && lang) {
                return (
                  <div
                    key={lang.name}
                    className="flex flex-col items-center justify-center text-white"
                  >
                    <button
                      onClick={() =>
                        setSelected((prev) =>
                          prev === lang.name ? null : lang.name
                        )
                      }
                      disabled={hasVoted}
                      className={`transition-all rounded-full p-1 ${
                        selected === lang.name
                          ? "bg-blue-500 ring-2 ring-blue-300 scale-105"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow">
                        <img
                          src={lang.icon}
                          alt={lang.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </button>
                    <span className="mt-1 text-base font-medium text-center">
                      {lang.name}
                    </span>
                  </div>
                );
              }
              return <div key={`${row}-${col}`} />;
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleVote}
          disabled={!selected || hasVoted}
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          {hasVoted ? "✅ Already Voted" : "Submit Vote"}
        </button>
        <button
          onClick={handleViewBlockchain}
          className="bg-gray-700 text-white px-6 py-2 rounded"
        >
          View Blockchain
        </button>
      </div>

      {status && <p className="mt-4 text-gray-200">{status}</p>}
    </div>
  );
};
