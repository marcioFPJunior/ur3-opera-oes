import { useLocation } from "wouter";
import { useAppContext } from "@/lib/store";
import { Plus, History } from "lucide-react";

export default function Expedicao() {
  const [, setLocation] = useLocation();
  const { getRecordsByCategory } = useAppContext();
  const expedicaoRecords = getRecordsByCategory("Expedição");

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Expedição</h2>
        <p className="text-muted-foreground text-sm">Registre carregamentos de caminhão</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => setLocation("/expedicao/novo")}
          className="flex flex-col items-center justify-center gap-2 bg-primary text-primary-foreground p-6 rounded-2xl shadow-sm active:scale-95 transition-transform"
        >
          <Plus size={32} />
          <span className="font-bold">Carregamento de Caminhão</span>
        </button>

        <button
          onClick={() => setLocation("/expedicao/historico")}
          className="flex flex-col items-center justify-center gap-2 bg-card text-card-foreground border-2 border-border p-6 rounded-2xl shadow-sm active:scale-95 transition-transform mt-4"
        >
          <History size={32} className="text-muted-foreground" />
          <span className="font-bold">Histórico ({expedicaoRecords.length})</span>
        </button>
      </div>
    </div>
  );
}
