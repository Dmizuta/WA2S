import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";

export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [product, setProduct] = useState(null);

  // ------------------------
  // 1️⃣ LOAD PRODUCT
  // ------------------------
  useEffect(() => {
    const saved = localStorage.getItem("finalProduct");
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("📦 Loaded product from localStorage:", parsed);
      setProduct(parsed);
    } else {
      console.warn("⚠️ No finalProduct found in localStorage");
    }
  }, []);

  // ------------------------
  // 2️⃣ INITIALIZE FABRIC WHEN DOM IS READY
  // ------------------------
  useEffect(() => {
    const initFabric = () => {
      const el = canvasRef.current;
      if (!el) {
        console.log("⌛ canvasRef still null, retrying...");
        requestAnimationFrame(initFabric); // retry next frame
        return;
      }

      console.log("🎯 canvasRef.current ready:", el);
      console.log("🔍 fabric namespace:", fabric);

      const fabricCanvas = new fabric.Canvas(el, {
        width: 600,
        height: 600,
        backgroundColor: "#f7f7f7",
      });

      console.log("🎨 Fabric canvas initialized:", fabricCanvas);
      setCanvas(fabricCanvas);

      // ✅ Cleanup
      return () => {
        if (fabricCanvas && fabricCanvas.lowerCanvasEl) {
          try {
            fabricCanvas.dispose();
            console.log("🧹 Canvas disposed safely");
          } catch (err) {
            console.warn("⚠️ dispose() skipped:", err.message);
          }
        }
      };
    };

    initFabric(); // run the recursive check
  }, []);

  // ------------------------
  // 3️⃣ LOAD IMAGE
  // ------------------------
  useEffect(() => {
    if (!canvas) {
      console.log("⏸️ Waiting for Fabric canvas...");
      return;
    }
    if (!product) {
      console.log("⏸️ Waiting for product...");
      return;
    }

    console.log("🖼️ Attempting to load image:", product.image);

    fabric.Image.fromURL(
      product.image,
      (img) => {
        console.log("🔧 fromURL callback fired");
        if (!img) {
          console.error("❌ Image failed to load:", product.image);
          return;
        }
        img.scaleToWidth(400);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();
        console.log("✅ Image added to canvas successfully");
      },
      { crossOrigin: "anonymous" }
    );
  }, [canvas, product]);

  // ------------------------
  // 4️⃣ RENDER UI
  // ------------------------
  return (
  <div className="flex flex-col items-center justify-center w-full min-h-[80vh]">
    {product ? (
      <>
        <h2 className="text-2xl font-bold mb-2">
          {product.model} ({product.color})
        </h2>
        <p className="text-gray-600 mb-6">{product.category}</p>

        {/* 🎨 Canvas container */}
        <div className="relative w-[600px] h-[600px] border rounded-lg shadow-lg">
          <canvas ref={canvasRef} className="absolute top-0 left-0" />
        </div>
      </>
    ) : (
      <p className="text-gray-500 mt-10">
        Nenhum produto carregado. Volte e selecione um uniforme.
      </p>
    )}
  </div>
);

}
