import { useState } from "react";
import { useAppContext } from "@/lib/store";
import { useLocation } from "wouter";
import { User, HardHat, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function Login() {
  const { setCurrentUser } = useAppContext();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginAnderson = () => {
    setCurrentUser("Anderson");
    setLocation("/");
  };

  const handleLoginMarcio = () => {
    setShowPasswordInput(true);
  };

  const handleSubmitPassword = () => {
    if (password === "680527") {
      setCurrentUser("Márcio");
      setLocation("/");
    } else {
      toast({
        title: "Senha incorreta",
        description: "A senha informada está errada. Tente novamente.",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmitPassword();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
            <HardHat size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight" data-testid="text-app-title">UR3</h1>
          <p className="text-muted-foreground font-medium">Controles de Operações</p>
        </div>

        {!showPasswordInput ? (
          <div className="space-y-4 pt-8">
            <h2 className="text-center text-lg font-semibold text-foreground mb-6">Selecione o Operador</h2>

            <button
              data-testid="button-login-marcio"
              onClick={handleLoginMarcio}
              className="w-full flex items-center justify-center gap-4 bg-card border-2 border-primary text-primary py-5 rounded-2xl text-xl font-bold hover:bg-primary/5 active:bg-primary/10 transition-all active:scale-95 shadow-sm"
            >
              <Lock size={24} />
              Márcio (Administrador)
            </button>

            <button
              data-testid="button-login-anderson"
              onClick={handleLoginAnderson}
              className="w-full flex items-center justify-center gap-4 bg-card border-2 border-primary text-primary py-5 rounded-2xl text-xl font-bold hover:bg-primary/5 active:bg-primary/10 transition-all active:scale-95 shadow-sm"
            >
              <User size={28} />
              Anderson
            </button>
          </div>
        ) : (
          <div className="space-y-6 pt-8">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Lock size={28} className="text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Acesso Márcio</h2>
              <p className="text-sm text-muted-foreground mt-1">Digite a senha para continuar</p>
            </div>

            <div className="relative">
              <Input
                data-testid="input-password"
                type={showPassword ? "text" : "password"}
                inputMode="numeric"
                placeholder="Digite a senha"
                className="h-16 text-2xl text-center font-bold rounded-xl tracking-[0.3em] pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <button
              data-testid="button-submit-password"
              onClick={handleSubmitPassword}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xl active:scale-95 transition-transform shadow-lg"
            >
              Entrar
            </button>

            <button
              onClick={() => {
                setShowPasswordInput(false);
                setPassword("");
              }}
              className="w-full py-3 rounded-xl border-2 border-border font-bold text-muted-foreground active:bg-muted"
            >
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
