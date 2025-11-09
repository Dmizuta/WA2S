import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const shouldScroll =
      location.state?.scrollToContact || location.hash === "#contact";

    if (shouldScroll) {
      const scrollTo = () => {
        const section = document.getElementById("contact");
        if (section) {
          // smooth with easing
          const startY = window.scrollY;
          const targetY = section.getBoundingClientRect().top + window.scrollY;
          const distance = targetY - startY;
          const duration = 100; // milliseconds
          let startTime = null;

          function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // cubic easing-out for a soft stop
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            window.scrollTo(0, startY + distance * easeOutCubic);

            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            }
          }

          requestAnimationFrame(animation);

          // clear the state/hash after scrolling so it doesn’t repeat
          window.history.replaceState({}, "", "/");
        }
      };

      // short delay ensures DOM is ready before scroll trigger
      setTimeout(scrollTo, 100);
    }
  }, [location]);

  return (
    <>
      <Header />
      <Hero />
      <Contact />
      <Footer />
    </>
  );
}
