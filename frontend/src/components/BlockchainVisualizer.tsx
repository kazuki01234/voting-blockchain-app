import React, { useEffect, useState } from "react";

interface Transaction {
  voter: string;
  vote: string;
  signature: string;
}

interface Block {
  index: number;
  previous_hash: string;
  timestamp: number;
  votes: Transaction[];
  nonce: number;
  hash: string;
}

export const BlockchainVisualizer: React.FC = () => {
  const [chain, setChain] = useState<Block[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchChain = async () => {
        try {
        const res = await fetch(`${BACKEND_URL}/chain`);
        if (!res.ok) throw new Error("Failed to fetch blockchain");
        const data: Block[] = await res.json();
        setChain(data);
        } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Unknown error");
        }
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
        <div key={block.index} className="border rounded-lg p-4 shadow">
          <h3 className="font-bold mb-2">Block #{block.index}</h3>
          <p><strong>Previous Hash:</strong> {block.previous_hash}</p>
          <p><strong>Hash:</strong> {block.hash}</p>
          <p><strong>Timestamp:</strong> {new Date(block.timestamp * 1000).toLocaleString()}</p>
          <p><strong>Nonce:</strong> {block.nonce}</p>
          <div className="mt-2">
            <strong>Votes:</strong>
            {block.votes.length === 0 ? (
              <p>No votes in this block</p>
            ) : (
              block.votes.map((v, i) => {
                const shortVoter = `${v.voter.slice(0, 10)}...${v.voter.slice(-10)}`;
                return (
                    <div key={i} className="bg-gray-100 p-2 rounded">
                    <p><strong>Voter:</strong> {shortVoter}</p>
                    <p><strong>Vote:</strong> {v.vote}</p>
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
