import { Link } from "react-router-dom";
import "./HeaderFooter.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="logo">2A Sports</div>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/monte-seu">Monte o seu</Link>
      </nav>
    </header>
  );
}
