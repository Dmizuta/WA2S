import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MonteSeu from "./pages/MonteSeu";
import MonteFabric from "./pages/MonteFabric";
import Canvas from "./pages/Canvas"; // ✅ new import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monte-seu" element={<MonteSeu />} />
        <Route path="/monte-fabric" element={<MonteFabric />} />
        <Route path="/canvas" element={<Canvas />} /> {/* ✅ new */}
      </Routes>
    </Router>
  );
}

export default App;
