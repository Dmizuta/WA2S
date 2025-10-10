import CanvasEditor from "../components/CanvasEditor.jsx";

export default function MonteFabric() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Monte o Seu Uniforme</h1>
      <CanvasEditor />
    </div>
  );
}
