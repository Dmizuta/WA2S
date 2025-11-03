import { products } from "../data/products";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import { useNavigate } from "react-router-dom";

export default function MonteSeu() {
  const navigate = useNavigate();

  // 🚀 When user clicks a category → go straight to MonteFabric
  const handleOpenInCanvas = (catKey) => {
    const categoryData = products[catKey];
    if (!categoryData) return;

    const finalProduct = {
      category: categoryData.name,
      categoryKey: catKey,
    };

    localStorage.setItem("finalProduct", JSON.stringify(finalProduct));
    console.log("✅ Saved finalProduct:", finalProduct);
    navigate("/monte-fabric");
  };

  return (
    <>
      <Header />
      <div className="funnel-container">
        <h1 className="title">Monte o seu uniforme ⚡</h1>

        <div className="funnel-step fade-in">
          <h2>Escolha uma categoria</h2>
          <div className="grid">
            {Object.keys(products).map((key) => (
              <div
                key={key}
                className="card"
                onClick={() => handleOpenInCanvas(key)}
              >
                <img
                  src={products[key].img}
                  alt={products[key].name}
                  onError={(e) => (e.target.src = "/images/fallback.png")}
                />
                <p>{products[key].name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
