// ========================
// ✅ CanvasEditor.jsx (responsive grow + strict centering + ResizeObserver)
// ========================
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";
import { fabricData } from "../data/fabricData";

export default function CanvasEditor({ model, art }) {
  const canvasRef = useRef(null);
  const canvas = useRef(null);

  const baseRef = useRef(null);
  const layerRefs = useRef([]);

  const sanitizeColor = (color) => (color?.length === 9 ? color.slice(0, 7) : color);

  const [colors, setColors] = useState({
    base: "#0e9420",
    layer1: "#00aaff",
    layer2: "#ff0000",
  });

  // Helper: fit + center an object using its natural size
  const fitAndCenter = (c, obj) => {
    if (!c || !obj) return;
    const cw = c.getWidth();
    const ch = c.getHeight();

    const natW = obj.__natW || obj._originalElement?.width || obj.width;
    const natH = obj.__natH || obj._originalElement?.height || obj.height;

    if (!natW || !natH) return;

    const scale = Math.min(cw / natW, ch / natH) * 0.95;
    obj.scale(scale);
    obj.set({
      left: cw / 2,
      top: ch / 2,
      originX: "center",
      originY: "center",
    });
    obj.setCoords();
  };

  /* ======================================
     🧱 Initialize Fabric Canvas + Resize
  ====================================== */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const c = new fabric.Canvas(el, {
      backgroundColor: "#f8f8f8",
      preserveObjectStacking: true,
    });
    canvas.current = c;

    const resizeCanvas = () => {
      const container = el.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const maxByHeight = Math.floor(window.innerHeight * 0.8);
      const size = Math.min(containerWidth, maxByHeight);

      c.setWidth(size);
      c.setHeight(size);
      c.calcOffset();

      // Refit + center all existing objects
      c.getObjects().forEach((obj) => fitAndCenter(c, obj));
      c.renderAll();
    };

    // ✅ Observe parent container directly
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(el.parentElement);

    // Fallback: window resize listener
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas(); // run once on mount

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      try {
        c.dispose();
      } catch {}
      canvas.current = null;
    };
  }, []);

  /* ======================================
     🖼️ Load Model + Art Layers
  ====================================== */
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;

    c.clear();
    layerRefs.current = [];
    baseRef.current = null;

    if (!model) {
      c.renderAll();
      return;
    }

    // find modelData + categoryKey
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

    // Base image
    if (modelData.img) {
      fabric.Image.fromURL(
        modelData.img,
        (img) => {
          img.__natW = img.width;
          img.__natH = img.height;
          img.selectable = false;
          img.evented = false;

          c.add(img);
          fitAndCenter(c, img);
          baseRef.current = img;
          c.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }

    // Art layers (optional)
    if (art && categoryKey) {
      const modelArts = fabricData[categoryKey]?.arts?.[model];
      const selectedArt = modelArts?.find((a) => a.id === art);
      if (selectedArt?.layers?.length) {
        selectedArt.layers.forEach((path, i) => {
          fabric.Image.fromURL(
            path,
            (img) => {
              img.__natW = img.width;
              img.__natH = img.height;
              img.selectable = false;
              img.evented = false;

              c.add(img);
              fitAndCenter(c, img);
              layerRefs.current[i] = img;
              c.renderAll();
            },
            { crossOrigin: "anonymous" }
          );
        });
      }
    }
  }, [model, art]);

  /* ======================================
     🎨 Apply Color Filters
  ====================================== */
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
        }),
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
    <div className="w-full flex flex-col items-center">
      {/* IMPORTANT: no max-w cap here; column width controls size */}
      <div className="relative w-full aspect-square max-h-[70vh] md:max-h-[60vh] lg:max-h-[55vh] border rounded-lg shadow-lg mb-4 bg-white flex items-center justify-center">

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
