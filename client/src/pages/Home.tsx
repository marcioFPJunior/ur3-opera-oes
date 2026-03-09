import { useLocation } from "wouter";
import { useAppContext } from "@/lib/store";
import { TrendingUp, Truck, Droplet, Settings } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { currentUser, getTodayCount } = useAppContext();

  const todayCount = getTodayCount();

  return (
    <div className="p-4 space-y-6">
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          Operador Logado
        </p>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-foreground">{currentUser}</h2>
          <div className="text-right">
            <p className="text-3xl font-black text-primary leading-none">
              {todayCount}
            </p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
              Registros Hoje
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 mt-8">
        <button
          onClick={() => setLocation("/recebimento")}
          className="flex flex-col items-center justify-center gap-3 bg-primary text-primary-foreground p-8 rounded-3xl shadow-lg active:scale-95 transition-transform"
        >
          <TrendingUp size={48} />
          <span className="text-xl font-bold">Recebimento</span>
        </button>

        <button
          onClick={() => setLocation("/expedicao")}
          className="flex flex-col items-center justify-center gap-3 bg-primary text-primary-foreground p-8 rounded-3xl shadow-lg active:scale-95 transition-transform"
        >
          <Truck size={48} />
          <span className="text-xl font-bold">Expedição</span>
        </button>

        <button
          onClick={() => setLocation("/transbordo")}
          className="flex flex-col items-center justify-center gap-3 bg-primary text-primary-foreground p-8 rounded-3xl shadow-lg active:scale-95 transition-transform"
        >
          <Droplet size={48} />
          <span className="text-xl font-bold">Transbordo</span>
        </button>
      </div>

      {currentUser === "Márcio" && (
        <button
          onClick={() => setLocation("/admin")}
          className="w-full flex items-center justify-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 border-2 border-yellow-500 text-yellow-900 p-4 rounded-2xl font-bold active:scale-95 transition-transform mt-6"
        >
          <Settings size={20} />
          Painel de Administração
        </button>
      )}
    </div>
  );
}
