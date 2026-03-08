import { useLocation, useRoute } from "wouter";
import { useAppContext } from "@/lib/store";
import { Plus, History, Droplet, Gauge } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TransbordoProduct() {
  const [, params] = useRoute("/transbordo/:solvente");
  const [, setLocation] = useLocation();
  const { getRecordsByCategory } = useAppContext();
  
  const solvente = params?.solvente ? decodeURIComponent(params.solvente).charAt(0).toUpperCase() + decodeURIComponent(params.solvente).slice(1) : "Solvente";
  const records = getRecordsByCategory("Transbordo").filter(r => r.product === solvente);
  
  const [showConverter, setShowConverter] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [kgValue, setKgValue] = useState("");
  const [litersValue, setLitersValue] = useState("");

  // Approximate conversion: 1 liter = 0.85 kg for most solvents
  const kgToLiters = (kg: number) => (kg / 0.85).toFixed(2);
  const litersToKg = (liters: number) => (liters * 0.85).toFixed(2);

  const handleKgChange = (e: string) => {
    setKgValue(e);
    if (e) {
      setLitersValue(kgToLiters(parseFloat(e)));
    }
  };

  const handleLitersChange = (e: string) => {
    setLitersValue(e);
    if (e) {
      setKgValue(litersToKg(parseFloat(e)));
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">{solvente}</h2>
        <p className="text-muted-foreground text-sm">Operações de transbordo</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => setLocation(`/transbordo/${solvente.toLowerCase()}/novo`)}
          className="flex flex-col items-center justify-center gap-2 bg-primary text-primary-foreground p-6 rounded-2xl shadow-sm active:scale-95 transition-transform"
        >
          <Plus size={32} />
          <span className="font-bold">Registrar Transbordo</span>
        </button>

        <button
          onClick={() => setShowCalculator(true)}
          className="flex flex-col items-center justify-center gap-2 bg-secondary text-secondary-foreground border-2 border-border p-6 rounded-2xl shadow-sm active:scale-95 transition-transform"
        >
          <Gauge size={32} />
          <span className="font-bold">Calculadora de Tanque</span>
        </button>

        <button
          onClick={() => setShowConverter(true)}
          className="flex flex-col items-center justify-center gap-2 bg-secondary text-secondary-foreground border-2 border-border p-6 rounded-2xl shadow-sm active:scale-95 transition-transform"
        >
          <Droplet size={32} />
          <span className="font-bold">Kg ↔ Litros</span>
        </button>

        <button
          onClick={() => setLocation(`/transbordo/${solvente.toLowerCase()}/historico`)}
          className="flex flex-col items-center justify-center gap-2 bg-card text-card-foreground border-2 border-border p-6 rounded-2xl shadow-sm active:scale-95 transition-transform mt-4"
        >
          <History size={32} className="text-muted-foreground" />
          <span className="font-bold">Histórico ({records.length})</span>
        </button>
      </div>

      {/* Converter Dialog */}
      <Dialog open={showConverter} onOpenChange={setShowConverter}>
        <DialogContent className="w-[90vw] max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Conversor Kg ↔ Litros</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quilogramas (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Digite o valor em kg"
                value={kgValue}
                onChange={e => handleKgChange(e.target.value)}
                className="w-full p-4 text-xl border-2 border-border rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center justify-center text-muted-foreground">
              <div className="h-px flex-1 bg-border"></div>
              <span className="px-3">↕</span>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Litros (L)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Digite o valor em litros"
                value={litersValue}
                onChange={e => handleLitersChange(e.target.value)}
                className="w-full p-4 text-xl border-2 border-border rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              *Conversão aproximada: 1 L = 0,85 kg
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="w-[90vw] max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Calculadora de Tanque</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <p className="text-sm text-muted-foreground">
              Use esta calculadora para determinar a capacidade e quantidade de {solvente} necessária.
            </p>
            <div className="space-y-4 bg-muted/30 p-4 rounded-xl">
              <div>
                <label className="text-sm font-medium">Diâmetro do Tanque (cm)</label>
                <input type="number" placeholder="Ex: 100" className="w-full mt-1 p-3 border-2 border-border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium">Altura do Tanque (cm)</label>
                <input type="number" placeholder="Ex: 150" className="w-full mt-1 p-3 border-2 border-border rounded-lg" />
              </div>
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Capacidade aproximada</p>
                <p className="text-2xl font-bold text-primary">— L</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
