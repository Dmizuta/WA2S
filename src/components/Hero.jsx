import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Monte seu uniforme com estilo</h1>
          <p className="hero-subtitle">
            Personalize cada detalhe e receba o orçamento em minutos.
          </p>
          <Link to="/monte-seu" className="hero-button">
            Monte o seu agora
          </Link>
        </div>
      </div>
    </section>
  );
}
