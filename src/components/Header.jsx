import { Link, useLocation, useNavigate } from "react-router-dom";
import "./HeaderFooter.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleContactClick = (e) => {
    e.preventDefault();

    const section = document.getElementById("contact");

    if (location.pathname === "/" && section) {
      // use the same custom easing scroll when already on home
      const startY = window.scrollY;
      const targetY = section.getBoundingClientRect().top + window.scrollY;
      const distance = targetY - startY;
      const duration = 1000;
      let startTime = null;

      function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, startY + distance * easeOutCubic);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      requestAnimationFrame(animation);
    } else {
      // navigate to home and then let Home.jsx do the scroll
      navigate("/", { state: { scrollToContact: true } });
    }
  };

  return (
    <header className="site-header">
      <div className="logo">2A Sports</div>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/monte-seu">Monte o seu</Link>
        <a href="#contact" onClick={handleContactClick}>
          Contact
        </a>
      </nav>
    </header>
  );
}
