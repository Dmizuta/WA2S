export default function ArtList() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm hover:bg-gray-300 transition cursor-pointer"
        >
          Art {i + 1}
        </div>
      ))}
    </div>
  );
}
