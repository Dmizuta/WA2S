import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MonteSeu from "./pages/MonteSeu";
import MonteFabric from "./pages/MonteFabric.jsx";
 // 👈 note the capital M and exact filename

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monte-seu" element={<MonteSeu />} />
        <Route path="/monte-fabric" element={<MonteFabric />} /> {/* new */}
      </Routes>
    </Router>
  );
}

export default App;
