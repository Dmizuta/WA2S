import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">A2 Sports</div>

      <nav className="header-nav">
        <Link to="/">Início</Link>
        <Link to="/monte-seu">Monte o Seu</Link>
        <a href="#contato">Contato</a>
      </nav>
    </header>
  );
}
