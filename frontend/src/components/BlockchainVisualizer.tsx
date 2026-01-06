import React, { useEffect, useState } from "react";

interface VoteEntry {
  voter_hash: string;
  proof: string;
  proof_valid: boolean;
}

interface Block {
  index: number;
  previous_hash: string;
  timestamp: number;
  votes: VoteEntry[];
  nonce: number;
  hash: string;
}

export const BlockchainVisualizer: React.FC = () => {
  const [chain, setChain] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/chain`);
        if (!res.ok) throw new Error("Failed to fetch blockchain");
        const data: Block[] = await res.json();
        setChain(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchChain();
  }, [BACKEND_URL]);

  if (loading) return <p>Loading blockchain...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4 p-4">
      {chain.map((block) => (
        <div
          key={block.index}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg p-4 shadow-lg"
        >
          <h3 className="font-bold mb-2 text-lg">Block #{block.index}</h3>
          <p><strong>Previous Hash:</strong> {block.previous_hash}</p>
          <p><strong>Hash:</strong> {block.hash}</p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(block.timestamp * 1000).toLocaleString()}
          </p>
          <p><strong>Nonce:</strong> {block.nonce}</p>

          <div className="mt-4">
            <strong>Votes:</strong>
            {block.votes.length === 0 ? (
              <p className="text-gray-400 mt-2">No votes in this block</p>
            ) : (
              block.votes.map((v, i) => {
                const shortVoter = `${v.voter_hash.slice(0, 6)}...${v.voter_hash.slice(-6)}`;

                return (
                  <div
                    key={i}
                    className="bg-gray-700 p-3 rounded mt-2 space-y-1"
                  >
                    <p>
                      <strong>Voter:</strong> {shortVoter}
                    </p>
                    <p>
                      <strong>Vote:</strong> ⚫
                    </p>
                    <p>
                      <strong>Proof:</strong>{" "}
                      {v.proof_valid ? "✅ Valid" : "❌ Invalid"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
