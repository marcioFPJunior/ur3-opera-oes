import React from 'react';
import { useAppContext, OperationRecord } from "@/lib/store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User, Package, FileText, Activity, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Historico() {
  const { records } = useAppContext();
  const [selectedRecord, setSelectedRecord] = React.useState<OperationRecord | null>(null);

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground px-1 mb-6">Histórico de Operações</h2>
      
      {records.length === 0 ? (
        <div className="text-center p-10 bg-card rounded-3xl border border-dashed">
          <Activity className="mx-auto text-muted-foreground/30 mb-4" size={48} />
          <p className="text-muted-foreground font-medium">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(record => {
            const date = new Date(record.date);
            
            return (
              <button
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="w-full text-left bg-card p-4 rounded-2xl border shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg text-foreground">{record.product}</span>
                  <div className="flex items-center gap-1 text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-lg">
                    {record.quantity} kg
                  </div>
                </div>
                
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
                    <span>{format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
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

      {/* Detail Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="w-[90vw] max-w-md rounded-3xl p-0 overflow-hidden">
          {selectedRecord && (
            <>
              <div className="bg-primary p-6 text-primary-foreground">
                <DialogTitle className="text-2xl font-bold mb-1">{selectedRecord.product}</DialogTitle>
                <p className="text-primary-foreground/80 text-sm font-medium">
                  {format(new Date(selectedRecord.date), "dd 'de' MMMM, yyyy - HH:mm", { locale: ptBR })}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Quantidade</p>
                    <p className="text-xl font-bold text-foreground">{selectedRecord.quantity} <span className="text-sm font-normal">kg</span></p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Operador</p>
                    <p className="text-lg font-bold text-foreground">{selectedRecord.user}</p>
                  </div>
                </div>

                <div className="space-y-3 bg-card border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Operação</p>
                      <p className="font-semibold">{selectedRecord.operation}</p>
                    </div>
                  </div>
                  
                  {selectedRecord.nf && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Nota Fiscal / Lote</p>
                        <p className="font-semibold">{selectedRecord.nf}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedRecord.photoUrl && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Foto do Documento</p>
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
