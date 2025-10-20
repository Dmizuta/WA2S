export default function ModelSelector() {
  const models = [
    { id: 1, name: "Modelo 1", img: "/images/models/tshirt1.png" },
    { id: 2, name: "Modelo 2", img: "/images/models/tshirt2.png" },
    { id: 3, name: "Modelo 3", img: "/images/models/tshirt3.png" },
    { id: 4, name: "Modelo 4", img: "/images/models/tshirt4.png" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {models.map((m) => (
        <button
          key={m.id}
          className="flex flex-col items-center border rounded-xl overflow-hidden hover:shadow-md transition"
        >
          <img
            src={m.img}
            alt={m.name}
            className="w-full h-20 object-contain bg-gray-50"
          />
          <span className="text-sm font-medium py-1">{m.name}</span>
        </button>
      ))}
    </div>
  );
}
