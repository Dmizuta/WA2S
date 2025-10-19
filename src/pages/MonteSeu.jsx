import { useState } from "react";
import { products } from "../data/products";
import "../index.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function MonteSeu() {
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const navigate = useNavigate();

  // ------------------------
  // NAVIGATION CONTROLS
  // ------------------------
  const handleBack = (level) => {
    if (level === "category") {
      setCategory(null);
    }

    if (level === "subcategory") {
      if (category === "agasalho" || category === "blusa") {
        setSubcategory(null);
        setCategory(null);
      } else {
        setSubcategory(null);
      }
    }
  };

  const reset = () => {
    setCategory(null);
    setSubcategory(null);
  };

  const autoSkipCategory = (key) => {
    const selectedCategory = products[key];
    const subs = selectedCategory.subcategories;

    if (subs.length === 1 && (key === "agasalho" || key === "blusa")) {
      setCategory(key);
      setSubcategory(subs[0].id);
    } else {
      setCategory(key);
    }
  };

  // ------------------------
  // FINAL PRODUCT LOGIC
  // ------------------------
  let finalProduct = null;
  let categoryData = null;
  let subcategoryData = null;

  if (subcategory) {
    categoryData = products[category];
    subcategoryData = categoryData.subcategories.find(
      (s) => s.id === subcategory
    );

    finalProduct = {
      category: categoryData.name,
      model: subcategoryData.name,
      image: subcategoryData.img,
      id: subcategoryData.id,
    };
  }

  const handleOpenInCanvas = () => {
    if (!finalProduct) return;
    localStorage.setItem("finalProduct", JSON.stringify(finalProduct));
    navigate("/monte-fabric", { state: finalProduct });
  };

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <>
      <Header />

      <div className="funnel-container">
        <h1 className="title">Monte o seu uniforme ⚡</h1>

        {/* STEP 1: Category */}
        {!category && (
          <div className="funnel-step fade-in">
            <h2>Escolha uma categoria</h2>
            <div className="grid">
              {Object.keys(products).map((key) => (
                <div
                  key={key}
                  className="card"
                  onClick={() => autoSkipCategory(key)}
                >
                  <img src={products[key].img} alt={products[key].name} />
                  <p>{products[key].name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Subcategory */}
        {category && !subcategory && (
          <div className="funnel-step fade-in">
            <h2>Escolha o modelo</h2>
            <div className="grid">
              {products[category].subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="card"
                  onClick={() => setSubcategory(sub.id)}
                >
                  <img src={sub.img} alt={sub.name} />
                  <p>{sub.name}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="back" onClick={() => handleBack("category")}>
                ← Voltar
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Final Preview */}
        {subcategory && (
          <div className="funnel-step fade-in">
            <h2>Visualização final</h2>

            <div className="preview">
              <img
                src={subcategoryData.img}
                alt={subcategoryData.name}
                onError={(e) => {
                  e.target.src = "/images/fallback.png";
                }}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={handleOpenInCanvas}
              />
              <p>
                {categoryData.name} – {subcategoryData.name}
              </p>

              <div className="flex flex-col items-center gap-4 mt-4">
                <button
                  className="back"
                  onClick={() => handleBack("subcategory")}
                >
                  ← Voltar
                </button>

                <button className="restart" onClick={reset}>
                  🔁 Recomeçar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
