import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VoteForm } from "./components/VoteForm";
import ResultsPage from "./pages/ResultsPage";
import BlockchainPage from "./pages/BlockchainPage";

const App = () => {
  return (
    <Router>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<VoteForm />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
