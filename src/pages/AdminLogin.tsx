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
import { Lock, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If already logged in, redirect to dashboard
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
        title: "Bem-vindo de volta! 👋",
        description: "Login efetuado com sucesso.",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Acesso Negado 🚫",
        description: "Verifique as suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 md:top-8 md:left-8 text-stone-600 hover:text-stone-900"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Site
      </Button>

      <Card className="w-full max-w-md shadow-lg border-stone-200">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-heading text-3xl text-stone-800">
            Área Restrita
          </CardTitle>
          <CardDescription className="text-stone-500 max-w-xs mx-auto">
            Apenas área administrativa com acesso autorizado a pessoas da
            administração da cerimónia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600 uppercase tracking-wide">
                Email
              </label>
              <Input
                type="email"
                placeholder="exemplo@talywhollo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-stone-50 border-stone-200 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600 uppercase tracking-wide">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-stone-50 border-stone-200 focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-stone-800 hover:bg-stone-900 text-white h-11"
              disabled={loading}
            >
              {loading ? "A entrar..." : "Entrar no Painel"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-stone-100 pt-6">
          <p className="text-xs text-stone-400 text-center">
            Sistema seguro Taly & Whollo
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
