export default function ModelSelector({ models, selectedModel, setSelectedModel }) {
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
}
