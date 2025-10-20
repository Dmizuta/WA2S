import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CanvasEditor from "../components/CanvasEditor";
import ModelSelector from "../components/ModelSelector";
import LayerSelector from "../components/LayerSelector";
import ArtList from "../components/ArtList";
import ColorPalette from "../components/ColorPalette";
import UploadLogo from "../components/UploadLogo";

export default function MonteFabric() {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/monte-seu"); // ← your MonteSeu route
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex flex-1 gap-6 p-6">
        {/* LEFT PANEL */}
        <aside className="w-1/4 flex flex-col gap-4">
          <section className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2 text-center">Modelos</h2>
            <ModelSelector />
          </section>

          <section className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2 text-center">Camadas</h2>
            <LayerSelector />
          </section>

          <section className="bg-white p-4 rounded-xl shadow flex-1 overflow-hidden">
            <h2 className="font-semibold mb-2 text-center">Artes</h2>
            <ArtList />
          </section>
        </aside>

        {/* CENTER */}
        <section className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow relative overflow-hidden">
          <h2 className="absolute top-2 text-gray-400">Selected Product</h2>
          <div className="flex items-center justify-center flex-1 w-full">
            <CanvasEditor />
          </div>

          <button
            onClick={handleReturn}
            className="mt-4 mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retornar
          </button>
        </section>

        {/* RIGHT PANEL */}
        <aside className="w-1/4 flex flex-col gap-4">
          <button className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Orçamento
          </button>

          <section className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2 text-center">Cores</h2>
            <ColorPalette />
          </section>

          <section className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
            <h2 className="font-semibold mb-2 text-center">Envie seu logo</h2>
            <UploadLogo />
          </section>

          <button className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
            WhatsApp
          </button>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
