import React from "react";

export default function ProductCard({ title, subtitle, price, img, onAdd }) {
  return (
    <article className="max-w-sm rounded-2xl shadow-lg p-4 bg-white">
      <div className="h-44 rounded-lg overflow-hidden mb-3">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="text-right">
          <div className="text-gray-700 font-medium">R$ {price}</div>
          <button
            onClick={onAdd}
            className="mt-2 px-3 py-1 rounded-lg border border-transparent hover:bg-gray-100"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
