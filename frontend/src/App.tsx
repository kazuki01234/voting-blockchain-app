import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { VoteForm } from "./components/VoteForm";
import ResultsPage from "./pages/ResultsPage";

const App = () => {
  return (
    <Router>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<VoteForm />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
