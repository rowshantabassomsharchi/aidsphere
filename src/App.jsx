import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AssessmentPage from "./pages/AssessmentPage";
import HistoryPage from "./pages/HistoryPage";
import UserPage from "./pages/UserPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/symptom" element={<AssessmentPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}