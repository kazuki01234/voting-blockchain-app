import React from "react";
import { Link } from "react-router-dom";
import ResultsChart from "../components/ResultsChart";

const ResultsPage: React.FC = () => {
  return (
    <div className="w-full max-w-3xl p-4 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 text-white">Voting Results</h1>

      <ResultsChart />

      <div className="flex justify-center space-x-4 mt-6">
        <Link
          to="/"
          className="block w-[200px] py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
        >
          Back to Home
        </Link>

        <Link
          to="/blockchain"
          className="block w-[200px] py-2 bg-green-500 text-white text-center rounded hover:bg-green-600"
        >
          View Blockchain
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
