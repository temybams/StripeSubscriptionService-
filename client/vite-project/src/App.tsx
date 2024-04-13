import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./layout/Home";
import "./App.css";
import LoginPage from "./layout/Login";
import RegisterPage from "./layout/Register";
import SuccessPage from "./layout/Success";
import CancelPage from "./layout/Cancel";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
