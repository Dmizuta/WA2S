import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MonteSeu from './pages/MonteSeu';
//import CategorySelector from './components/CategorySelector';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monte-seu" element={<MonteSeu />} />
      </Routes>
    </Router>
  );
}

export default App;
