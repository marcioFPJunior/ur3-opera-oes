import { useLocation } from "wouter";
import { useAppContext } from "@/lib/store";
import { PlusCircle, Camera, ClipboardList } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const [, setLocation] = useLocation();
  const { records, currentUser } = useAppContext();

  // Count today's operations
  const today = new Date().toISOString().split('T')[0];
  const todayCount = records.filter(r => r.date.startsWith(today)).length;

  return (
    <div className="p-4 space-y-6">
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
        <p className="text-sm font-medium text-muted-foreground mb-1">Operador Logado</p>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-foreground">{currentUser}</h2>
          <div className="text-right">
            <p className="text-3xl font-black text-primary leading-none">{todayCount}</p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Registros Hoje</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 mt-8">
        <button
          onClick={() => setLocation("/novo")}
          className="flex flex-col items-center justify-center gap-3 bg-primary text-primary-foreground p-8 rounded-3xl shadow-lg active:scale-95 transition-transform"
        >
          <PlusCircle size={48} />
          <span className="text-xl font-bold">Novo Registro</span>
        </button>

        <button
          onClick={() => setLocation("/novo?camera=true")}
          className="flex flex-col items-center justify-center gap-3 bg-secondary text-secondary-foreground p-6 rounded-3xl shadow-sm border border-border active:scale-95 transition-transform"
        >
          <Camera size={36} className="text-primary" />
          <span className="text-lg font-bold">Registrar por Foto</span>
        </button>

        <button
          onClick={() => setLocation("/historico")}
          className="flex flex-col items-center justify-center gap-3 bg-card text-card-foreground p-6 rounded-3xl shadow-sm border border-border active:scale-95 transition-transform mt-4"
        >
          <ClipboardList size={36} className="text-muted-foreground" />
          <span className="text-lg font-bold">Histórico</span>
        </button>
      </div>
    </div>
  );
}
