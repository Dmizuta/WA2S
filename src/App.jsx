import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import MonteSeuPage from "./pages/MonteSeuPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monte-o-seu" element={<MonteSeuPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
