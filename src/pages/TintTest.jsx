import { useEffect, useRef } from "react";
import { fabric } from "fabric-pure-browser";

export default function TintTest() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 900,
    });

    const picker1 = document.getElementById("color1");
    const picker2 = document.getElementById("color2");
    const picker3 = document.getElementById("color3");

    // 🎨 Tint helper
    function applyTint(obj, color) {
      obj.filters = [
        new fabric.Image.filters.BlendColor({
          color,
          mode: "multiply",
          alpha: 1,
        }),
      ];
      obj.applyFilters();
      canvas.requestRenderAll();
    }

    // 🧱 Load masks first, then base
    Promise.all([
      loadImage("/images/tint-test/mask1.png"),
      loadImage("/images/tint-test/mask2.png"),
      loadImage("/images/tint-test/mask3.png"),
    ])
      .then(([mask1, mask2, mask3]) => {
        // Initial tint colors
        applyTint(mask1, picker1.value);
        applyTint(mask2, picker2.value);
        applyTint(mask3, picker3.value);

        // Add masks to canvas
        canvas.add(mask1, mask2, mask3);

        // Now load base image on top
        return loadImage("/images/tint-test/base.png").then((base) => {
          canvas.add(base);
          canvas.bringToFront(base);

          // Hook up color pickers
          picker1.oninput = (e) => applyTint(mask1, e.target.value);
          picker2.oninput = (e) => applyTint(mask2, e.target.value);
          picker3.oninput = (e) => applyTint(mask3, e.target.value);

          canvas.requestRenderAll();
        });
      })
      .catch((err) => console.error("Error loading images:", err));

    // Helper to load Fabric images with a Promise
    function loadImage(url) {
      return new Promise((resolve, reject) => {
        fabric.Image.fromURL(
          url,
          (img) => {
            img.selectable = false;
            resolve(img);
          },
          { crossOrigin: "anonymous" }
        );
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <canvas ref={canvasRef} className="border border-gray-400" />
      <div className="mt-4 flex gap-6">
        <div>
          <label className="mr-2">Mask 1:</label>
          <input type="color" id="color1" defaultValue="#ff0000" />
        </div>
        <div>
          <label className="mr-2">Mask 2:</label>
          <input type="color" id="color2" defaultValue="#0000ff" />
        </div>
        <div>
          <label className="mr-2">Mask 3:</label>
          <input type="color" id="color3" defaultValue="#00ff00" />
        </div>
      </div>
    </div>
  );
}
