// ========================
// ✅ CanvasEditor.jsx (Fix: size Fabric canvas from the REAL wrapper box)
// - Uses wrapperRef + getBoundingClientRect()
// - Keeps CSS size == Fabric buffer size
// ========================
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";
import { fabricData } from "../data/fabricData";

export default function CanvasEditor({ model, art }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null); // ✅ new: real container
  const canvas = useRef(null);

  const baseRef = useRef(null);
  const layerRefs = useRef([]);

  const sanitizeColor = (color) =>
    color?.length === 9 ? color.slice(0, 7) : color;

  const [colors, setColors] = useState({
    base: "#0e9420",
    layer1: "#00aaff",
    layer2: "#ff0000",
  });

  const [scalePercent, setScalePercent] = useState(100);
  const scalePercentRef = useRef(100);

  // Helper: fit + center an object using its natural size
  const fitAndCenter = (c, obj) => {
    if (!c || !obj) return;

    const cw = c.getWidth();
    const ch = c.getHeight();

    const natW = obj.__natW || obj._originalElement?.width || obj.width;
    const natH = obj.__natH || obj._originalElement?.height || obj.height;

    if (!natW || !natH) return;

    // ✅ Fit ~95% of the REAL Fabric canvas size
    const baseScale = Math.min(cw / natW, ch / natH) * 0.95;
    obj.__baseScale = baseScale;

    const userFactor = (scalePercentRef.current || 100) / 100;
    obj.scale(baseScale * userFactor);

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
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    const c = new fabric.Canvas(el, {
      backgroundColor: "#f8f8f8",
      preserveObjectStacking: true,
    });
    canvas.current = c;

    const resizeCanvas = () => {
      const rect = wrapper.getBoundingClientRect();

      // ✅ REAL rendered pixels
      const size = Math.floor(Math.min(rect.width, rect.height));

      // Guard
      if (!size || size < 50) return;

      // ✅ Keep canvas element CSS size in sync with Fabric buffer size
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      c.setWidth(size);
      c.setHeight(size);
      c.calcOffset();

      // Refit all objects (respecting slider)
      c.getObjects().forEach((obj) => fitAndCenter(c, obj));
      c.requestRenderAll();

      // 🔍 Optional debug
      // console.log("WRAPPER:", Math.round(rect.width), Math.round(rect.height), "=> FABRIC:", c.getWidth(), c.getHeight());
    };

    // ✅ Observe the wrapper itself (not canvas parent guessing)
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(wrapper);

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

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
          c.requestRenderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }

    // Art layers
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
              c.requestRenderAll();
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

    c.requestRenderAll();
  }, [colors]);

  const handleColorChange = (key, value) =>
    setColors((prev) => ({ ...prev, [key]: sanitizeColor(value) }));

  /* ======================================
     📏 Size Control Handler
  ====================================== */
  const handleScaleChange = (value) => {
    const c = canvas.current;
    if (!c) return;

    scalePercentRef.current = value;
    setScalePercent(value);

    const factor = value / 100;

    c.getObjects().forEach((obj) => {
      const baseScale = obj.__baseScale || obj.scaleX || 1;
      obj.scale(baseScale * factor);
      obj.setCoords();
    });

    c.requestRenderAll();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ✅ wrapperRef is the REAL sizing source */}
      <div
        ref={wrapperRef}
        className="relative w-full aspect-square max-h-[80vh] border rounded-lg shadow-lg mb-4 bg-white flex items-center justify-center"
      >
        {/* ✅ no w-full/h-full here */}
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      {/* Color pickers */}
      <div className="flex flex-row gap-8 flex-wrap justify-center">
        {["base", "layer1", "layer2"].map((key) => (
          <div className="flex flex-col items-center" key={key}>
            <label className="text-sm text-gray-600 mb-1 capitalize">
              {key}
            </label>
            <input
              type="color"
              value={sanitizeColor(colors[key])}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Size slider */}
      <div className="mt-6 flex flex-col items-center">
        <label className="text-sm text-gray-600 mb-1">Size</label>
        <input
          type="range"
          min={50}
          max={300}
          value={scalePercent}
          onChange={(e) => handleScaleChange(Number(e.target.value))}
          className="w-48"
        />
        <span className="text-xs mt-1">{scalePercent}%</span>
      </div>
    </div>
  );
}
