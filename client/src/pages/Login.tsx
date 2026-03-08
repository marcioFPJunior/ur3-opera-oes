import { useAppContext } from "@/lib/store";
import { useLocation } from "wouter";
import { User, HardHat } from "lucide-react";

export default function Login() {
  const { setCurrentUser } = useAppContext();
  const [, setLocation] = useLocation();

  const handleLogin = (name: string) => {
    setCurrentUser(name);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
            <HardHat size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">UR3</h1>
          <p className="text-muted-foreground font-medium">Controles de Operações</p>
        </div>

        <div className="space-y-4 pt-8">
          <h2 className="text-center text-lg font-semibold text-foreground mb-6">Selecione o Operador</h2>
          
          <button
            onClick={() => handleLogin("Márcio")}
            className="w-full flex items-center justify-center gap-4 bg-card border-2 border-primary text-primary py-5 rounded-2xl text-xl font-bold hover:bg-primary/5 active:bg-primary/10 transition-all active:scale-95 shadow-sm"
          >
            <User size={28} />
            Márcio
          </button>
          
          <button
            onClick={() => handleLogin("Carlos")}
            className="w-full flex items-center justify-center gap-4 bg-card border-2 border-primary text-primary py-5 rounded-2xl text-xl font-bold hover:bg-primary/5 active:bg-primary/10 transition-all active:scale-95 shadow-sm"
          >
            <User size={28} />
            Carlos
          </button>
        </div>
      </div>
    </div>
  );
}
