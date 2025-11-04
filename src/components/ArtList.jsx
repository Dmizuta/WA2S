/*export default function ArtList({ arts, selectedArt, setSelectedArt }) {
  return (
    <section className="bg-white p-4 rounded-xl shadow flex flex-col">
      <h2 className="font-semibold mb-3 text-center">Artes</h2>
      <div className="border rounded-lg h-[300px] overflow-y-auto">
        <ul className="divide-y">
          {arts.length > 0 ? (
            arts.map((a) => (
              <li
                key={a.id}
                className={`p-2 cursor-pointer hover:bg-blue-50 ${
                  selectedArt === a.id ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => setSelectedArt(a.id)}
              >
                {a.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-400 italic text-center">
              Selecione um modelo para ver as artes
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}*/


export default function ArtList({ arts, selectedArt, setSelectedArt }) {
  return (
    <div className="flex flex-col">
      <select
        className="border rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedArt}
        onChange={(e) => setSelectedArt(e.target.value)}
      >
        <option value="">Selecione uma arte</option>
        {arts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
    </div>
  );
}

