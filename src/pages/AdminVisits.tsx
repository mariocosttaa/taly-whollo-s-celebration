import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, Users, Calendar } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

interface Last7DaysItem {
  date: string;
  count: number;
}

const AdminVisits = () => {
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [last24h, setLast24h] = useState<number | null>(null);
  const [last7Days, setLast7Days] = useState<Last7DaysItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [statsRes, daysRes] = await Promise.all([
          api.get("/visits/stats"),
          api.get("/visits/stats/last7days"),
        ]);
        setTotalVisits(statsRes.data?.totalVisits ?? 0);
        setLast24h(statsRes.data?.last24h ?? 0);
        setLast7Days(daysRes.data ?? []);
      } catch (error) {
        console.error("Error fetching visits stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDateShort = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric" });
  };

  const formatDateFull = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("pt-PT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const chartData = last7Days.map(({ date, count }) => ({
    label: formatDateShort(date),
    acessos: count,
    full: formatDateFull(date),
  }));

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-stone-500">A carregar...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="font-heading text-2xl sm:text-3xl text-stone-800 tracking-tight">
            Acessos ao site
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Quantidade de pessoas que entraram no site (não conta acessos ao painel admin).
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-stone-200/80 bg-white shadow-card overflow-hidden">
            <CardContent className="p-0 flex">
              <div className="w-14 sm:w-16 flex items-center justify-center bg-primary/10 shrink-0">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div className="p-4 sm:p-5 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  Total de acessos
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-stone-800 mt-1">
                  {totalVisits ?? 0}
                </p>
                <p className="text-sm text-stone-500 mt-0.5">
                  pessoas entraram no site
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200/80 bg-white shadow-card overflow-hidden">
            <CardContent className="p-0 flex">
              <div className="w-14 sm:w-16 flex items-center justify-center bg-stone-100 shrink-0">
                <Eye className="w-7 h-7 text-stone-600" />
              </div>
              <div className="p-4 sm:p-5 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  Últimas 24 horas
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-stone-800 mt-1">
                  {last24h ?? 0}
                </p>
                <p className="text-sm text-stone-500 mt-0.5">
                  acessos nas últimas 24h
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acessos por dia - lista clara: dia X = Y acessos */}
        <Card className="border-stone-200/80 bg-white shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Acessos por dia
            </CardTitle>
            <p className="text-sm text-stone-500 mt-1">
              Quantos acessos houve em cada um dos últimos 7 dias.
            </p>
          </CardHeader>
          <CardContent>
            {last7Days.length === 0 ? (
              <p className="py-6 text-center text-stone-500 text-sm">
                Ainda não há dados por dia.
              </p>
            ) : (
              <ul className="space-y-3">
                {last7Days.map(({ date, count }) => (
                  <li
                    key={date}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-xl bg-stone-50/80 border border-stone-100"
                  >
                    <span className="font-medium text-stone-800 capitalize">
                      {formatDateFull(date)}
                    </span>
                    <span className="text-primary font-semibold tabular-nums">
                      {count} {count === 1 ? "acesso" : "acessos"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Gráfico */}
        {chartData.length > 0 && (
          <Card className="border-stone-200/80 bg-white shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-800">
                Gráfico — últimos 7 dias
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
                    <Bar dataKey="acessos" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill="hsl(var(--primary))" fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVisits;
