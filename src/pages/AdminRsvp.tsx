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
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Heart,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

interface RsvpForm {
  name: string;
  email: string;
  attendance: "confirmed" | "declined";
  message: string;
}

const emptyForm: RsvpForm = { name: "", email: "", attendance: "confirmed", message: "" };

const AttendanceBadge = ({ value }: { value: string }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
      value === "confirmed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {value === "confirmed" ? "Confirmado" : "Recusado"}
  </span>
);

const AdminRsvp = () => {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<AttendanceFilter>("");
  const [loading, setLoading] = useState(true);

  // modals
  const [messageModal, setMessageModal] = useState<Rsvp | null>(null);
  const [formModal, setFormModal] = useState<{ open: boolean; editing: Rsvp | null }>({
    open: false,
    editing: null,
  });
  const [deleteModal, setDeleteModal] = useState<Rsvp | null>(null);

  // form state
  const [form, setForm] = useState<RsvpForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchRsvps = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: PAGE_SIZE };
      if (search) params.search = search;
      if (attendance) params.attendance = attendance;
      const res = await api.get("/rsvp", { params });
      const data = res.data;
      setRsvps(data?.data ?? data ?? []);
      setTotal(data?.total ?? 0);
    } catch {
      // handled silently
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

  const openCreate = () => {
    setForm(emptyForm);
    setFormError("");
    setFormModal({ open: true, editing: null });
  };

  const openEdit = (rsvp: Rsvp) => {
    setForm({
      name: rsvp.name,
      email: rsvp.email ?? "",
      attendance: rsvp.attendance as "confirmed" | "declined",
      message: rsvp.message ?? "",
    });
    setFormError("");
    setFormModal({ open: true, editing: rsvp });
  };

  const closeForm = () => {
    if (saving) return;
    setFormModal({ open: false, editing: null });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("O nome é obrigatório."); return; }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        attendance: form.attendance,
        message: form.message.trim() || null,
      };
      if (formModal.editing) {
        await api.put(`/rsvp/${formModal.editing.id}`, payload);
      } else {
        await api.post("/rsvp", payload);
      }
      setFormModal({ open: false, editing: null });
      fetchRsvps();
    } catch {
      setFormError("Ocorreu um erro. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await api.delete(`/rsvp/${deleteModal.id}`);
      setDeleteModal(null);
      fetchRsvps();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl text-stone-800 tracking-tight">
              Respostas RSVP
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Gerir todas as confirmações de presença.
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="shrink-0 rounded-xl min-h-[44px] touch-manipulation gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Nova resposta</span>
          </Button>
        </header>

        <Card className="border-stone-200/80 bg-white shadow-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-semibold text-stone-800">
                  Lista de respostas
                </CardTitle>
              </div>
              <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
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
                <select
                  value={attendance}
                  onChange={(e) => { setAttendance(e.target.value as AttendanceFilter); setPage(1); }}
                  className="min-h-[44px] sm:h-10 rounded-xl border border-stone-200 bg-stone-50/80 px-3 text-base sm:text-sm text-stone-700"
                >
                  <option value="">Todos</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="declined">Recusados</option>
                </select>
                <Button type="submit" variant="secondary" size="sm" className="rounded-xl min-h-[44px] sm:min-h-0 px-3 touch-manipulation">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>
            <p className="text-sm text-stone-500 mt-1">
              {total} {total === 1 ? "resposta" : "respostas"}
              {(search || attendance) && " (filtrado)"}
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
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-stone-100">
                  {rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-stone-800 truncate">{rsvp.name}</p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {new Date(rsvp.createdAt).toLocaleDateString("pt-PT")}
                            {rsvp.email && ` · ${rsvp.email}`}
                          </p>
                        </div>
                        <AttendanceBadge value={rsvp.attendance} />
                      </div>
                      {rsvp.message && (
                        <button
                          type="button"
                          onClick={() => setMessageModal(rsvp)}
                          className="w-full text-left rounded-lg px-3 py-2 bg-stone-50 border border-stone-100 text-xs text-stone-500 truncate touch-manipulation"
                        >
                          {rsvp.message}
                        </button>
                      )}
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl min-h-[40px] gap-1.5 text-stone-700 touch-manipulation"
                          onClick={() => openEdit(rsvp)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl min-h-[40px] gap-1.5 text-red-600 border-red-200 hover:bg-red-50 touch-manipulation"
                          onClick={() => setDeleteModal(rsvp)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto rounded-lg border border-stone-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-stone-50/80 hover:bg-stone-50/80 border-stone-100">
                        <TableHead className="font-semibold text-stone-600">Data</TableHead>
                        <TableHead className="font-semibold text-stone-600">Nome</TableHead>
                        <TableHead className="font-semibold text-stone-600">Email</TableHead>
                        <TableHead className="font-semibold text-stone-600">Status</TableHead>
                        <TableHead className="font-semibold text-stone-600">Mensagem</TableHead>
                        <TableHead className="font-semibold text-stone-600 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rsvps.map((rsvp) => (
                        <TableRow key={rsvp.id} className="border-stone-100">
                          <TableCell className="whitespace-nowrap text-stone-600 text-sm">
                            {new Date(rsvp.createdAt).toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className="font-medium text-stone-800">{rsvp.name}</TableCell>
                          <TableCell className="text-stone-500 text-sm">{rsvp.email || "—"}</TableCell>
                          <TableCell>
                            <AttendanceBadge value={rsvp.attendance} />
                          </TableCell>
                          <TableCell className="max-w-[180px]">
                            {rsvp.message ? (
                              <button
                                type="button"
                                onClick={() => setMessageModal(rsvp)}
                                className="text-left truncate block w-full text-stone-500 text-sm hover:text-stone-800 transition-colors"
                                title={rsvp.message}
                              >
                                {rsvp.message}
                              </button>
                            ) : (
                              <span className="text-stone-300 text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg text-stone-500 hover:text-stone-800"
                                onClick={() => openEdit(rsvp)}
                                title="Editar"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setDeleteModal(rsvp)}
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-4 px-4 sm:px-0 py-4 border-t border-stone-100 mt-2">
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

        {/* Message modal */}
        <Dialog open={!!messageModal} onOpenChange={(open) => !open && setMessageModal(null)}>
          <DialogContent className="rounded-2xl border-stone-200 max-w-[92vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-stone-800">{messageModal?.name}</DialogTitle>
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

        {/* Create / Edit modal */}
        <Dialog open={formModal.open} onOpenChange={(open) => !open && closeForm()}>
          <DialogContent className="rounded-2xl border-stone-200 max-w-[92vw] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-stone-800">
                {formModal.editing ? "Editar resposta" : "Nova resposta"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-1">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Nome *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nome completo"
                  className="rounded-xl min-h-[44px] border-stone-200"
                  disabled={saving}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="rounded-xl min-h-[44px] border-stone-200"
                  disabled={saving}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Confirmação *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["confirmed", "declined"] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      disabled={saving}
                      onClick={() => setForm((f) => ({ ...f, attendance: val }))}
                      className={`min-h-[44px] rounded-xl border-2 text-sm font-medium transition-colors touch-manipulation ${
                        form.attendance === val
                          ? val === "confirmed"
                            ? "border-green-500 bg-green-50 text-green-800"
                            : "border-red-400 bg-red-50 text-red-800"
                          : "border-stone-200 text-stone-500 hover:border-stone-300"
                      }`}
                    >
                      {val === "confirmed" ? "Confirmado" : "Recusado"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Mensagem</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Mensagem opcional..."
                  rows={3}
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none disabled:opacity-50"
                />
              </div>
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{formError}</p>
              )}
              <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl min-h-[44px] touch-manipulation"
                  onClick={closeForm}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl min-h-[44px] touch-manipulation"
                  disabled={saving}
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {formModal.editing ? "Guardar alterações" : "Criar resposta"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation modal */}
        <Dialog open={!!deleteModal} onOpenChange={(open) => !open && !deleting && setDeleteModal(null)}>
          <DialogContent className="rounded-2xl border-stone-200 max-w-[92vw] sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading text-stone-800">Eliminar resposta</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-stone-600">
              Tens a certeza que queres eliminar a resposta de{" "}
              <strong className="text-stone-800">{deleteModal?.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-2">
              <Button
                variant="outline"
                className="rounded-xl min-h-[44px] touch-manipulation"
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl min-h-[44px] touch-manipulation"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRsvp;
