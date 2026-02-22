import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserPlus, Trash2, Mail, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: number;
  email: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching users", error);
      toast({ title: "Erro", description: "Não foi possível carregar os utilizadores.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post("/auth/register", { email, password });
      toast({
        title: "Utilizador criado",
        description: `${email} foi adicionado com sucesso.`,
      });
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (error) {
      toast({
        title: "Erro ao criar",
        description: "Não foi possível criar o utilizador. Verifique os dados.",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!userToRemove) return;
    setRemoveLoading(true);
    try {
      await api.delete(`/auth/users/${userToRemove.id}`);
      toast({
        title: "Utilizador removido",
        description: `${userToRemove.email} já não tem acesso ao painel.`,
      });
      setUserToRemove(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o utilizador.",
        variant: "destructive",
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-2xl">
        <header>
          <h1 className="font-heading text-2xl sm:text-3xl text-stone-800 tracking-tight">
            Quem tem acesso
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Ver, adicionar e remover utilizadores do painel do casamento.
          </p>
        </header>

        {/* Lista de utilizadores - mobile first cards */}
        <Card className="border-stone-200/80 bg-white shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Utilizadores com acesso
            </CardTitle>
            <CardDescription>
              Estes emails podem entrar no painel admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm text-stone-500">A carregar...</span>
              </div>
            ) : users.length === 0 ? (
              <p className="py-8 text-center text-stone-500 text-sm">
                Ainda não há utilizadores. Crie o primeiro abaixo.
              </p>
            ) : (
              <ul className="space-y-3">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-stone-50/80 border border-stone-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-stone-800 truncate">{user.email}</p>
                        <p className="text-xs text-stone-500">Administrador</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl"
                      onClick={() => setUserToRemove(user)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Criar novo */}
        <Card className="border-stone-200/80 bg-white shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-stone-800">
                  Novo administrador
                </CardTitle>
                <CardDescription className="text-stone-500 text-sm mt-0.5">
                  Adicione outro email com acesso ao painel.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600">Email</label>
                <Input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-stone-200 rounded-xl focus:ring-primary/20 focus:border-primary/40"
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
                  className="h-11 border-stone-200 rounded-xl focus:ring-primary/20 focus:border-primary/40"
                />
              </div>
              <Button
                type="submit"
                disabled={createLoading}
                className="w-full h-11 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-xl"
              >
                {createLoading ? "A criar..." : "Criar administrador"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!userToRemove} onOpenChange={(open) => !open && setUserToRemove(null)}>
        <AlertDialogContent className="rounded-2xl border-stone-200 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover acesso?</AlertDialogTitle>
            <AlertDialogDescription>
              {userToRemove?.email} deixará de poder entrar no painel. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmRemove();
              }}
              disabled={removeLoading}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {removeLoading ? "A remover..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
