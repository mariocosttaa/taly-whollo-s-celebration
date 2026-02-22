import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Loader2, MessageCircle, CheckCircle, XCircle, Heart, Users, Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Stats {
  visits: { totalVisits: number; last24h: number };
  rsvp: { total: number; confirmed: number; declined: number };
}

interface Rsvp {
  id: number;
  name: string;
  email: string | null;
  attendance: string;
  message: string | null;
  createdAt: string;
}

interface Last7DaysItem {
  date: string;
  count: number;
}

const CONFIRMED_COLOR = "hsl(142 76% 36%)";
const DECLINED_COLOR = "hsl(0 84% 60%)";

const RSVP_PAGE_SIZE = 10;
type AttendanceFilter = "" | "confirmed" | "declined";

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [rsvpTotal, setRsvpTotal] = useState(0);
  const [rsvpPage, setRsvpPage] = useState(1);
  const [rsvpSearch, setRsvpSearch] = useState("");
  const [rsvpSearchInput, setRsvpSearchInput] = useState("");
  const [rsvpAttendance, setRsvpAttendance] = useState<AttendanceFilter>("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [last7Days, setLast7Days] = useState<Last7DaysItem[]>([]);
  const [loading, setLoading] = useState(true);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!initialFetchDone.current) {
        try {
          const [visitsRes, rsvpStatsRes, rsvpsRes, daysRes] = await Promise.all([
            api.get("/visits/stats"),
            api.get("/rsvp/stats"),
            api.get("/rsvp", { params: { page: 1, limit: RSVP_PAGE_SIZE } }),
            api.get("/visits/stats/last7days"),
          ]);

          setStats({
            visits: visitsRes.data,
            rsvp: rsvpStatsRes.data,
          });
          const rsvpData = rsvpsRes.data;
          setRsvps(rsvpData?.data ?? rsvpData ?? []);
          setRsvpTotal(rsvpData?.total ?? 0);
          setLast7Days(daysRes.data ?? []);
          initialFetchDone.current = true;
        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setLoading(false);
        }
      } else {
        setRsvpLoading(true);
        try {
          const params: Record<string, string | number> = { page: rsvpPage, limit: RSVP_PAGE_SIZE };
          if (rsvpSearch) params.search = rsvpSearch;
          if (rsvpAttendance) params.attendance = rsvpAttendance;
          const res = await api.get("/rsvp", { params });
          const data = res.data;
          setRsvps(data?.data ?? data ?? []);
          setRsvpTotal(data?.total ?? 0);
        } catch (error) {
          console.error("Error fetching RSVPs", error);
        } finally {
          setRsvpLoading(false);
        }
      }
    };

    fetchData();
  }, [rsvpPage, rsvpSearch, rsvpAttendance]);

  const handleRsvpSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSearch(rsvpSearchInput.trim());
    setRsvpPage(1);
  };

  const rsvpTotalPages = Math.max(1, Math.ceil(rsvpTotal / RSVP_PAGE_SIZE));

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric" });
  };

  const visitsChartData = last7Days.map(({ date, count }) => ({
    label: formatDate(date),
    acessos: count,
    full: new Date(date).toLocaleDateString("pt-PT"),
  }));

  const confirmationChartData = [
    { name: "Confirmados", value: stats?.rsvp.confirmed ?? 0, color: CONFIRMED_COLOR },
    { name: "Recusados", value: stats?.rsvp.declined ?? 0, color: DECLINED_COLOR },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-stone-500 font-medium">A carregar o vosso painel...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        <header className="space-y-1">
          <h1 className="font-heading text-3xl sm:text-4xl text-stone-800 tracking-tight">
            Bem-vindos ao vosso painel
          </h1>
          <p className="text-stone-500 font-body text-base">
            Resumo da vossa celebração — acessos ao site, confirmações e respostas recentes.
          </p>
        </header>

        {/* Stats */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-700 mb-4">
            Resumo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-stone-200/80 bg-white shadow-card overflow-hidden">
              <CardContent className="p-0 flex">
                <div className="w-14 sm:w-16 flex items-center justify-center bg-primary/10 shrink-0">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <div className="p-4 sm:p-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                    Acessos ao site
                  </p>
                  <p className="text-2xl font-bold text-stone-800 mt-1">
                    {stats?.visits.totalVisits ?? 0}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    +{stats?.visits.last24h ?? 0} nas últimas 24h
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200/80 bg-white shadow-card overflow-hidden">
              <CardContent className="p-0 flex">
                <div className="w-14 sm:w-16 flex items-center justify-center bg-stone-100 shrink-0">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-stone-600" />
                </div>
                <div className="p-4 sm:p-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                    Total respostas
                  </p>
                  <p className="text-2xl font-bold text-stone-800 mt-1">
                    {stats?.rsvp.total ?? 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200/80 bg-white shadow-card overflow-hidden">
              <CardContent className="p-0 flex">
                <div className="w-14 sm:w-16 flex items-center justify-center bg-green-50 shrink-0">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                </div>
                <div className="p-4 sm:p-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                    Confirmados
                  </p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {stats?.rsvp.confirmed ?? 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200/80 bg-white shadow-card overflow-hidden">
              <CardContent className="p-0 flex">
                <div className="w-14 sm:w-16 flex items-center justify-center bg-red-50 shrink-0">
                  <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                </div>
                <div className="p-4 sm:p-5 flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                    Recusados
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {stats?.rsvp.declined ?? 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Charts row - mobile: stack, desktop: side by side */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Confirmações */}
          <Card className="border-stone-200/80 bg-white shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-800">
                Confirmações RSVP
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[240px] w-full">
                {confirmationChartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-stone-400 text-sm">
                    Ainda não há confirmações
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confirmationChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {confirmationChartData.map((_, i) => (
                          <Cell key={i} fill={confirmationChartData[i].color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid hsl(45 20% 88%)",
                          boxShadow: "var(--shadow-soft)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acessos ao site - últimos 7 dias */}
          <Card className="border-stone-200/80 bg-white shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-800">
                Acessos ao site (últimos 7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[240px] w-full">
                {visitsChartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-stone-400 text-sm">
                    Sem dados ainda
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitsChartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12, fill: "#78716c" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#78716c" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid hsl(45 20% 88%)",
                          boxShadow: "var(--shadow-soft)",
                        }}
                        labelFormatter={(_, payload) =>
                          payload?.[0]?.payload?.full ? payload[0].payload.full : ""
                        }
                        formatter={(value: number) => [`${value} acessos`, "Acessos"]}
                      />
                      <Bar dataKey="acessos" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" fillOpacity={0.85} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent RSVPs */}
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-semibold text-stone-700">
                Respostas recentes
              </h2>
            </div>
            <Link
              to="/admin/rsvp"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Card className="border-stone-200/80 bg-white shadow-card">
            <CardContent className="p-0 sm:p-6">
              <div className="p-4 sm:px-6 sm:pt-0 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-stone-100">
                <form onSubmit={handleRsvpSearch} className="flex flex-col xs:flex-row gap-2 flex-1 sm:max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      type="search"
                      placeholder="Nome ou email..."
                      value={rsvpSearchInput}
                      onChange={(e) => setRsvpSearchInput(e.target.value)}
                      className="pl-9 rounded-xl h-9 border-stone-200"
                    />
                  </div>
                  <Button type="submit" variant="secondary" size="sm" className="rounded-xl shrink-0">
                    Pesquisar
                  </Button>
                </form>
                <select
                  value={rsvpAttendance}
                  onChange={(e) => {
                    setRsvpAttendance(e.target.value as AttendanceFilter);
                    setRsvpPage(1);
                  }}
                  className="h-9 rounded-xl border border-stone-200 bg-stone-50/80 px-3 text-sm text-stone-700 w-full sm:w-auto max-w-[180px]"
                >
                  <option value="">Todos</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="declined">Recusados</option>
                </select>
              </div>
              {rsvpLoading ? (
                <div className="flex items-center justify-center py-12 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-sm text-stone-500">A carregar...</span>
                </div>
              ) : rsvps.length === 0 ? (
                <div className="py-16 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <p className="text-stone-500 font-medium">Nenhuma resposta ainda.</p>
                  <p className="text-sm text-stone-400 mt-1">As confirmações aparecerão aqui.</p>
                </div>
              ) : (
                <>
                  <div className="sm:hidden divide-y divide-stone-100">
                    {rsvps.map((rsvp) => (
                      <div key={rsvp.id} className="p-4 space-y-1">
                        <p className="font-medium text-stone-800">{rsvp.name}</p>
                        <p className="text-xs text-stone-500">
                          {new Date(rsvp.createdAt).toLocaleDateString("pt-PT")} · {rsvp.email || "—"}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            rsvp.attendance === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {rsvp.attendance === "confirmed" ? "Confirmado" : "Recusado"}
                        </span>
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
                          <TableHead className="font-semibold text-stone-600 max-w-[200px]">Mensagem</TableHead>
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
                            <TableCell className="max-w-[200px] truncate text-stone-500">
                              {rsvp.message || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
              {!rsvpLoading && rsvps.length > 0 && rsvpTotalPages > 1 && (
                <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-stone-100">
                  <p className="text-sm text-stone-500">
                    Página {rsvpPage} de {rsvpTotalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setRsvpPage((p) => Math.max(1, p - 1))}
                      disabled={rsvpPage <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="sr-only sm:not-sr-only sm:ml-1">Anterior</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setRsvpPage((p) => Math.min(rsvpTotalPages, p + 1))}
                      disabled={rsvpPage >= rsvpTotalPages}
                    >
                      <span className="sr-only sm:not-sr-only sm:mr-1">Seguinte</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
