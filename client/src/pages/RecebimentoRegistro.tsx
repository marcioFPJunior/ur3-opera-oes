import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  useAppContext,
  RECEBIMENTO_TYPES,
  UR3_MATERIALS,
  SOLVENTES,
} from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, CheckCircle2, ChevronRight, Clock, FlaskConical, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmedItem {
  name: string;
  packaging: string;
  quantity: string;
}

export default function RecebimentoRegistro() {
  const [, setLocation] = useLocation();
  const { addRecord, currentUser } = useAppContext();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [pedido, setPedido] = useState("");
  const [placa, setPlaca] = useState("");
  const [transportadora, setTransportadora] = useState("");
  const [recebimentoType, setRecebimentoType] = useState("");

  const [confirmedItems, setConfirmedItems] = useState<ConfirmedItem[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState("");

  const [selectedSolvente, setSelectedSolvente] = useState("");
  const [solventeQuantity, setSolventeQuantity] = useState("");
  const [sampleCollectionTime, setSampleCollectionTime] = useState("");

  const [photo, setPhoto] = useState<string | null>(null);
  const [observacao, setObservacao] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;
  const currentProgress = step;

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmMaterial = (materialName: string, packaging: string) => {
    if (!editingQty || editingQty === "0") {
      toast({
        title: "Quantidade obrigatória",
        description: "Informe a quantidade antes de confirmar.",
        variant: "destructive",
      });
      return;
    }
    const existing = confirmedItems.findIndex((i) => i.name === materialName);
    if (existing >= 0) {
      const updated = [...confirmedItems];
      updated[existing] = { name: materialName, packaging, quantity: editingQty };
      setConfirmedItems(updated);
    } else {
      setConfirmedItems([...confirmedItems, { name: materialName, packaging, quantity: editingQty }]);
    }
    setEditingMaterial(null);
    setEditingQty("");
  };

  const handleRemoveItem = (materialName: string) => {
    setConfirmedItems(confirmedItems.filter((i) => i.name !== materialName));
  };

  const handleSave = async () => {
    if (recebimentoType === "Recebimento UR3") {
      if (confirmedItems.length === 0) {
        toast({
          title: "Nenhum material",
          description: "Adicione pelo menos um material com quantidade.",
          variant: "destructive",
        });
        return;
      }

      try {
        for (const item of confirmedItems) {
          await addRecord({
            user: currentUser!,
            placa,
            pedido,
            transportadora,
            product: item.name,
            quantity: item.quantity,
            operation: recebimentoType,
            category: "Recebimento",
            photoUrl: photo || undefined,
            statusLcq: "Aguardando LCQ",
            observacao,
            packaging: item.packaging,
          });
        }

        toast({
          title: "Sucesso",
          description: `${confirmedItems.length} material(is) registrado(s)!`,
        });
        setLocation("/recebimento");
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await addRecord({
          user: currentUser!,
          placa,
          pedido,
          transportadora,
          product: selectedSolvente,
          quantity: solventeQuantity,
          operation: recebimentoType,
          category: "Recebimento",
          photoUrl: photo || undefined,
          statusLcq: "Aguardando LCQ",
          observacao,
          packaging: "Tanque",
          sampleCollectionTime: sampleCollectionTime || undefined,
        });

        toast({
          title: "Sucesso",
          description: "Recebimento para tanque registrado!",
        });
        setLocation("/recebimento");
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="bg-card px-4 py-3 border-b">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full ${idx < currentProgress ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full overflow-y-auto">

        {step === 1 && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">1. Identificação do Caminhão</h2>
              <p className="text-muted-foreground text-sm">Preencha os dados do caminhão</p>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm flex-1">
              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Pedido ou Nota Fiscal <span className="text-destructive">*</span>
                </Label>
                <Input
                  data-testid="input-pedido"
                  type="text"
                  placeholder="Ex: 45821"
                  className="h-14 text-lg rounded-xl"
                  value={pedido}
                  onChange={(e) => setPedido(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Placa do Caminhão <span className="text-destructive">*</span>
                </Label>
                <Input
                  data-testid="input-placa"
                  type="text"
                  placeholder="Ex: ABC-1234"
                  className="h-14 text-lg rounded-xl uppercase"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Transportadora <span className="text-destructive">*</span>
                </Label>
                <Input
                  data-testid="input-transportadora"
                  type="text"
                  placeholder="Ex: Transportes Silva"
                  className="h-14 text-lg rounded-xl"
                  value={transportadora}
                  onChange={(e) => setTransportadora(e.target.value)}
                />
              </div>
            </div>

            <button
              data-testid="button-next-step1"
              onClick={() => {
                if (!pedido || !placa || !transportadora) {
                  toast({
                    title: "Campos obrigatórios",
                    description: "Preencha Pedido/NF, Placa e Transportadora.",
                    variant: "destructive",
                  });
                  return;
                }
                setStep(2);
              }}
              className="py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
            >
              Próximo <ChevronRight size={24} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">2. Tipo de Recebimento</h2>
              <p className="text-muted-foreground text-sm">Selecione onde o produto será recebido</p>
            </div>

            <div className="space-y-3 bg-card p-5 rounded-2xl border shadow-sm flex-1">
              {RECEBIMENTO_TYPES.map((type) => (
                <button
                  key={type}
                  data-testid={`button-type-${type}`}
                  onClick={() => {
                    setRecebimentoType(type);
                    setConfirmedItems([]);
                    setEditingMaterial(null);
                    setEditingQty("");
                    setSelectedSolvente("");
                    setSolventeQuantity("");
                  }}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all font-bold text-lg flex items-center justify-between ${
                    recebimentoType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/50 text-foreground hover:border-primary/50"
                  }`}
                >
                  <span>{type}</span>
                  {recebimentoType === type && <CheckCircle2 size={24} className="text-primary" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
              >
                Voltar
              </button>
              <button
                data-testid="button-next-step2"
                onClick={() => {
                  if (!recebimentoType) {
                    toast({ title: "Selecione um tipo", description: "Escolha UR3 ou Tanque.", variant: "destructive" });
                    return;
                  }
                  setStep(3);
                }}
                className="flex-[2] py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                Próximo <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && recebimentoType === "Recebimento UR3" && (
          <div className="space-y-4 flex-1 flex flex-col">
            <div>
              <h2 className="text-xl font-bold mb-1">3. Materiais e Quantidades</h2>
              <p className="text-muted-foreground text-xs">
                Toque no material, digite a quantidade e clique OK
              </p>
            </div>

            {confirmedItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Adicionados ({confirmedItems.length})
                </p>
                <div className="space-y-1.5">
                  {confirmedItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between bg-green-50 border border-green-300 rounded-xl px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-green-900 truncate">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-700 font-semibold">{item.quantity} kg</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-300">
                            <FlaskConical size={9} />
                            Aguardando LCQ
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.name)}
                        className="ml-2 p-1 text-red-500 hover:bg-red-100 rounded-lg shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {UR3_MATERIALS.map((material) => {
                  const isConfirmed = confirmedItems.some((i) => i.name === material.name);
                  const isEditing = editingMaterial === material.name;

                  if (isConfirmed && !isEditing) return null;

                  return (
                    <div key={material.name} className={`${isEditing ? "col-span-2" : ""}`}>
                      {!isEditing ? (
                        <button
                          data-testid={`button-material-${material.name}`}
                          onClick={() => {
                            setEditingMaterial(material.name);
                            setEditingQty("");
                          }}
                          className="w-full bg-card rounded-xl border border-border shadow-sm p-3 text-left active:scale-95 transition-transform hover:border-primary/50"
                        >
                          <p className="font-bold text-xs leading-tight">{material.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{material.packaging}</p>
                        </button>
                      ) : (
                        <div className="bg-card rounded-xl border-2 border-primary shadow-md p-3 space-y-2">
                          <div>
                            <p className="font-bold text-sm">{material.name}</p>
                            <p className="text-[10px] text-muted-foreground">{material.packaging}</p>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              data-testid={`input-qty-${material.name}`}
                              type="number"
                              inputMode="numeric"
                              placeholder="Qtd (kg)"
                              className="h-10 text-sm font-bold rounded-lg flex-1"
                              value={editingQty}
                              onChange={(e) => setEditingQty(e.target.value)}
                              autoFocus
                            />
                            <button
                              data-testid={`button-ok-${material.name}`}
                              onClick={() => handleConfirmMaterial(material.name, material.packaging)}
                              className="h-10 px-4 bg-green-600 text-white font-bold rounded-lg active:scale-95 transition-transform flex items-center gap-1"
                            >
                              <Check size={16} />
                              OK
                            </button>
                          </div>
                          <button
                            onClick={() => { setEditingMaterial(null); setEditingQty(""); }}
                            className="text-xs text-muted-foreground underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl border-2 font-bold text-base text-muted-foreground active:bg-muted"
              >
                Voltar
              </button>
              <button
                data-testid="button-next-step3"
                onClick={() => {
                  if (confirmedItems.length === 0) {
                    toast({
                      title: "Nenhum material",
                      description: "Adicione pelo menos um material com quantidade.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setStep(4);
                }}
                className="flex-[2] py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                Próximo <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && recebimentoType === "Recebimento para Tanque" && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">3. Solvente para Tanque</h2>
              <p className="text-muted-foreground text-sm">Selecione o solvente e informe a quantidade</p>
            </div>

            <div className="space-y-3 bg-card p-5 rounded-2xl border shadow-sm">
              {SOLVENTES.map((solvente) => (
                <button
                  key={solvente}
                  data-testid={`button-solvente-${solvente}`}
                  onClick={() => setSelectedSolvente(solvente)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bold text-lg flex items-center justify-between ${
                    selectedSolvente === solvente
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/50 text-foreground"
                  }`}
                >
                  <span>{solvente}</span>
                  {selectedSolvente === solvente && <CheckCircle2 size={24} className="text-primary" />}
                </button>
              ))}
            </div>

            {selectedSolvente && (
              <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm">
                <div className="space-y-2">
                  <Label className="text-base text-muted-foreground">
                    Quantidade (kg) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-testid="input-solvente-quantity"
                    type="number"
                    inputMode="numeric"
                    placeholder="Ex: 5000"
                    className="h-14 text-lg font-bold rounded-xl"
                    value={solventeQuantity}
                    onChange={(e) => setSolventeQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base text-muted-foreground flex items-center gap-2">
                    <Clock size={16} />
                    Hora da Coleta de Amostra
                  </Label>
                  <Input
                    data-testid="input-sample-time"
                    type="time"
                    className="h-14 text-lg rounded-xl"
                    value={sampleCollectionTime}
                    onChange={(e) => setSampleCollectionTime(e.target.value)}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 flex items-center gap-2">
                  <FlaskConical size={16} className="text-yellow-700" />
                  <span className="text-sm font-semibold text-yellow-800">Status: Aguardando LCQ</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2 mt-auto">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
              >
                Voltar
              </button>
              <button
                data-testid="button-next-step3-tanque"
                onClick={() => {
                  if (!selectedSolvente || !solventeQuantity) {
                    toast({
                      title: "Campos obrigatórios",
                      description: "Selecione o solvente e informe a quantidade.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setStep(4);
                }}
                className="flex-[2] py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                Próximo <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">4. Observações</h2>
              <p className="text-muted-foreground text-sm">Informações adicionais (opcional)</p>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm flex-1">
              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">Observação / Ocorrência</Label>
                <textarea
                  data-testid="input-observacao"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: material avariado, lacre rompido, etc."
                  className="w-full border-2 border-border rounded-xl p-3 focus:outline-none focus:border-primary resize-none text-lg"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
              >
                Voltar
              </button>
              <button
                data-testid="button-next-step4"
                onClick={() => setStep(5)}
                className="flex-[2] py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                Próximo <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">5. Foto da Nota Fiscal</h2>
              <p className="text-muted-foreground text-sm">Foto opcional - pode finalizar sem ela</p>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm flex-1">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleCapture}
              />

              {!photo ? (
                <button
                  data-testid="button-take-photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/50 rounded-2xl bg-primary/5 text-primary active:bg-primary/10 transition-colors"
                >
                  <Camera size={48} />
                  <span className="text-base font-bold">Tirar Foto da NF (opcional)</span>
                  <span className="text-xs text-muted-foreground">Toque para abrir a câmera</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-primary">
                    <img
                      src={photo}
                      alt="Nota Fiscal"
                      className="w-full h-auto max-h-64 object-contain bg-muted"
                    />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full active:scale-95"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl">
                    <CheckCircle2 size={20} />
                    <span className="font-semibold text-sm">Foto capturada com sucesso</span>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-bold text-foreground">Resumo da operação:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Pedido/NF</p>
                    <p className="font-semibold">{pedido}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Placa</p>
                    <p className="font-semibold">{placa}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Transportadora</p>
                    <p className="font-semibold">{transportadora}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Tipo</p>
                    <p className="font-semibold">{recebimentoType}</p>
                  </div>
                </div>
                {recebimentoType === "Recebimento UR3" && confirmedItems.length > 0 && (
                  <div className="pt-2 border-t mt-2">
                    <p className="text-muted-foreground text-xs mb-1">Materiais:</p>
                    {confirmedItems.map((item) => (
                      <p key={item.name} className="text-xs font-semibold">
                        {item.name} — {item.quantity} kg
                      </p>
                    ))}
                  </div>
                )}
                {recebimentoType === "Recebimento para Tanque" && (
                  <div className="pt-2 border-t mt-2">
                    <p className="text-xs font-semibold">{selectedSolvente} — {solventeQuantity} kg</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pb-8">
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
              >
                Voltar
              </button>
              <button
                data-testid="button-save"
                onClick={handleSave}
                className="flex-[2] py-4 rounded-xl bg-green-600 text-white font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 /> Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
