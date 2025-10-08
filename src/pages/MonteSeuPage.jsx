import React, { useState } from "react";

export default function MonteSeuPage() {
  const [cliente, setCliente] = useState("");
  const [modelo, setModelo] = useState("Camisa Pro X");
  const [cores, setCores] = useState("Azul / Branco");
  const [quantidade, setQuantidade] = useState(10);
  const [personalizacao, setPersonalizacao] = useState('Nome "TIGRÕES" N°10');
  const [total, setTotal] = useState(790.0); // exemplo

  const whatsappNumber = "5511999999999"; // ⬅️ substituir pelo número oficial

  function recalcTotal(qty) {
    const unit = 79.0; // exemplo simples
    setTotal(qty * unit);
  }

  function buildWhatsAppMessage() {
    return `🧾 NOVO PEDIDO – A2 Sports

👤 Cliente: ${cliente || "—"}
🎽 Modelo: ${modelo}
🎨 Cores: ${cores}
🔢 Quantidade: ${quantidade}
🖋 Personalização: ${personalizacao}
💰 Total: R$ ${Number(total).toFixed(2)}

📍 Enviado via site: a2sports.vercel.app
👉 Ação: confirmar arte e enviar link de pagamento.`;
  }

  function openWhatsApp() {
    const msg = buildWhatsAppMessage();
    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      {/* Preview / Fabric placeholder */}
      <div className="p-5 border rounded-2xl bg-white">
        <h2 className="text-xl font-semibold mb-3">Preview do uniforme</h2>
        <div className="h-80 bg-gradient-to-b from-slate-100 to-white rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="text-5xl mb-2">🧵</div>
            <div className="text-sm">Canvas do Fabric.js entra aqui</div>
            <div className="text-xs mt-1 text-slate-500">Gerar imagem/JSON depois</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm text-slate-600">Resumo</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li><strong>Modelo:</strong> {modelo}</li>
            <li><strong>Cores:</strong> {cores}</li>
            <li><strong>Quantidade:</strong> {quantidade}</li>
            <li><strong>Total:</strong> R$ {Number(total).toFixed(2)}</li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <div className="p-5 border rounded-2xl bg-white">
        <h2 className="text-xl font-semibold mb-4">Monte o seu — informações</h2>

        <label className="block text-sm text-slate-600">Seu nome</label>
        <input
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          placeholder="João Silva"
          className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <label className="block text-sm text-slate-600 mt-4">Modelo</label>
        <select
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        >
          <option>Camisa Pro X</option>
          <option>Camisa Classic</option>
          <option>Regata Treino</option>
        </select>

        <label className="block text-sm text-slate-600 mt-4">Cores</label>
        <input
          value={cores}
          onChange={(e) => setCores(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />

        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <label className="text-sm text-slate-600">Quantidade</label>
            <input
              type="number"
              value={quantidade}
              min={1}
              onChange={(e) => {
                const q = Number(e.target.value || 1);
                setQuantidade(q);
                recalcTotal(q);
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-slate-600">Personalização</label>
            <input
              value={personalizacao}
              onChange={(e) => setPersonalizacao(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 bg-slate-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Total estimado</div>
              <div className="text-2xl font-bold">
                R$ {Number(total).toFixed(2)}
              </div>
            </div>
            <div className="text-sm text-slate-500">Pagamento: PIX / Cartão</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={openWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-3 font-medium shadow"
          >
            Enviar pedido para WhatsApp
          </button>

          <button
            onClick={() => alert("Salvar rascunho - implementar depois")}
            className="w-full border rounded-lg px-4 py-3"
          >
            Salvar rascunho
          </button>

          <div className="text-xs text-slate-500 mt-2">
            Ao clicar em “Enviar pedido para WhatsApp”, o pedido abre no WhatsApp com um resumo para a equipe da Amanda.
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-400">
          Dica: quando integrar o Fabric.js, substitua a área de preview por um canvas e gere imagem/JSON para anexar ou
          linkar no WhatsApp.
        </div>
      </div>
    </div>
  );
}
