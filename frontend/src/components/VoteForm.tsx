import { useEffect, useState } from "react";
import { useKeys } from "../hooks/useKeys";
import { signMessage } from "../crypto";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const languages = ["Python", "JavaScript", "Rust", "Go"];

export const VoteForm = () => {
  const { getKeys, saveKeys } = useKeys();
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ 鍵がなければ生成して保存
  useEffect(() => {
    const { privateKey, publicKey } = getKeys();
    if (!privateKey || !publicKey) {
      console.log("🔑 鍵が存在しないので生成します");
      saveKeys();
    } else {
      console.log("✅ 鍵が既に存在しています");
    }
  }, [getKeys, saveKeys]);

  const handleVote = async () => {
    const { privateKey, publicKey } = getKeys();

    console.log("🛠️ ローカルストレージの鍵:", { privateKey, publicKey });
    console.log("🗳️ 選択された言語:", selected);

    if (!privateKey || !publicKey || !selected) {
      setStatus("⚠️ 鍵が存在しないか、言語が選ばれていません");
      return;
    }

    const signature = signMessage(privateKey, selected);
    console.log("✍️ 署名:", signature);

    try {
      const res = await axios.post("http://localhost:5000/vote", {
        vote_data: selected,
        voter_public_key: publicKey,
        signature: signature,
      });
      console.log("✅ サーバー応答:", res.data);
      setStatus("✅ 投票に成功しました！");

      setTimeout(() => {
        navigate("/results");
      }, 1000);

    } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
          setStatus("❌ 投票に失敗しました（不正な署名など）");
        }
      }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-6">🗳️ 人気プログラミング言語投票</h1>

      <div className="flex flex-col gap-4 mb-6">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`py-2 rounded-xl font-medium border ${
              selected === lang
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-gray-100 hover:bg-gray-200 border-transparent"
            }`}
            onClick={() => setSelected(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        disabled={!selected}
        onClick={handleVote}
      >
        投票する
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};
