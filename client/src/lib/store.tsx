import React, { createContext, useContext, useState, useEffect } from "react";

export interface OperationRecord {
  id: string;
  date: string;
  user: string;
  motorista?: string;
  placa?: string;
  pedido?: string;
  product: string;
  quantity: string;
  nf?: string;
  operation: string;
  category: string;
  observacao?: string;
  photoUrl?: string;
}

export const PRODUCTS = [
  "Aguarrás",
  "Hexano",
  "Xileno",
  "Paraformol",
  "Ácido salicílico",
  "Paraterciário butilfenol",
  "Acetato de zinco",
  "Diacetona álcool",
  "Dibasic Ester (DBE)",
  "Ácido paratolueno",
  "Ácido sulfúrico",
  "Silane 1524",
  "Solvesso 100",
  "Solvesso 150",
  "Solvesso 200",
  "Solvesso 1500",
];

export const SOLVENTES = ["Aguarrás", "Hexano", "Xileno"];

export const RECEBIMENTO_PRODUCTS = PRODUCTS.filter(
  (p) => !SOLVENTES.includes(p),
);

export const RECEBIMENTO_TYPES = ["Recebimento UR3", "Recebimento para Tanque"];

export const EXPEDIÇÃO_TYPES = ["Carregamento de caminhão"];

interface AppContextType {
  currentUser: string | null;
  setCurrentUser: (user: string | null) => void;
  records: OperationRecord[];
  addRecord: (record: Omit<OperationRecord, "id" | "date">) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  clearAllRecords: () => Promise<void>;
  getRecordsByCategory: (category: string) => OperationRecord[];
  getTodayCount: () => number;
  refreshRecords: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("ur3_user");
  });

  const [records, setRecords] = useState<OperationRecord[]>([]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ur3_user", currentUser);
      refreshRecords();
    } else {
      localStorage.removeItem("ur3_user");
    }
  }, [currentUser]);

  // Sincroniza a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRecords();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshRecords = async () => {
    try {
      const response = await fetch("/api/operations");
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
    }
  };

  const addRecord = async (record: Omit<OperationRecord, "id" | "date">) => {
    try {
      const response = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error("Erro ao salvar");
      await refreshRecords();
    } catch (error) {
      console.error("Erro ao adicionar registro:", error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/operations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao deletar");
      await refreshRecords();
    } catch (error) {
      console.error("Erro ao deletar registro:", error);
      throw error;
    }
  };

  const clearAllRecords = async () => {
    try {
      const response = await fetch("/api/operations", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao limpar");
      await refreshRecords();
    } catch (error) {
      console.error("Erro ao limpar registros:", error);
      throw error;
    }
  };

  const getRecordsByCategory = (category: string) => {
    return records.filter((r) => r.category === category);
  };

  const getTodayCount = () => {
    const today = new Date().toISOString().split("T")[0];
    return records.filter((r) => r.date.startsWith(today)).length;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        records,
        addRecord,
        deleteRecord,
        clearAllRecords,
        getRecordsByCategory,
        getTodayCount,
        refreshRecords,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
