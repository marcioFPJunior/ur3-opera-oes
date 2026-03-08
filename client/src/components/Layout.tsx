import { ReactNode } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAppContext } from "@/lib/store";

interface LayoutProps {
  children: ReactNode;
  backTo?: string;
}

export default function Layout({ children, backTo }: LayoutProps) {
  const [, setLocation] = useLocation();
  const { setCurrentUser } = useAppContext();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {backTo && (
              <button 
                onClick={() => setLocation(backTo)}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">
                CONTROLES OPERAÇÕES UR3
              </h1>
              <p className="text-xs text-primary-foreground/80 font-medium">
                Recebimento • Transbordo • Carregamento
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setCurrentUser(null);
            }}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
            aria-label="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-8">
        {children}
      </main>
    </div>
  );
}
