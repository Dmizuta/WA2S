import { useState } from "react";
import { products } from "../data/products";
import "../index.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MonteSeu() {
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [color, setColor] = useState(null);

  const handleBack = (level) => {
    if (level === "category") setCategory(null);
    if (level === "subcategory") setSubcategory(null);
    if (level === "color") setColor(null);
  };

  const reset = () => {
    setCategory(null);
    setSubcategory(null);
    setColor(null);
  };

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
                  onClick={() => setCategory(key)}
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
            <button className="back" onClick={() => handleBack("category")}>
              ← Voltar
            </button>
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
          </div>
        )}

        {/* STEP 3: Color selection with centered model */}
        {subcategory && !color && (
          <div className="funnel-step fade-in">
            <button className="back" onClick={() => handleBack("subcategory")}>
              ← Voltar
            </button>
            <h2>Escolha uma cor</h2>

            <div className="color-selection">
              {/* Centered model */}
              <div className="model-preview">
                <img
                  src={
                    products[category].subcategories.find(
                      (s) => s.id === subcategory
                    ).img
                  }
                  alt={subcategory}
                />
              </div>

              {/* Color circles below */}
              <div className="color-options">
                {products[category]
                  .subcategories.find((s) => s.id === subcategory)
                  .colors.map((c) => (
                    <div
                      key={c}
                      className="color-circle"
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    ></div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Final Preview */}
        {color && (
          <div className="funnel-step fade-in">
            <button className="back" onClick={() => handleBack("color")}>
              ← Voltar
            </button>
            <h2>Visualização final</h2>
            <div className="preview">
              <img
                src={`/images/colors/${category}/${subcategory}-${color}.png`}
                alt={`${subcategory} ${color}`}
                onError={(e) => {
                  e.target.src = products[category].subcategories.find(
                    (s) => s.id === subcategory
                  ).img;
                }}
              />
              <p>
                {products[category].name} –{" "}
                {
                  products[category].subcategories.find(
                    (s) => s.id === subcategory
                  ).name
                }{" "}
                ({color})
              </p>
            </div>
            <button className="restart" onClick={reset}>
              🔁 Recomeçar
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
