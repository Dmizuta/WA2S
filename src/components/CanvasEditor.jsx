import { useEffect, useRef } from "react";
import * as fabric from "fabric";




export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    // init once
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f9f9f9",
      width: 500,
      height: 400,
    });
    fabricRef.current = canvas;

    // proof of life: a green circle
    const circle = new fabric.Circle({
      radius: 50,
      fill: "#36b37e",
      left: 200,
      top: 150,
    });
    canvas.add(circle);

    console.log("✅ Fabric.js initialized");

    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div className="flex justify-center items-center py-10">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-md shadow-md"
      />
    </div>
  );
}
