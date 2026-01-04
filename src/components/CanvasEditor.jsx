// ========================
// ✅ CanvasEditor.jsx (GROUPED BASE+ART + Free Logo)
// - Base + art layers become ONE fabric.Group (moves/scales together)
// - Only the logo is independent (future: from UploadLogo)
// - Responsive wrapper-based sizing preserved
// ========================
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-pure-browser";
import { fabricData } from "../data/fabricData";

export default function CanvasEditor({ model, art }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const canvas = useRef(null);

  const modelGroupRef = useRef(null); // ✅ group for base + art layers
  const logoRef = useRef(null);       // ✅ independent logo object (optional)

  const userHasAdjustedRef = useRef(false);

  const sanitizeColor = (color) =>
    color?.length === 9 ? color.slice(0, 7) : color;

  const [colors, setColors] = useState({
    base: "#0e9420",
    layer1: "#00aaff",
    layer2: "#ff0000",
  });

  const [scalePercent, setScalePercent] = useState(100);
  const scalePercentRef = useRef(100);

  // --------------------------------------
  // Fit + center helper (works for Images AND Groups)
  // --------------------------------------
  const fitAndCenter = (c, obj) => {
    if (!c || !obj) return;

    const cw = c.getWidth();
    const ch = c.getHeight();

    // For groups, use bounding box dimensions
    // For images, use natural dimensions
    const natW =
      obj.__natW ||
      obj._originalElement?.width ||
      obj.width ||
      obj.getScaledWidth?.();
    const natH =
      obj.__natH ||
      obj._originalElement?.height ||
      obj.height ||
      obj.getScaledHeight?.();

    if (!natW || !natH) return;

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

  // --------------------------------------
  // Make ONE object interactive (the group)
  // --------------------------------------
  const makeInteractive = (obj) => {
    obj.selectable = true;
    obj.evented = true;
    obj.hasControls = true;
    obj.hasBorders = true;

    obj.lockUniScaling = true;
    obj.lockScalingFlip = true;

    obj.cornerSize = 20;
    obj.transparentCorners = false;
  };

  // --------------------------------------
  // Make layers non-interactive (inside group)
  // --------------------------------------
  const makeNonInteractive = (obj) => {
    obj.selectable = false;
    obj.evented = false;
    obj.hasControls = false;
    obj.hasBorders = false;
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
      selection: true,
    });
    canvas.current = c;

    // mark user adjusted if they move/scale the GROUP or LOGO
    const markUserAdjusted = () => (userHasAdjustedRef.current = true);
    c.on("object:moving", markUserAdjusted);
    c.on("object:scaling", markUserAdjusted);
    c.on("object:rotating", markUserAdjusted);

    const resizeCanvas = () => {
      const rect = wrapper.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height));
      if (!size || size < 50) return;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      c.setWidth(size);
      c.setHeight(size);
      c.calcOffset();

      // Auto fit/center only until user adjusts
      if (!userHasAdjustedRef.current) {
        // Fit group
        if (modelGroupRef.current) fitAndCenter(c, modelGroupRef.current);

        // Fit logo? (usually no — logo should keep user placement)
        // If you want logo to follow canvas resize until moved, you can do:
        // if (logoRef.current) fitAndCenter(c, logoRef.current);
      }

      c.requestRenderAll();
    };

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
     🖼️ Load Model + Art Layers → create GROUP
  ====================================== */
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;

    c.clear();

    modelGroupRef.current = null;

    // keep logo if you want (optional). For now we clear it too:
    logoRef.current = null;

    // Reset interaction flag on new composition
    userHasAdjustedRef.current = false;

    if (!model) {
      c.renderAll();
      return;
    }

    // Find modelData + categoryKey
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

    const urls = [];

    // base always first
    if (modelData.img) urls.push({ type: "base", url: modelData.img });

    // art layers after
    if (art && categoryKey) {
      const modelArts = fabricData[categoryKey]?.arts?.[model];
      const selectedArt = modelArts?.find((a) => a.id === art);
      if (selectedArt?.layers?.length) {
        selectedArt.layers.forEach((path, i) =>
          urls.push({ type: `layer${i + 1}`, url: path })
        );
      }
    }

    if (!urls.length) return;

    // Load all images, then group them
    const loaded = [];
    let remaining = urls.length;

    const done = () => {
      // Ensure all are stacked correctly (base first)
      loaded.forEach((img) => makeNonInteractive(img));

      const group = new fabric.Group(loaded, {
        originX: "center",
        originY: "center",
      });

      // Store "natural" size for fit math (group bbox before scaling)
      const bbox = group.getBoundingRect(true, true);
      group.__natW = bbox.width;
      group.__natH = bbox.height;

      makeInteractive(group);

      c.add(group);
      fitAndCenter(c, group);
      modelGroupRef.current = group;

      c.setActiveObject(group);
      c.requestRenderAll();
    };

    urls.forEach((item) => {
      fabric.Image.fromURL(
        item.url,
        (img) => {
          img.__kind = item.type;

          // normalize group alignment
          img.set({
            originX: "center",
            originY: "center",
            left: 0,
            top: 0,
          });

          // store natural sizes for tint logic (not required, but ok)
          img.__natW = img.width;
          img.__natH = img.height;

          loaded.push(img);
          remaining -= 1;
          if (remaining === 0) done();
        },
        { crossOrigin: "anonymous" }
      );
    });
  }, [model, art]);

  /* ======================================
     🎨 Apply Color Filters (inside GROUP)
  ====================================== */
  useEffect(() => {
    const c = canvas.current;
    const group = modelGroupRef.current;
    if (!c || !group) return;

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

    // Group items are in order: [base, layer1, layer2...]
    const items = group.getObjects();

    applyTint(items[0], colors.base, 0.9);
    applyTint(items[1], colors.layer1, 0.8);
    applyTint(items[2], colors.layer2, 0.8);

    // Important: after changing filters in group items
    group.addWithUpdate();
    c.requestRenderAll();
  }, [colors]);

  const handleColorChange = (key, value) =>
    setColors((prev) => ({ ...prev, [key]: sanitizeColor(value) }));

  /* ======================================
     📏 Size Control (scales the GROUP only)
  ====================================== */
  const handleScaleChange = (value) => {
    const c = canvas.current;
    const group = modelGroupRef.current;
    if (!c || !group) return;

    scalePercentRef.current = value;
    setScalePercent(value);

    const factor = value / 100;
    const baseScale = group.__baseScale || group.scaleX || 1;

    group.scale(baseScale * factor);
    group.setCoords();

    c.requestRenderAll();
  };

  /* ======================================
     🔄 Reset (group back to centered fit)
  ====================================== */
  const handleReset = () => {
    const c = canvas.current;
    const group = modelGroupRef.current;
    if (!c || !group) return;

    userHasAdjustedRef.current = false;
    fitAndCenter(c, group);
    c.setActiveObject(group);
    c.requestRenderAll();
  };

  /* ======================================
     🧩 FUTURE: Add customer logo (independent)
     - Call this from UploadLogo flow
  ====================================== */
  const addLogoFromURL = (url) => {
    const c = canvas.current;
    if (!c || !url) return;

    fabric.Image.fromURL(
      url,
      (img) => {
        // Logo should be free
        img.selectable = true;
        img.evented = true;
        img.hasControls = true;
        img.hasBorders = true;

        img.lockUniScaling = true;
        img.lockScalingFlip = true;

        img.cornerSize = 22;
        img.transparentCorners = false;

        // Place logo center-ish initially
        img.set({
          originX: "center",
          originY: "center",
          left: c.getWidth() / 2,
          top: c.getHeight() / 2,
        });

        // initial logo size (relative)
        img.scale(0.25);
        img.setCoords();

        // keep reference
        logoRef.current = img;

        c.add(img);
        c.setActiveObject(img);
        c.requestRenderAll();
      },
      { crossOrigin: "anonymous" }
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={wrapperRef}
        className="
          relative
          w-full
          aspect-square
          max-h-[80vh]

          md:w-[700px]
          md:max-h-[700px]

          border
          rounded-lg
          shadow-lg
          mb-4
          bg-white
          flex
          items-center
          justify-center
        "
      >
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      <button
        onClick={handleReset}
        className="mb-4 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
      >
        Reset position
      </button>

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
