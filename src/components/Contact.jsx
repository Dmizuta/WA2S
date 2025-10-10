export default function Contact() {
  const phoneNumber = "5511972657867";
  const message = "Olá, quero saber mais sobre seus produtos.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <section id="contato" className="contact">
      <h2>Contato</h2>
      <p>Fale com a gente!</p>
      <div className="contact-buttons">
        <a
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          💬 WhatsApp
        </a>
        <a
          href="https://instagram.com/2a.sports"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-instagram"
        >
          📸 Instagram
        </a>
      </div>
    </section>
  );
}
