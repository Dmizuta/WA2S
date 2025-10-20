export default function ColorPalette() {
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#000000"];
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {colors.map((c) => (
        <button
          key={c}
          className="w-8 h-8 rounded-full border"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}
