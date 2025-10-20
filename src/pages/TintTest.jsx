import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";

export default function TintTest() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f3f4f6",
      selection: false,
    });
    setCanvas(c);

    fabric.Image.fromURL("/images/test/mask.png", (img) => {
      img.set({
        left: c.width / 2,
        top: c.height / 2,
        originX: "center",
        originY: "center",
        selectable: false,
      });

      c.add(img);
      c.mask = img;
      c.renderAll();
    });

    return () => c.dispose();
  }, []);

  const handleColor = (e) => {
    const color = e.target.value;
    if (!canvas?.mask) return;

    // ✅ use BlendColor filter instead of Tint
    const filter = new fabric.Image.filters.BlendColor({
      color,
      mode: "tint", // try also "tint" or "overlay" if you want
      alpha: 1,
    });

    canvas.mask.filters = [filter];
    canvas.mask.applyFilters();
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <h1 className="text-xl font-bold">🎨 Fabric.js Tint Test</h1>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border rounded-lg shadow-lg"
      />
      <input type="color" onChange={handleColor} className="w-24 h-10" />
    </div>
  );
}
