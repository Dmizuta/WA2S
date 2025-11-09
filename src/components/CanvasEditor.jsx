// ========================
// ✅ CanvasEditor.jsx
// ========================
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";
import { fabricData } from "../data/fabricData";

export default function CanvasEditor({ model, art }) {
  const canvasRef = useRef(null);
  const canvas = useRef(null);

  const baseRef = useRef(null);
  const layerRefs = useRef([]);

  const sanitizeColor = (color) => {
    if (color.length === 9) return color.slice(0, 7);
    return color;
  };

  const [colors, setColors] = useState({
    base: "#0e9420",
    layer1: "#00aaff",
    layer2: "#ff0000",
  });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const fabricCanvas = new fabric.Canvas(el, {
      backgroundColor: "#f8f8f8",
      preserveObjectStacking: true,
    });
    canvas.current = fabricCanvas;

    const resizeCanvas = () => {
      const containerWidth = el.parentElement.offsetWidth;
      const maxSize = window.innerWidth >= 1024 ? 800 : window.innerWidth >= 768 ? 700 : 500;
      const size = Math.min(containerWidth, maxSize);
      fabricCanvas.setWidth(size);
      fabricCanvas.setHeight(size);
      fabricCanvas.calcOffset();
      fabricCanvas.renderAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      try {
        fabricCanvas.dispose();
      } catch (err) {
        console.error("Canvas dispose failed:", err);
      }
      canvas.current = null;
    };
  }, []);

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

    const scaleToCanvas = (img) => {
      const cw = c.getWidth();
      const ch = c.getHeight();
      const scale = Math.min(cw / img.width, ch / img.height) * 0.95;
      img.scale(scale);
      img.set({
        left: cw / 2,
        top: ch / 2,
        originX: "center",
        originY: "center",
      });
    };

    if (modelData.img) {
      fabric.Image.fromURL(modelData.img, (img) => {
        scaleToCanvas(img);
        img.selectable = false;
        c.add(img);
        baseRef.current = img;
        c.renderAll();
      }, { crossOrigin: "anonymous" });
    }

    if (art && categoryKey) {
      const modelArts = fabricData[categoryKey].arts[model];
      const selectedArt = modelArts?.find((a) => a.id === art);
      if (!selectedArt?.layers) return;

      selectedArt.layers.forEach((path, i) => {
        fabric.Image.fromURL(path, (img) => {
          scaleToCanvas(img);
          img.selectable = false;
          c.add(img);
          layerRefs.current[i] = img;
          c.renderAll();
        }, { crossOrigin: "anonymous" });
      });
    }
  }, [model, art]);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;

    const applyTint = (img, color, strength = 1) => {
      if (!img) return;
      img.filters = [
        new fabric.Image.filters.BlendColor({
          color: sanitizeColor(color),
          mode: "multiply",
          alpha: strength,
        })
      ];
      img.applyFilters();
    };

    applyTint(baseRef.current, colors.base, 0.9);
    applyTint(layerRefs.current[0], colors.layer1, 0.8);
    applyTint(layerRefs.current[1], colors.layer2, 0.8);

    c.renderAll();
  }, [colors]);

  const handleColorChange = (key, value) =>
    setColors((prev) => ({ ...prev, [key]: sanitizeColor(value) }));

  return (
    <div className="pl-0 sm:pl-4 md:pl-12 lg:pl-24 w-full">
      <div className="relative w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[800px] aspect-square border rounded-lg shadow-lg mb-6 bg-white">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      <div className="flex flex-row gap-8 flex-wrap justify-center">
        {["base", "layer1", "layer2"].map((key) => (
          <div className="flex flex-col items-center" key={key}>
            <label className="text-sm text-gray-600 mb-1 capitalize">{key}</label>
            <input
              type="color"
              value={sanitizeColor(colors[key])}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
