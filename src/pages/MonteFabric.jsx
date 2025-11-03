// src/pages/MonteFabric.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CanvasEditor from "../components/CanvasEditor";
import UploadLogo from "../components/UploadLogo";
import ModelSelector from "../components/ModelSelector";
import ArtList from "../components/ArtList";
import { fabricData } from "../data/fabricData";

export default function MonteFabric() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [models, setModels] = useState([]);
  const [arts, setArts] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedArt, setSelectedArt] = useState("");

  // 🧠 Load product from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("finalProduct");
    if (!saved) return;
    const parsed = JSON.parse(saved);
    const categoryKey = parsed.categoryKey?.toLowerCase().trim();

    if (fabricData[categoryKey]) {
      setProduct({ ...parsed, categoryKey });
      setModels(fabricData[categoryKey].models);
    }
  }, []);

  // 🎨 Update arts when model changes
  useEffect(() => {
    if (!product?.categoryKey || !selectedModel) {
      setArts([]);
      return;
    }

    const modelArts = fabricData[product.categoryKey]?.arts[selectedModel] || [];
    setArts(modelArts);
    setSelectedArt(""); // reset art when model changes
  }, [selectedModel, product]);

  // 🔙 Fixed return behavior (forces full reset of MonteSeu)
  const handleReturn = () => {
    localStorage.removeItem("finalProduct");
    navigate("/monte-seu", { replace: true });
    window.location.reload(); // ✅ ensures MonteSeu resets correctly
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex flex-1 gap-6 p-6">
        {/* LEFT PANEL */}
        <aside className="w-1/4 flex flex-col gap-4">
          {/* Model Selector */}
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />

          {/* Art List */}
          <ArtList
            arts={arts}
            selectedArt={selectedArt}
            setSelectedArt={setSelectedArt}
          />
        </aside>

        {/* CENTER */}
        <section className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow relative overflow-hidden">
          <h2 className="absolute top-2 text-gray-400">
            {product
              ? `${product.category} – ${product.model}`
              : "Pré-visualização"}
          </h2>

          <div className="flex items-center justify-center flex-1 w-full">
            <CanvasEditor
              baseImage={product?.image}
              model={selectedModel}
              art={selectedArt}
            />
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
