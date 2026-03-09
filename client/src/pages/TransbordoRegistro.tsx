import React, { useState, useRef } from 'react';
import { useLocation, useRoute } from "wouter";
import { useAppContext } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TransbordoRegistro() {
  const [, params] = useRoute("/transbordo/:solvente/novo");
  const [, setLocation] = useLocation();
  
  const solvente = params?.solvente ? decodeURIComponent(params.solvente).charAt(0).toUpperCase() + decodeURIComponent(params.solvente).slice(1) : "Solvente";
  
  const { addRecord, currentUser } = useAppContext();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState("");
  const [tank, setTank] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  const handleSave = async () => {
    if (!quantity) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe a quantidade.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addRecord({
        user: currentUser!,
        product: solvente,
        quantity,
        nf: tank,
        operation: "Transbordo",
        category: "Transbordo",
        photoUrl: photo || undefined
      });

      toast({
        title: "Sucesso",
        description: "Transbordo registrado com sucesso!",
      });
      
      setLocation(`/transbordo/${solvente.toLowerCase()}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/30 p-4">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Registrar Transbordo</h2>
          <p className="text-muted-foreground text-sm">{solvente}</p>
        </div>

        <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm flex-1">
          <div className="space-y-2">
            <Label className="text-base text-muted-foreground">Quantidade (kg) <span className="text-destructive">*</span></Label>
            <Input 
              type="number" 
              inputMode="numeric"
              placeholder="Ex: 1500" 
              className="h-16 text-2xl font-bold rounded-xl"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-muted-foreground">Tanque de Origem</Label>
            <Input 
              type="text" 
              placeholder="Ex: T-01" 
              className="h-14 text-lg rounded-xl"
              value={tank}
              onChange={e => setTank(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-muted-foreground">Foto</Label>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleCapture}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-16 flex items-center justify-center rounded-xl border-2 transition-colors
                ${photo ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'}`}
            >
              <Camera size={28} />
            </button>
            {photo && (
              <div className="mt-2 relative rounded-xl overflow-hidden h-32 border">
                <img src={photo} alt="Transbordo" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button 
            onClick={() => setLocation(`/transbordo/${solvente.toLowerCase()}`)}
            className="flex-1 py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
          >
            <CheckCircle2 /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
