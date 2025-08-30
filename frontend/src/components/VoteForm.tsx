import { useEffect, useState } from "react";
import { useKeys } from "../hooks/useKeys";
import { signMessage } from "../crypto";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const navigate = useNavigate();

  // Generate and save keys if they don't exist
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
      setStatus("⚠️ Key pair is missing or no language selected.");
      return;
    }

    const signature = signMessage(privateKey, selected);

    try {
      await axios.post("http://localhost:5000/vote", {
        vote_data: selected,
        voter_public_key: publicKey,
        signature: signature,
      });

      setStatus("✅ Vote submitted successfully!");
      localStorage.setItem(`voted_${publicKey}`, "true");
      setHasVoted(true);

      setTimeout(() => {
        navigate("/results");
      }, 1000);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setStatus(`❌ Vote failed: ${err.response?.data?.detail || err.message}`);
      } else if (err instanceof Error) {
        setStatus(`❌ Vote failed: ${err.message}`);
      } else {
        setStatus("❌ Vote failed (unknown error).");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-xl font-bold mb-6">
        Vote for Your Favorite Programming Language
      </h1>

      <div className="space-y-4 mb-8">
        {[0, 1, 2].map((rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-9 gap-0">
            {Array.from({ length: 9 }).map((_, colIndex) => {
              const isIconSlot = colIndex % 2 === 1;
              const langIndex = rowIndex * 4 + Math.floor(colIndex / 2);
              const lang = languages[langIndex];

              if (isIconSlot && lang) {
                return (
                  <div key={lang.name} className="flex flex-col items-center justify-center">
                    <button
                      onClick={() =>
                        setSelected((prev) => (prev === lang.name ? null : lang.name))
                      }
                      className={`transition-all rounded-full p-1 ${
                        selected === lang.name
                          ? "bg-blue-500 text-white scale-105 ring-2 ring-blue-300"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      disabled={hasVoted}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shadow">
                        <img
                          src={lang.icon}
                          className="w-full h-full object-contain"
                          alt={lang.name}
                        />
                      </div>
                    </button>
                    <span className="mt-1 text-sm font-medium text-center">{lang.name}</span>
                  </div>
                );
              } else {
                return <div key={`spacer-${rowIndex}-${colIndex}`} />;
              }
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={handleVote}
          disabled={!selected || hasVoted}
          className={`block w-[200px] py-2
            ${!selected || hasVoted ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          {hasVoted ? "✅ Already Voted" : "Submit Vote"}
        </button>

        <button
          onClick={() => navigate("/results")}
          disabled={!hasVoted}
          className={`block w-[200px] py-2
            ${hasVoted ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
        >
          View Results
        </button>
      </div>
      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};
