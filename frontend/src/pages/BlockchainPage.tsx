import React from "react";
import { Link } from "react-router-dom";
import { BlockchainVisualizer } from "../components/BlockchainVisualizer";

const BlockchainPage: React.FC = () => {
  return (
    <div className="w-full max-w-3xl p-4 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 text-white">Blockchain Visualizer</h1>
      <BlockchainVisualizer />

      <div className="flex justify-center space-x-4 mt-6">
        <Link
          to="/"
          className="block w-[200px] py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BlockchainPage;
