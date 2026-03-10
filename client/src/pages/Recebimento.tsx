import { useLocation } from "wouter";
import { useAppContext } from "@/lib/store";
import { Plus, History } from "lucide-react";

export default function Recebimento() {
  const [, setLocation] = useLocation();
  const { getRecordsByCategory } = useAppContext();
  const recebimentoRecords = getRecordsByCategory("Recebimento");

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Recebimento</h2>
        <p className="text-muted-foreground text-sm">Registre operações de recebimento</p>
      </div>

      <div className="grid gap-4">
        <button
          data-testid="button-novo-recebimento"
          onClick={() => setLocation("/recebimento/novo")}
          className="flex flex-col items-center justify-center gap-2 bg-primary text-primary-foreground p-6 rounded-2xl shadow-sm active:scale-95 transition-transform"
        >
          <Plus size={32} />
          <span className="font-bold">Novo Recebimento</span>
        </button>

        <button
          data-testid="button-historico-recebimento"
          onClick={() => setLocation("/recebimento/historico")}
          className="flex flex-col items-center justify-center gap-2 bg-card text-card-foreground border-2 border-border p-6 rounded-2xl shadow-sm active:scale-95 transition-transform mt-4"
        >
          <History size={32} className="text-muted-foreground" />
          <span className="font-bold">Histórico ({recebimentoRecords.length})</span>
        </button>
      </div>
    </div>
  );
}
