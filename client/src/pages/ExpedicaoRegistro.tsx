import React, { useState, useRef } from 'react';
import { useLocation } from "wouter";
import { useAppContext, PRODUCTS } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Camera, Search, X, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExpedicaoRegistro() {
  const [, setLocation] = useLocation();
  
  const { addRecord, currentUser } = useAppContext();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [nf, setNf] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = PRODUCTS.filter(p => 
    p.toLowerCase().includes(search.toLowerCase())
  );

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  const handleSave = () => {
    if (!product || !quantity) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha Produto e Quantidade.",
        variant: "destructive"
      });
      return;
    }

    addRecord({
      user: currentUser!,
      product,
      quantity,
      nf,
      operation: "Carregamento de caminhão",
      category: "Expedição",
      photoUrl: photo || undefined
    });

    toast({
      title: "Sucesso",
      description: "Carregamento registrado com sucesso!",
    });
    
    setLocation("/expedicao");
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="bg-card px-4 py-3 border-b">
        <div className="flex gap-2">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full">
        {step === 1 && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">1. Selecione o Produto</h2>
              <p className="text-muted-foreground text-sm">Pesquise ou selecione na lista</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                type="text" 
                placeholder="Buscar produto..." 
                className="pl-10 h-14 text-lg rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-card rounded-2xl border shadow-sm">
              <div className="divide-y">
                {filteredProducts.map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setProduct(p);
                      setStep(2);
                    }}
                    className="w-full text-left p-4 hover:bg-muted active:bg-primary/10 transition-colors flex justify-between items-center"
                  >
                    <span className="text-lg font-medium">{p}</span>
                    {product === p && <CheckCircle2 className="text-primary" />}
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhum produto encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 flex-1">
            <div>
              <h2 className="text-2xl font-bold mb-2">2. Detalhes ({product})</h2>
              <p className="text-muted-foreground text-sm">Informe a quantidade carregada</p>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm">
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
                <Label className="text-base text-muted-foreground">Número de Série/Nota</Label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Número" 
                    className="h-16 text-xl rounded-xl flex-1"
                    value={nf}
                    onChange={e => setNf(e.target.value)}
                  />
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
                    className={`h-16 w-16 flex items-center justify-center rounded-xl border-2 transition-colors
                      ${photo ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'}`}
                  >
                    <Camera size={28} />
                  </button>
                </div>
                {photo && (
                  <div className="mt-2 relative rounded-xl overflow-hidden h-32 border">
                    <img src={photo} alt="Documento" className="w-full h-full object-cover" />
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

            <div className="flex gap-3 pt-4 pb-8">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
              >
                Voltar
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 /> Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
