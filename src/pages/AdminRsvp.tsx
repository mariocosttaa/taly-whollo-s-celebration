import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ChevronLeft, ChevronRight, MessageCircle, Heart, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 20;

type AttendanceFilter = "" | "confirmed" | "declined";

interface Rsvp {
  id: number;
  name: string;
  email: string | null;
  attendance: string;
  message: string | null;
  createdAt: string;
}

const AdminRsvp = () => {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<AttendanceFilter>("");
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState<Rsvp | null>(null);

  const fetchRsvps = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: PAGE_SIZE,
      };
      if (search) params.search = search;
      if (attendance) params.attendance = attendance;
      const res = await api.get("/rsvp", { params });
      const data = res.data;
      setRsvps(data?.data ?? data ?? []);
      setTotal(data?.total ?? 0);
    } catch (error) {
      console.error("Error fetching RSVPs", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, attendance]);

  useEffect(() => {
    fetchRsvps();
  }, [fetchRsvps]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="font-heading text-2xl sm:text-3xl text-stone-800 tracking-tight">
            Respostas RSVP
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Ver e filtrar todas as confirmações de presença.
          </p>
        </header>

        <Card className="border-stone-200/80 bg-white shadow-card">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-semibold text-stone-800">
                  Lista de respostas
                </CardTitle>
              </div>
              <form onSubmit={handleSearch} className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    type="search"
                    placeholder="Nome ou email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9 rounded-xl min-h-[44px] sm:min-h-0 bg-stone-50/80 border-stone-200 text-base sm:text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={attendance}
                    onChange={(e) => {
                      setAttendance(e.target.value as AttendanceFilter);
                      setPage(1);
                    }}
                    className="min-h-[44px] sm:h-10 rounded-xl border border-stone-200 bg-stone-50/80 px-3 text-base sm:text-sm text-stone-700"
                  >
                    <option value="">Todos</option>
                    <option value="confirmed">Confirmados</option>
                    <option value="declined">Recusados</option>
                  </select>
                  <Button type="submit" variant="secondary" size="sm" className="rounded-xl min-h-[44px] sm:min-h-0 touch-manipulation">
                    <Search className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Pesquisar</span>
                  </Button>
                </div>
              </form>
            </div>
            <p className="text-sm text-stone-500 mt-1">
              {total} {total === 1 ? "resposta" : "respostas"}
              {(search || attendance) && " (filtrado)"}
            </p>
            <p className="text-sm sm:text-xs text-stone-500 mt-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
              Clique numa mensagem para ver o texto completo.
            </p>
          </CardHeader>
          <CardContent className="p-0 sm:px-6 sm:pb-6">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm text-stone-500">A carregar...</span>
              </div>
            ) : rsvps.length === 0 ? (
              <div className="py-16 text-center">
                <Heart className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                <p className="text-stone-500 font-medium">Nenhuma resposta encontrada.</p>
              </div>
            ) : (
              <>
                <div className="sm:hidden divide-y divide-stone-100">
                  {rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="p-5 space-y-2">
                      <p className="font-medium text-stone-800 text-[1rem] leading-snug">{rsvp.name}</p>
                      <p className="text-sm text-stone-500">
                        {new Date(rsvp.createdAt).toLocaleDateString("pt-PT")} · {rsvp.email || "—"}
                      </p>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-sm font-medium ${
                          rsvp.attendance === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rsvp.attendance === "confirmed" ? "Confirmado" : "Recusado"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMessageModal(rsvp)}
                        className="min-h-[44px] w-full rounded-xl px-4 py-3 mt-2 text-left hover:bg-stone-100 active:bg-stone-200 flex items-center gap-2 border border-stone-100 text-stone-600 text-sm touch-manipulation"
                      >
                        <MessageSquare className="w-5 h-5 shrink-0 text-primary/70" />
                        <span className="truncate flex-1">
                          {rsvp.message ? rsvp.message : "(sem mensagem)"}
                        </span>
                        <span className="text-primary font-medium shrink-0">Ver</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block overflow-x-auto rounded-lg border border-stone-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-stone-50/80 hover:bg-stone-50/80 border-stone-100">
                        <TableHead className="font-semibold text-stone-600">Data</TableHead>
                        <TableHead className="font-semibold text-stone-600">Nome</TableHead>
                        <TableHead className="font-semibold text-stone-600">Email</TableHead>
                        <TableHead className="font-semibold text-stone-600">Status</TableHead>
                        <TableHead className="font-semibold text-stone-600 max-w-[200px]">Mensagem (clique para ver)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rsvps.map((rsvp) => (
                        <TableRow key={rsvp.id} className="border-stone-100">
                          <TableCell className="whitespace-nowrap text-stone-600">
                            {new Date(rsvp.createdAt).toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className="font-medium text-stone-800">{rsvp.name}</TableCell>
                          <TableCell className="text-stone-600">{rsvp.email || "—"}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rsvp.attendance === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {rsvp.attendance === "confirmed" ? "Confirmado" : "Recusado"}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px] p-0">
                            <button
                              type="button"
                              onClick={() => setMessageModal(rsvp)}
                              className="w-full text-left px-4 py-3 truncate block text-stone-500 hover:bg-stone-50 transition-colors rounded flex items-center gap-2 min-h-[52px]"
                              title="Clique para ver a mensagem completa"
                            >
                              <MessageSquare className="w-4 h-4 shrink-0 text-primary/70" />
                              <span className="truncate flex-1">
                                {rsvp.message || "—"}
                              </span>
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-4 px-4 sm:px-0 py-4 border-t border-stone-100 mt-4">
                    <p className="text-sm text-stone-500">
                      Página {page} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl min-h-[44px] sm:min-h-0 touch-manipulation"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1 || loading}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">Anterior</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl min-h-[44px] sm:min-h-0 touch-manipulation"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages || loading}
                      >
                        <span className="sr-only sm:not-sr-only sm:mr-1">Seguinte</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!messageModal} onOpenChange={(open) => !open && setMessageModal(null)}>
          <DialogContent className="rounded-2xl border-stone-200 max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-stone-800">
                {messageModal?.name}
              </DialogTitle>
              <p className="text-sm text-stone-500">
                {messageModal && new Date(messageModal.createdAt).toLocaleDateString("pt-PT", { dateStyle: "long" })}
                {messageModal?.email && ` · ${messageModal.email}`}
              </p>
            </DialogHeader>
            <div className="rounded-xl bg-stone-50 border border-stone-100 p-4">
              <p className="text-sm text-stone-700 whitespace-pre-wrap">
                {messageModal?.message || "(Sem mensagem)"}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRsvp;
