import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserPlus } from "lucide-react";

const AdminUsers = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", { email, password });
      toast({
        title: "Utilizador criado!",
        description: `O administrador ${email} foi adicionado com sucesso.`,
      });
      setEmail("");
      setPassword("");
    } catch (error) {
      toast({
        title: "Erro ao criar",
        description: "Não foi possível criar o utilizador. Verifique os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl text-stone-800">
            Gestão de Utilizadores
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Adicionar Novo Administrador
            </CardTitle>
            <CardDescription>
              Crie uma conta para outro membro da organização aceder ao painel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600">Email</label>
                <Input
                  type="email"
                  placeholder="novo.admin@talywhollo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600">Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "A criar..." : "Criar Administrador"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
