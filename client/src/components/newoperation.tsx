tsx;

import { useState } from "react";

export default function NewOperation() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const handleSave = () => {
    console.log("Produto:", product);
    console.log("Quantidade:", quantity);
    console.log("Observação:", note);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nova Operação</h2>

      <div>
        <label>Produto</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Ex: Aguarrás"
        />
      </div>

      <div>
        <label>Quantidade</label>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Ex: 25500 kg"
        />
      </div>

      <div>
        <label>Observação / Ocorrência</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex: aguardando LCQ"
        />
      </div>

      <button onClick={handleSave}>Salvar Operação</button>
    </div>
  );
}
