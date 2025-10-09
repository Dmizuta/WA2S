export default function CategorySelector({ onSelect, data }) {
  return (
    <div className="step">
      <h2>Escolha uma categoria</h2>
      <div className="grid">
        {Object.keys(data).map((key) => (
          <div key={key} className="card" onClick={() => onSelect(key)}>
            <img src={data[key].img} alt={data[key].name} />
          </div>
        ))}
      </div>
    </div>
  );
}
