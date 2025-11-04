/*export default function ModelSelector({ models, selectedModel, setSelectedModel }) {
  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-3 text-center">Modelos</h2>
      <select
        className="w-full border rounded-lg p-2"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="">Selecione um modelo</option>
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </section>
  );
}*/


export default function ModelSelector({ models, selectedModel, setSelectedModel }) {
  return (
    <div className="flex flex-col">
      <select
        className="border rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="">Selecione um modelo</option>
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}

