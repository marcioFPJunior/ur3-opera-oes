import React from "react";
import { useLocation, useRoute } from "wouter";
import { useAppContext, OperationRecord, LCQ_STATUSES } from "@/lib/store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Clock,
  User,
  Package,
  FileText,
  Activity,
  Image as ImageIcon,
  FlaskConical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function LcqBadge({ status }: { status?: string }) {
  if (!status) return null;

  let colors = "bg-gray-100 text-gray-600 border-gray-300";
  if (status === "Aguardando LCQ") {
    colors = "bg-yellow-50 text-yellow-700 border-yellow-400";
  } else if (status === "Liberado LCQ") {
    colors = "bg-green-50 text-green-700 border-green-400";
  }

  return (
    <span
      data-testid={`badge-lcq-${status}`}
      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border ${colors}`}
    >
      <FlaskConical size={12} />
      {status}
    </span>
  );
}

export default function HistoricoCategory() {
  const [, params] = useRoute("/recebimento/historico");
  const [, paramsExp] = useRoute("/expedicao/historico");
  const [, paramsTrans] = useRoute("/transbordo/:solvente/historico");

  const { getRecordsByCategory, updateRecord } = useAppContext();
  const { toast } = useToast();

  let category = "";
  let title = "";

  if (params) {
    category = "Recebimento";
    title = "Histórico - Recebimento";
  } else if (paramsExp) {
    category = "Expedição";
    title = "Histórico - Expedição";
  } else if (paramsTrans) {
    const solvente = paramsTrans.solvente
      ? decodeURIComponent(paramsTrans.solvente).charAt(0).toUpperCase() +
        decodeURIComponent(paramsTrans.solvente).slice(1)
      : "Solvente";
    category = "Transbordo";
    title = `Histórico - ${solvente}`;
  }

  const records = getRecordsByCategory(category);
  const [selectedRecord, setSelectedRecord] =
    React.useState<OperationRecord | null>(null);

  const handleUpdateLcq = async (id: string, newStatus: string) => {
    try {
      await updateRecord(id, { statusLcq: newStatus });
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord({ ...selectedRecord, statusLcq: newStatus });
      }
      toast({
        title: "Status atualizado",
        description: `Status LCQ alterado para "${newStatus}".`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground px-1 mb-6">{title}</h2>

      {records.length === 0 ? (
        <div className="text-center p-10 bg-card rounded-3xl border border-dashed">
          <Activity
            className="mx-auto text-muted-foreground/30 mb-4"
            size={48}
          />
          <p className="text-muted-foreground font-medium">
            Nenhum registro encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const date = new Date(record.date);

            return (
              <button
                key={record.id}
                data-testid={`card-record-${record.id}`}
                onClick={() => setSelectedRecord(record)}
                className="w-full text-left bg-card p-4 rounded-2xl border shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg text-foreground">
                    {record.product}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-lg">
                    {record.quantity} kg
                  </div>
                </div>

                {record.statusLcq && (
                  <div className="mb-2">
                    <LcqBadge status={record.statusLcq} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Activity size={14} />
                    <span className="truncate">{record.operation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    <span className="truncate">{record.user}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Clock size={14} />
                    <span>
                      {format(date, "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>

                {record.photoUrl && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded">
                    <ImageIcon size={12} />
                    Com foto anexa
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!selectedRecord}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
      >
        <DialogContent className="w-[90vw] max-w-md rounded-3xl p-0 overflow-hidden">
          {selectedRecord && (
            <>
              <div className="bg-primary p-6 text-primary-foreground">
                <DialogTitle className="text-2xl font-bold mb-1">
                  {selectedRecord.product}
                </DialogTitle>
                <p className="text-primary-foreground/80 text-sm font-medium">
                  {format(
                    new Date(selectedRecord.date),
                    "dd 'de' MMMM, yyyy - HH:mm",
                    { locale: ptBR },
                  )}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Quantidade
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {selectedRecord.quantity}{" "}
                      <span className="text-sm font-normal">kg</span>
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Operador
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {selectedRecord.user}
                    </p>
                  </div>
                </div>

                {selectedRecord.statusLcq && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <FlaskConical size={14} />
                      Status LCQ
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {LCQ_STATUSES.map((status) => {
                        let colors =
                          "border-border bg-muted/30 text-muted-foreground";
                        if (selectedRecord.statusLcq === status) {
                          if (status === "Aguardando LCQ") {
                            colors =
                              "border-yellow-500 bg-yellow-500/10 text-yellow-700";
                          } else if (status === "Liberado LCQ") {
                            colors =
                              "border-green-500 bg-green-500/10 text-green-700";
                          } else {
                            colors =
                              "border-gray-400 bg-gray-100 text-gray-600";
                          }
                        }

                        return (
                          <button
                            key={status}
                            data-testid={`button-update-lcq-${status}`}
                            onClick={() =>
                              handleUpdateLcq(selectedRecord.id, status)
                            }
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all font-semibold text-sm flex items-center justify-between ${colors}`}
                          >
                            <span>{status}</span>
                            {selectedRecord.statusLcq === status && (
                              <FlaskConical size={16} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-3 bg-card border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Operação
                      </p>
                      <p className="font-semibold">
                        {selectedRecord.operation}
                      </p>
                    </div>
                  </div>

                  {selectedRecord.motorista && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Motorista
                        </p>
                        <p className="font-semibold">
                          {selectedRecord.motorista}
                          {selectedRecord.placa && ` • ${selectedRecord.placa}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedRecord.nf && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Referência
                        </p>
                        <p className="font-semibold">{selectedRecord.nf}</p>
                      </div>
                    </div>
                  )}

                  {selectedRecord.observacao && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Observação
                      </p>
                      <p className="text-sm">{selectedRecord.observacao}</p>
                    </div>
                  )}
                </div>

                {selectedRecord.photoUrl && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Foto</p>
                    <div className="rounded-xl overflow-hidden border">
                      <img
                        src={selectedRecord.photoUrl}
                        alt="Documento"
                        className="w-full h-auto object-contain bg-muted"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
