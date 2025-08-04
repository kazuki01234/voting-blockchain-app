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
  const navigate = useNavigate();

  // Generate and save keys if they don't exist
  useEffect(() => {
    const { privateKey, publicKey } = getKeys();
    if (!privateKey || !publicKey) {
      saveKeys();
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

      setTimeout(() => {
        navigate("/results");
      }, 1000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus("❌ Vote failed (possibly invalid signature).");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-xl font-bold mb-6">
        🗳️ Vote for Your Favorite Programming Language
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

      <button
        onClick={handleVote}
        disabled={!selected}
        className={`vote-submit-button`}
      >
        Submit Vote
      </button>


      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};
