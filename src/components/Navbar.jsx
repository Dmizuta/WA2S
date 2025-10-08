import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      padding: '20px',
      backgroundColor: '#111',
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Início</Link>
      <Link to="/monte-seu" style={{ color: 'white', textDecoration: 'none' }}>Monte o Seu</Link>
    </nav>
  );
}
