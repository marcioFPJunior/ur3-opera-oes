import { useState } from "react";
import { useLocation } from "wouter";
import { useAppContext, RECEBIMENTO_TYPES, SOLVENTES, RECEBIMENTO_PRODUCTS, PRODUCTS, LCQ_STATUSES } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Trash2, RotateCcw, Plus, X, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LcqBadge({ status }: { status?: string }) {
  if (!status) return null;

  let colors = "bg-gray-100 text-gray-600";
  if (status === "Aguardando LCQ") {
    colors = "bg-yellow-50 text-yellow-700";
  } else if (status === "Liberado LCQ") {
    colors = "bg-green-50 text-green-700";
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${colors}`}>
      <FlaskConical size={10} />
      {status}
    </span>
  );
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { records, deleteRecord, clearAllRecords, addRecord, updateRecord, currentUser } =
    useAppContext();
  const { toast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newRecord, setNewRecord] = useState({
    motorista: "",
    placa: "",
    pedido: "",
    product: "",
    quantity: "",
    operation: "",
    observacao: "",
    category: "Recebimento",
    statusLcq: "Aguardando LCQ",
  });

  const filteredRecords = records.filter(
    (r) =>
      r.motorista?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.placa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClearAll = async () => {
    if (
      confirm(
        "⚠️ Tem certeza que deseja APAGAR TODOS OS REGISTROS? Essa ação não pode ser desfeita!",
      )
    ) {
      try {
        await clearAllRecords();
        toast({
          title: "Limpeza Completa",
          description: "Todos os registros foram apagados.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível limpar os registros.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Deseja deletar este registro?")) {
      try {
        await deleteRecord(id);
        toast({
          title: "Registro deletado",
          description: "O registro foi removido com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível deletar o registro.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddRecord = async () => {
    if (!newRecord.motorista || !newRecord.product || !newRecord.quantity) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha Motorista, Produto e Quantidade.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addRecord({
        user: currentUser!,
        motorista: newRecord.motorista,
        placa: newRecord.placa,
        pedido: newRecord.pedido,
        product: newRecord.product,
        quantity: newRecord.quantity,
        operation: newRecord.operation || "Recebimento UR3",
        category: newRecord.category,
        observacao: newRecord.observacao,
        statusLcq: newRecord.category === "Recebimento" ? newRecord.statusLcq : undefined,
      });

      toast({
        title: "Sucesso",
        description: "Registro adicionado manualmente.",
      });

      setNewRecord({
        motorista: "",
        placa: "",
        pedido: "",
        product: "",
        quantity: "",
        operation: "",
        observacao: "",
        category: "Recebimento",
        statusLcq: "Aguardando LCQ",
      });
      setShowAddForm(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o registro.",
        variant: "destructive",
      });
    }
  };

  const handleQuickLcqUpdate = async (id: string, newStatus: string) => {
    try {
      await updateRecord(id, { statusLcq: newStatus });
      toast({
        title: "Status atualizado",
        description: `LCQ alterado para "${newStatus}".`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-2xl p-4">
        <h2 className="text-2xl font-bold text-yellow-900 mb-2" data-testid="text-admin-title">
          Painel de Administração
        </h2>
        <p className="text-yellow-800 text-sm">
          {records.length} registros no total
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          data-testid="input-admin-search"
          type="text"
          placeholder="Buscar por motorista, placa ou produto..."
          className="h-12 text-lg rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!showAddForm && (
        <div className="flex gap-2">
          <button
            data-testid="button-add-record"
            onClick={() => setShowAddForm(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white p-4 rounded-xl font-bold active:scale-95"
          >
            <Plus size={20} />
            Adicionar Registro
          </button>
          <button
            data-testid="button-clear-all"
            onClick={handleClearAll}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white p-4 rounded-xl font-bold active:scale-95"
          >
            <RotateCcw size={20} />
            Limpar Tudo
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-card p-5 rounded-2xl border-2 border-blue-500 space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Adicionar Novo Registro</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 hover:bg-muted rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <Label className="text-sm">Motorista *</Label>
            <Input
              type="text"
              placeholder="Ex: João Silva"
              value={newRecord.motorista}
              onChange={(e) =>
                setNewRecord({ ...newRecord, motorista: e.target.value })
              }
              className="h-10 text-sm"
            />
          </div>

          <div>
            <Label className="text-sm">Placa</Label>
            <Input
              type="text"
              placeholder="Ex: ABC-1234"
              value={newRecord.placa}
              onChange={(e) =>
                setNewRecord({ ...newRecord, placa: e.target.value.toUpperCase() })
              }
              className="h-10 text-sm uppercase"
            />
          </div>

          <div>
            <Label className="text-sm">Pedido/NF</Label>
            <Input
              type="text"
              placeholder="Ex: 45821"
              value={newRecord.pedido}
              onChange={(e) =>
                setNewRecord({ ...newRecord, pedido: e.target.value })
              }
              className="h-10 text-sm"
            />
          </div>

          <div>
            <Label className="text-sm">Tipo *</Label>
            <select
              value={newRecord.operation}
              onChange={(e) =>
                setNewRecord({ ...newRecord, operation: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border-2 border-border text-sm"
            >
              <option value="">Selecione...</option>
              {RECEBIMENTO_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm">Produto *</Label>
            <select
              value={newRecord.product}
              onChange={(e) =>
                setNewRecord({ ...newRecord, product: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border-2 border-border text-sm"
            >
              <option value="">Selecione...</option>
              {newRecord.operation === "Recebimento para Tanque"
                ? SOLVENTES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))
                : RECEBIMENTO_PRODUCTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <Label className="text-sm">Quantidade (kg) *</Label>
            <Input
              type="number"
              placeholder="Ex: 1500"
              value={newRecord.quantity}
              onChange={(e) =>
                setNewRecord({ ...newRecord, quantity: e.target.value })
              }
              className="h-10 text-sm"
            />
          </div>

          <div>
            <Label className="text-sm">Status LCQ</Label>
            <select
              value={newRecord.statusLcq}
              onChange={(e) =>
                setNewRecord({ ...newRecord, statusLcq: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border-2 border-border text-sm"
            >
              {LCQ_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm">Observação</Label>
            <textarea
              placeholder="Observações adicionais"
              value={newRecord.observacao}
              onChange={(e) =>
                setNewRecord({ ...newRecord, observacao: e.target.value })
              }
              className="w-full border-2 border-border rounded-lg p-2 text-sm resize-none"
              rows={2}
            />
          </div>

          <button
            onClick={handleAddRecord}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-bold active:scale-95"
          >
            Adicionar
          </button>
        </div>
      )}

      <div className="space-y-2">
        {filteredRecords.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum registro encontrado
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              data-testid={`admin-card-${record.id}`}
              className="bg-card p-4 rounded-xl border flex justify-between items-start gap-4"
            >
              <div className="flex-1 text-sm space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold">{record.product}</p>
                  <LcqBadge status={record.statusLcq} />
                </div>
                <p className="text-muted-foreground text-xs">
                  {record.motorista || "N/A"} • {record.placa || "N/A"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {record.quantity} kg • {record.operation}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(record.date).toLocaleString("pt-BR")}
                </p>
                {record.statusLcq && record.statusLcq !== "Não se aplica" && (
                  <div className="flex gap-1 pt-1">
                    {LCQ_STATUSES.filter((s) => s !== record.statusLcq).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleQuickLcqUpdate(record.id, status)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border active:scale-95 ${
                          status === "Liberado LCQ"
                            ? "border-green-400 text-green-700 bg-green-50"
                            : status === "Aguardando LCQ"
                              ? "border-yellow-400 text-yellow-700 bg-yellow-50"
                              : "border-gray-300 text-gray-600 bg-gray-50"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                data-testid={`button-delete-${record.id}`}
                onClick={() => handleDeleteRecord(record.id)}
                className="p-2 hover:bg-red-500/20 text-red-600 rounded-lg active:scale-95"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
