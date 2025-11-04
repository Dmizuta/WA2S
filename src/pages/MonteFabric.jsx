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

    const modelArts =
      fabricData[product.categoryKey]?.arts[selectedModel] || [];
    setArts(modelArts);
    setSelectedArt(""); // reset art when model changes
  }, [selectedModel, product]);

  // 🔙 Return behavior
  const handleReturn = () => {
    localStorage.removeItem("finalProduct");
    navigate("/monte-seu", { replace: true });
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex flex-col flex-1 gap-6 p-4 md:p-6 mt-[80px] items-center">
        {/* ===========================
            1️⃣ MODEL + ART SELECTION
        ============================ */}
        <section className="w-full max-w-5xl flex flex-col md:flex-row justify-center gap-6">
          {/* Model selector */}
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-2 text-center">Modelos</h2>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>

          {/* Art list */}
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-2 text-center">Artes</h2>
            <ArtList
              arts={arts}
              selectedArt={selectedArt}
              setSelectedArt={setSelectedArt}
            />
          </div>
        </section>

        {/* ===========================
            2️⃣ CANVAS PREVIEW
        ============================ */}
        <section className="w-full max-w-3xl flex flex-col items-center bg-white rounded-xl shadow p-4 relative overflow-hidden">
          <h2 className="text-gray-400 text-sm md:text-base mb-2">
            {product
              ? `${product.category} – ${product.model}`
              : "Pré-visualização"}
          </h2>

     <div className="flex flex-col items-center justify-center w-full">
  <div className="flex items-center justify-center w-full">
    <div className="w-full max-w-[380px] md:max-w-[600px]">
      <CanvasEditor
        baseImage={product?.image}
        model={selectedModel}
        art={selectedArt}
      />
    </div>
  </div>

  <div className="mt-10 md:mt-12">
    <button
      onClick={handleReturn}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Retornar
    </button>
  </div>
</div>




        </section>

        {/* ===========================
            3️⃣ LOGO UPLOAD + BUTTONS
        ============================ */}
        <section className="w-full max-w-3xl flex flex-col gap-4">
          <button className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Orçamento
          </button>

          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
            <h2 className="font-semibold mb-2 text-center">Envie seu logo</h2>
            <UploadLogo />
          </div>

          <button className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
            WhatsApp
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
