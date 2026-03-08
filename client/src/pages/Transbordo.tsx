import { useLocation } from "wouter";
import { SOLVENTES } from "@/lib/store";
import { ChevronRight } from "lucide-react";

export default function Transbordo() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Transbordo</h2>
        <p className="text-muted-foreground text-sm">Selecione o solvente</p>
      </div>

      <div className="grid gap-4">
        {SOLVENTES.map(solvente => (
          <button
            key={solvente}
            onClick={() => setLocation(`/transbordo/${solvente.toLowerCase()}`)}
            className="flex items-center justify-between bg-primary text-primary-foreground p-6 rounded-2xl shadow-sm active:scale-95 transition-transform"
          >
            <span className="font-bold text-lg">{solvente}</span>
            <ChevronRight size={28} />
          </button>
        ))}
      </div>
    </div>
  );
}
