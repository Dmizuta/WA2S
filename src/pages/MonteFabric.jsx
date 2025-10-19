import Header from "../components/Header";
import Footer from "../components/Footer";
import CanvasEditor from "../components/CanvasEditor.jsx";

export default function MonteFabric() {
  return (
    <>
      <Header />

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Monte o Seu Uniforme</h1>
        <CanvasEditor />
      </main>

      <Footer />
    </>
  );
}
