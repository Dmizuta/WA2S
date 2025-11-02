import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";

export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [layers, setLayers] = useState({ base: null, pattern: null, logo: null });
  const [colors, setColors] = useState({
    base: "#ffffff",
    pattern: "#00aaff",
    logo: "#ff9900",
  });

  // 1️⃣ Initialize Fabric safely
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    if (el._fabricInstance) return;

    const fabricCanvas = new fabric.Canvas(el, {
      width: 600,
      height: 600,
      backgroundColor: "#f8f8f8",
      selection: false,
    });

    el._fabricInstance = fabricCanvas;
    setCanvas(fabricCanvas);

    return () => {
      if (fabricCanvas && !fabricCanvas.disposed) {
        try {
          fabricCanvas.dispose();
          fabricCanvas.disposed = true;
        } catch (err) {
          console.warn("🧹 dispose skipped:", err.message);
        }
      }
    };
  }, []);

  // 2️⃣ Load base, pattern, and logo
  useEffect(() => {
    if (!canvas) return;

    canvas.clear();

    // Base
    fabric.Image.fromURL(
      "/images/test/base.png",
      (base) => {
        base.scaleToWidth(500);
        base.selectable = false;
        base.evented = false;
        canvas.add(base);
        canvas.centerObject(base);
        setLayers((p) => ({ ...p, base }));
      },
      { crossOrigin: "anonymous" }
    );

    // Pattern
    fabric.Image.fromURL(
      "/images/test/pattern.png",
      (pattern) => {
        pattern.scaleToWidth(500);
        pattern.selectable = false;
        pattern.evented = false;
        canvas.add(pattern);
        canvas.centerObject(pattern);
        setLayers((p) => ({ ...p, pattern }));

        // Logo (same size & position)
        fabric.Image.fromURL(
          "/images/test/logo.png",
          (logoImg) => {
            logoImg.scaleToWidth(500);
            logoImg.selectable = false;
            logoImg.evented = false;
            canvas.add(logoImg);
            canvas.centerObject(logoImg);
            canvas.bringToFront(logoImg);
            setLayers((p) => ({ ...p, logo: logoImg }));
            canvas.renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      },
      { crossOrigin: "anonymous" }
    );
  }, [canvas]);

  // 3️⃣ Apply tint per layer
  useEffect(() => {
    if (!canvas) return;

    const applyTint = (img, color, mode = "tint", alpha = 1) => {
      if (!img) return;
      img.filters = [
        new fabric.Image.filters.BlendColor({ color, mode, alpha }),
      ];
      img.applyFilters();
    };

    applyTint(layers.base, colors.base, "multiply", 0.35);
    applyTint(layers.pattern, colors.pattern, "tint", 1);
    applyTint(layers.logo, colors.logo, "tint", 1);
    canvas.renderAll();
  }, [colors, layers, canvas]);

  // 4️⃣ Render canvas + horizontal color pickers
  const handleColorChange = (layer, newColor) =>
    setColors((prev) => ({ ...prev, [layer]: newColor }));

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-[600px] h-[600px] border rounded-lg shadow-lg mb-6">
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      {/* 🎨 Horizontal layout */}
      <div className="flex items-center justify-center gap-8">
        {["base", "pattern", "logo"].map((layer) => (
          <div key={layer} className="flex flex-col items-center gap-2">
            <label className="capitalize text-gray-700 font-medium text-sm">
              {layer}
            </label>
            <input
              type="color"
              value={colors[layer]}
              onChange={(e) => handleColorChange(layer, e.target.value)}
              className="w-10 h-10 cursor-pointer rounded-md border"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
