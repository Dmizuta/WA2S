export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
        <span>© {new Date().getFullYear()} A2 Sports</span>
        <span className="text-gray-400">Feito com React + Tailwind</span>
      </div>
    </footer>
  );
}
