import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  useAppContext,
  RECEBIMENTO_TYPES,
  RECEBIMENTO_PRODUCTS,
  SOLVENTES,
} from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Camera, Search, X, CheckCircle2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RecebimentoRegistro() {
  const [, setLocation] = useLocation();
  const { addRecord, currentUser } = useAppContext();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [motorista, setMotorista] = useState("");
  const [placa, setPlaca] = useState("");
  const [pedido, setPedido] = useState("");
  const [recebimentoType, setRecebimentoType] = useState("");
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [observacao, setObservacao] = useState("");
  const [nf, setNf] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const products =
    recebimentoType === "Recebimento para Tanque"
      ? SOLVENTES
      : RECEBIMENTO_PRODUCTS;

  const filteredProducts = products.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  const handleSave = async () => {
    if (!motorista || !placa || !product || !quantity) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha Motorista, Placa, Produto e Quantidade.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addRecord({
        user: currentUser!,
        motorista,
        placa,
        pedido,
        product,
        quantity,
        nf,
        observacao,
        operation: recebimentoType,
        category: "Recebimento",
        photoUrl: photo || undefined,
      });

      toast({
        title: "Sucesso",
        description: "Registro salvo com sucesso!",
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

  const progressSteps = [
    motorista ? "✓" : "1",
    placa ? "✓" : "2",
    recebimentoType ? "✓" : "3",
    product ? "✓" : "4",
    quantity ? "✓" : "5",
  ];

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="bg-card px-4 py-3 border-b">
        <div className="flex gap-1">
          {progressSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full ${
                idx < progressSteps.length - 1 ||
                (idx === progressSteps.length - 1 && quantity)
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full overflow-y-auto">
        {/* STEP 1: Motorista */}
        {step === 1 && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">1. Dados do Motorista</h2>
              <p className="text-muted-foreground text-sm">
                Informe o motorista e placa do caminhão
              </p>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm flex-1">
              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Motorista <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: João Silva"
                  className="h-14 text-lg rounded-xl"
                  value={motorista}
                  onChange={(e) => setMotorista(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Placa do Caminhão <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: ABC-1234"
                  className="h-14 text-lg rounded-xl uppercase"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Pedido ou Nota Fiscal
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: 45821"
                  className="h-14 text-lg rounded-xl"
                  value={pedido}
                  onChange={(e) => setPedido(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!motorista || !placa) {
                  toast({
                    title: "Campos obrigatórios",
                    description: "Preencha Motorista e Placa.",
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

        {/* STEP 2: Tipo de Recebimento */}
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
                  onClick={() => {
                    setRecebimentoType(type);
                    setSearch("");
                    setProduct("");
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bold text-lg flex items-center justify-between ${
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

        {/* STEP 3: Seleção de Produto/Solvente */}
        {step === 3 && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                3. Selecione o{" "}
                {recebimentoType === "Recebimento para Tanque"
                  ? "Solvente"
                  : "Produto"}
              </h2>
              <p className="text-muted-foreground text-sm">
                Pesquise ou selecione na lista
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Buscar..."
                className="pl-10 h-14 text-lg rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-card rounded-2xl border shadow-sm">
              <div className="divide-y">
                {filteredProducts.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setProduct(p);
                      setStep(4);
                    }}
                    className="w-full text-left p-4 hover:bg-muted active:bg-primary/10 transition-colors flex justify-between items-center"
                  >
                    <span className="text-lg font-medium">{p}</span>
                    {product === p && (
                      <CheckCircle2 className="text-primary" />
                    )}
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhum resultado encontrado.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="py-4 rounded-xl border-2 font-bold text-lg text-muted-foreground active:bg-muted"
            >
              Voltar
            </button>
          </div>
        )}

        {/* STEP 4: Quantidade e Observações */}
        {step === 4 && (
          <div className="space-y-6 flex-1">
            <div>
              <h2 className="text-2xl font-bold mb-2">4. Quantidade e Detalhes</h2>
              <p className="text-muted-foreground text-sm">
                Informe quantidade, observações e foto da NF
              </p>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border shadow-sm flex-1 overflow-y-auto">
              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Quantidade (kg) <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex: 1500"
                  className="h-14 text-lg font-bold rounded-xl"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Observação / Ocorrência
                </Label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: aguardando LCQ ou bomba parada"
                  className="w-full border-2 border-border rounded-xl p-3 focus:outline-none focus:border-primary resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base text-muted-foreground">
                  Nota Fiscal (NF) - Opcional
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Número da NF"
                    className="h-14 text-lg rounded-xl flex-1"
                    value={nf}
                    onChange={(e) => setNf(e.target.value)}
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
                    className={`h-14 w-14 flex items-center justify-center rounded-xl border-2 transition-colors ${
                      photo
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Camera size={24} />
                  </button>
                </div>

                {photo && (
                  <div className="mt-2 relative rounded-xl overflow-hidden h-32 border">
                    <img
                      src={photo}
                      alt="NF capture"
                      className="w-full h-full object-cover"
                    />
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
                onClick={() => setStep(3)}
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
