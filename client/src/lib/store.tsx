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
  addRecord: (record: Omit<OperationRecord, "id" | "date">) => void;
  deleteRecord: (id: string) => void;
  clearAllRecords: () => void;
  getRecordsByCategory: (category: string) => OperationRecord[];
  getTodayCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("ur3_user");
  });

  const [records, setRecords] = useState<OperationRecord[]>(() => {
    const saved = localStorage.getItem("ur3_records");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ur3_user", currentUser);
    } else {
      localStorage.removeItem("ur3_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ur3_records", JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<OperationRecord, "id" | "date">) => {
    const newRecord: OperationRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAllRecords = () => {
    setRecords([]);
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
