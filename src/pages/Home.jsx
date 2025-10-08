import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Crie o uniforme do seu time
          </h1>
          <p className="mt-4 text-gray-600">
            Monte seu modelo, personalize cores, nomes e números. Visualize na hora e envie para nosso WhatsApp.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/monte-o-seu"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 font-medium"
            >
              Começar agora
            </Link>
            <a
              href="https://wa.me/5511972657867"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border px-5 py-3"
            >
              Falar no WhatsApp
            </a>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-700">
            <li className="flex items-center gap-2">✅ Personalização completa</li>
            <li className="flex items-center gap-2">✅ Prévia instantânea</li>
            <li className="flex items-center gap-2">✅ Atendimento humano</li>
            <li className="flex items-center gap-2">✅ Orçamento rápido</li>
          </ul>
        </div>

        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-100 to-white border flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl">🎽</div>
            <p className="mt-2 text-sm">Prévia do uniforme (Fabric.js entra aqui depois)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
