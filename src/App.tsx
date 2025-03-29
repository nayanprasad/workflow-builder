import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ConfigPage from "./pages/ConfigPage";
import OutputPage from "./pages/OutputPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<ConfigPage />} />
          <Route path="/output" element={<OutputPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
