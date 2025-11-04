// src/components/CanvasEditor.jsx
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";
import { fabricData } from "../data/fabricData";

export default function CanvasEditor({ model, art }) {
  const canvasRef = useRef(null);
  const canvas = useRef(null);

  // Refs for images
  const baseRef = useRef(null);
  const layerRefs = useRef([]);

  const [colors, setColors] = useState({
    base: "#0e9420ff",
    layer1: "#00aaff",
    layer2: "#ff0000",
  });

  /* ======================================
     🧱 Initialize responsive Fabric canvas
  ====================================== */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const fabricCanvas = new fabric.Canvas(el, {
      backgroundColor: "#f8f8f8",
      preserveObjectStacking: true,
    });
    canvas.current = fabricCanvas;

    // initial sizing
    const resizeCanvas = () => {
      const containerWidth = el.parentElement.offsetWidth;
      const size = Math.min(containerWidth, 600); // cap at 600px
      fabricCanvas.setWidth(size);
      fabricCanvas.setHeight(size);
      fabricCanvas.calcOffset();
      fabricCanvas.renderAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      fabricCanvas.dispose();
      canvas.current = null;
    };
  }, []);

  /* ======================================
     🖼️ Load model + art layers responsively
  ====================================== */
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    c.clear();
    layerRefs.current = [];
    baseRef.current = null;

    if (!model) return;

    let categoryKey = null;
    let modelData = null;
    for (const key in fabricData) {
      const found = fabricData[key].models.find((m) => m.id === model);
      if (found) {
        categoryKey = key;
        modelData = found;
        break;
      }
    }
    if (!modelData) return;

    // helper: scale image to fit current canvas width
    const scaleToCanvas = (img) => {
      const cw = c.getWidth();
      img.scaleToWidth(cw * 0.9); // a bit of margin
      img.set({ left: cw / 2, top: c.getHeight() / 2, originX: "center", originY: "center" });
    };

    // 🧱 Base image
    if (modelData.img) {
      fabric.Image.fromURL(
        modelData.img,
        (img) => {
          scaleToCanvas(img);
          img.selectable = false;
          c.add(img);
          baseRef.current = img;
          c.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }

    // 🖌 Art layers
    if (art && categoryKey) {
      const modelArts = fabricData[categoryKey].arts[model];
      const selectedArt = modelArts?.find((a) => a.id === art);
      if (!selectedArt?.layers) return;

      selectedArt.layers.forEach((path, i) => {
        fabric.Image.fromURL(
          path,
          (img) => {
            scaleToCanvas(img);
            img.selectable = false;
            c.add(img);
            layerRefs.current[i] = img;
            c.renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      });
    }
  }, [model, art]);

  /* ======================================
     🎨 Tint filters
  ====================================== */
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;

    const applyTint = (img, color, strength = 1) => {
      if (!img) return;
      img.filters = [
        new fabric.Image.filters.BlendColor({
          color,
          mode: "multiply",
          alpha: strength,
        }),
      ];
      img.applyFilters();
    };

    applyTint(baseRef.current, colors.base, 0.9);
    applyTint(layerRefs.current[0], colors.layer1, 0.8);
    applyTint(layerRefs.current[1], colors.layer2, 0.8);

    c.renderAll();
  }, [colors]);

  /* ======================================
     🎛️ UI controls
  ====================================== */
  const handleColorChange = (key, value) =>
    setColors((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Canvas */}
      <div className="relative w-full max-w-[600px] aspect-square border rounded-lg shadow-lg mb-6 bg-white">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>

      {/* Tint controls */}
      <div className="flex flex-row gap-8 flex-wrap justify-center">
        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-600 mb-1">Base</label>
          <input
            type="color"
            value={colors.base}
            onChange={(e) => handleColorChange("base", e.target.value)}
            className="w-10 h-10 border rounded cursor-pointer"
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-600 mb-1">Layer 1</label>
          <input
            type="color"
            value={colors.layer1}
            onChange={(e) => handleColorChange("layer1", e.target.value)}
            className="w-10 h-10 border rounded cursor-pointer"
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-600 mb-1">Layer 2</label>
          <input
            type="color"
            value={colors.layer2}
            onChange={(e) => handleColorChange("layer2", e.target.value)}
            className="w-10 h-10 border rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
