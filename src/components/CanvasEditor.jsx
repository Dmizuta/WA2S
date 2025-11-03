// src/components/CanvasEditor.jsx
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";
import { fabricData } from "../data/fabricData";

export default function CanvasEditor({ model, art }) {
  const canvasRef = useRef(null);
  const canvas = useRef(null);

  // Store refs for tintable images
  const baseRef = useRef(null);
  const layerRefs = useRef([]);

  const [colors, setColors] = useState({
    base: "#0e9420ff",
    layer1: "#00aaff",
    layer2: "#ff0000",
  });

  // 🧩 Initialize Fabric canvas once
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const fabricCanvas = new fabric.Canvas(el, {
      width: 600,
      height: 600,
      backgroundColor: "#f8f8f8",
      preserveObjectStacking: true,
    });

    canvas.current = fabricCanvas;

    // 🧹 Proper cleanup when leaving MonteFabric
    return () => {
      try {
        fabricCanvas.dispose();
      } catch (err) {
        console.warn("Error disposing Fabric:", err);
      }

      // 🧹 Remove any leftover Fabric events
      window.removeEventListener("resize", fabricCanvas.calcOffset);
      window.removeEventListener("keydown", fabricCanvas._onKeyDown);
      window.removeEventListener("keyup", fabricCanvas._onKeyUp);
      window.removeEventListener("mousemove", fabricCanvas._onMouseMove);
      window.removeEventListener("mouseup", fabricCanvas._onMouseUp);

      // 🧹 Release any page locks or hidden scrolls
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.classList.remove(
        "overflow-hidden",
        "modal-open",
        "lock-scroll"
      );

      canvas.current = null;
    };
  }, []);

  // 🖼️ Load model + art layers
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    c.clear();
    layerRefs.current = [];
    baseRef.current = null;

    if (!model) return;

    // find category/model
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

    // 🧱 Base image
    if (modelData.img) {
      fabric.Image.fromURL(
        modelData.img,
        (img) => {
          img.scaleToWidth(500);
          img.selectable = false;
          c.add(img);
          c.centerObject(img);
          c.renderAll();
          baseRef.current = img;
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
            img.scaleToWidth(500);
            img.selectable = false;
            c.add(img);
            c.centerObject(img);
            c.renderAll();
            layerRefs.current[i] = img;
          },
          { crossOrigin: "anonymous" }
        );
      });
    }
  }, [model, art]);

  // 🎨 Apply tint filters whenever colors change
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;

    const applyTint = (img, color, strength = 1) => {
      if (!img) return;
      img.filters = [
        new fabric.Image.filters.BlendColor({
          color,
          mode: "multiply", // natural dark blending
          alpha: strength,   // lower alpha preserves luminance
        }),
      ];
      img.applyFilters();
    };

    applyTint(baseRef.current, colors.base, 0.9); // soft for base (keep shadows)
    applyTint(layerRefs.current[0], colors.layer1, 0.8);
    applyTint(layerRefs.current[1], colors.layer2, 0.8);

    c.renderAll();
  }, [colors]);

  // 🎛️ UI controls
  const handleColorChange = (key, value) =>
    setColors((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Canvas */}
      <div className="relative w-[600px] h-[600px] border rounded-lg shadow-lg mb-6 bg-white">
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      {/* Tint controls */}
      <div className="flex flex-row gap-8">
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
