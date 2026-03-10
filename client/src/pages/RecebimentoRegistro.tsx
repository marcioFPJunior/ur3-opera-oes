import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  useAppContext,
  RECEBIMENTO_TYPES,
  UR3_MATERIALS,
  SOLVENTES,
} from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RecebimentoRegistro() {
  const [, setLocation] = useLocation();
  const { addRecord, currentUser } = useAppContext();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [pedido, setPedido] = useState("");
  const [placa, setPlaca] = useState("");
  const [transportadora, setTransportadora] = useState("");
  const [recebimentoType, setRecebimentoType] = useState("");

  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedPackaging, setSelectedPackaging] = useState("");
  const [quantity, setQuantity] = useState("");

  const [selectedSolvente, setSelectedSolvente] = useState("");
  const [solventeQuantity, setSolventeQuantity] = useState("");
  const [sampleCollectionTime, setSampleCollectionTime] = useState("");

  const [photo, setPhoto] = useState<string | null>(null);
  const [observacao, setObservacao] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = recebimentoType === "Recebimento para Tanque" ? 5 : 5;
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

  const handleSave = async () => {
    if (!photo) {
      toast({
        title: "Foto obrigatória",
        description: "Tire uma foto da nota fiscal para finalizar.",
        variant: "destructive",
      });
      return;
    }

    const productName = recebimentoType === "Recebimento para Tanque" ? selectedSolvente : selectedMaterial;
    const qty = recebimentoType === "Recebimento para Tanque" ? solventeQuantity : quantity;
    const pkg = recebimentoType === "Recebimento para Tanque" ? "Tanque" : selectedPackaging;

    try {
      await addRecord({
        user: currentUser!,
        placa,
        pedido,
        transportadora,
        product: productName,
        quantity: qty,
        operation: recebimentoType,
        category: "Recebimento",
        photoUrl: photo,
        statusLcq: "Aguardando LCQ",
        observacao,
        packaging: pkg,
        sampleCollectionTime: recebimentoType === "Recebimento para Tanque" ? sampleCollectionTime : undefined,
      });

      toast({
        title: "Sucesso",
        description: "Recebimento registrado com sucesso!",
      });

      setLocation("/recebimento");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar. Tente novamente.",
        variant: "destructive",
      });
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
              <p className="text-muted-foreground text-sm">
                Preencha os dados do caminhão
              </p>
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
              <p className="text-muted-foreground text-sm">
                Selecione onde o produto será recebido
              </p>
            </div>

            <div className="space-y-3 bg-card p-5 rounded-2xl border shadow-sm flex-1">
              {RECEBIMENTO_TYPES.map((type) => (
                <button
                  key={type}
                  data-testid={`button-type-${type}`}
                  onClick={() => {
                    setRecebimentoType(type);
                    setSelectedMaterial("");
                    setSelectedPackaging("");
                    setQuantity("");
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
                  {recebimentoType === type && (
                    <CheckCircle2 size={24} className="text-primary" />
                  )}
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
                    toast({
                      title: "Selecione um tipo",
                      description: "Escolha UR3 ou Tanque.",
                      variant: "destructive",
                    });
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
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">3. Material e Quantidade</h2>
              <p className="text-muted-foreground text-sm">
                Selecione o material e informe a quantidade
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {UR3_MATERIALS.map((material) => {
                const isSelected = selectedMaterial === material.name;
                return (
                  <div
                    key={material.name}
                    className={`bg-card rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
                      isSelected ? "border-primary" : "border-border"
                    }`}
                  >
                    <button
                      data-testid={`button-material-${material.name}`}
                      onClick={() => {
                        setSelectedMaterial(material.name);
                        setSelectedPackaging(material.packaging);
                      }}
                      className="w-full text-left p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-lg">{material.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Embalagem: {material.packaging}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={24} className="text-primary shrink-0" />
                      )}
                    </button>

                    {isSelected && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">
                            Quantidade (kg) <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            data-testid="input-quantity"
                            type="number"
                            inputMode="numeric"
                            placeholder="Ex: 1500"
                            className="h-12 text-lg font-bold rounded-xl"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            autoFocus
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
              >
                Voltar
              </button>
              <button
                data-testid="button-next-step3"
                onClick={() => {
                  if (!selectedMaterial || !quantity) {
                    toast({
                      title: "Campos obrigatórios",
                      description: "Selecione um material e informe a quantidade.",
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

        {step === 3 && recebimentoType === "Recebimento para Tanque" && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">3. Solvente para Tanque</h2>
              <p className="text-muted-foreground text-sm">
                Selecione o solvente e informe a quantidade
              </p>
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
                  {selectedSolvente === solvente && (
                    <CheckCircle2 size={24} className="text-primary" />
                  )}
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
              <p className="text-muted-foreground text-sm">
                Informações adicionais (opcional)
              </p>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm flex-1">
              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Observação / Ocorrência
                </Label>
                <textarea
                  data-testid="input-observacao"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: material avariado, lacre rompido, etc."
                  className="w-full border-2 border-border rounded-xl p-3 focus:outline-none focus:border-primary resize-none text-lg"
                  rows={4}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
                <p className="text-sm text-yellow-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Status LCQ: Aguardando LCQ
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  O status será atualizado pelo laboratório após análise.
                </p>
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
              <p className="text-muted-foreground text-sm">
                Tire uma foto da NF para finalizar o registro
              </p>
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
                  className="w-full h-48 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-primary/50 rounded-2xl bg-primary/5 text-primary active:bg-primary/10 transition-colors"
                >
                  <Camera size={56} />
                  <span className="text-lg font-bold">Tirar Foto da NF</span>
                  <span className="text-sm text-muted-foreground">Toque para abrir a câmera</span>
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
                    <p className="text-muted-foreground text-xs">Material</p>
                    <p className="font-semibold">
                      {recebimentoType === "Recebimento para Tanque" ? selectedSolvente : selectedMaterial}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Quantidade</p>
                    <p className="font-semibold">
                      {recebimentoType === "Recebimento para Tanque" ? solventeQuantity : quantity} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Tipo</p>
                    <p className="font-semibold">{recebimentoType}</p>
                  </div>
                </div>
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
                disabled={!photo}
                className={`flex-[2] py-4 rounded-xl font-bold text-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg ${
                  photo
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
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
