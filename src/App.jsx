import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MonteSeu from "./pages/MonteSeu";
import MonteFabric from "./pages/MonteFabric";
import Canvas from "./pages/Canvas"; // ✅ new import

import TintTest from "./pages/TintTest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monte-seu" element={<MonteSeu />} />
        <Route path="/monte-fabric" element={<MonteFabric />} />
        <Route path="/canvas" element={<Canvas />} /> {/* ✅ new */}
        <Route path="/tint-test" element={<TintTest />} />
      </Routes>
    </Router>
  );
}

export default App;


