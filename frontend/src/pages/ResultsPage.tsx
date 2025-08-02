import ResultsChart from "../components/ResultsChart";
import { Link } from 'react-router-dom';

const ResultsPage = () => {
  return (
    <div className="w-full max-w-3xl p-4">
      <h1 className="text-2xl font-bold text-center mb-4">投票結果</h1>
      <ResultsChart />
      <div className="text-center mt-6">
        <Link to="/" className="text-blue-500 underline">
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
