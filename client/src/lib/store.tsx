import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OperationRecord {
  id: string;
  date: string;
  user: string;
  product: string;
  quantity: string;
  nf: string;
  operation: string;
  photoUrl?: string;
}

export const PRODUCTS = [
  "Aguarrás", "Hexano", "Xileno", "Paraformol", "Ácido salicílico",
  "Paraterciário butilfenol", "Acetato de zinco", "Diacetona álcool",
  "Dibasic Ester (DBE)", "Ácido paratolueno", "Ácido sulfúrico",
  "Silane 1524", "Solvesso 100", "Solvesso 150", "Solvesso 200", "Solvesso 1500"
];

export const OPERATIONS = [
  "Recebimento UR3",
  "Recebimento tanque",
  "Carregamento",
  "Troca de bota"
];

interface AppContextType {
  currentUser: string | null;
  setCurrentUser: (user: string | null) => void;
  records: OperationRecord[];
  addRecord: (record: Omit<OperationRecord, 'id' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('ur3_user');
  });

  const [records, setRecords] = useState<OperationRecord[]>(() => {
    const saved = localStorage.getItem('ur3_records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ur3_user', currentUser);
    } else {
      localStorage.removeItem('ur3_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ur3_records', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<OperationRecord, 'id' | 'date'>) => {
    const newRecord: OperationRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, records, addRecord }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
