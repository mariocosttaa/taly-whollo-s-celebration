import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft, Heart } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("auth_token", response.data.access_token);
      toast({
        title: "Bem-vindo de volta!",
        description: "Login efetuado com sucesso.",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Acesso negado",
        description: "Verifique as suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-stone-50 via-cream to-primary/5">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23000' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }}
      />

      <Button
        variant="ghost"
        className="absolute top-4 left-4 md:top-8 md:left-8 text-stone-600 hover:text-stone-900 hover:bg-white/60 rounded-xl"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Site
      </Button>

      <Card className="w-full max-w-md relative border-stone-200/80 bg-white/95 shadow-elegant backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8 pt-10">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <div>
            <CardTitle className="font-heading text-2xl sm:text-3xl text-stone-800 tracking-tight">
              Área dos Noivos
            </CardTitle>
            <CardDescription className="text-stone-500 mt-2 max-w-xs mx-auto text-sm">
              Acesso reservado à administração da cerimónia. Utilize as suas credenciais para entrar.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">
                Email
              </label>
              <Input
                type="email"
                placeholder="exemplo@talywhollo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-stone-200 focus:ring-primary/20 focus:border-primary/40 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-stone-200 focus:ring-primary/20 focus:border-primary/40 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-xl shadow-lg shadow-stone-800/20 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "A entrar..." : "Entrar no Painel"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-stone-100 pt-6 pb-8">
          <p className="text-xs text-stone-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Sistema seguro · Taly & Whollo
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
