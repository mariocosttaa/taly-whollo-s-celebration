import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2 } from "lucide-react";
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

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitsRes, rsvpStatsRes, rsvpsRes] = await Promise.all([
          api.get("/visits/stats"),
          api.get("/rsvp/stats"),
          api.get("/rsvp?limit=50"),
        ]);

        setStats({
          visits: visitsRes.data,
          rsvp: rsvpStatsRes.data,
        });
        setRsvps(rsvpsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        if ((error as any).response?.status === 401) {
          navigate("/admin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl md:text-4xl text-stone-800">
            Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">
                Total de Visitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.visits.totalVisits}</div>
              <p className="text-xs text-stone-500">
                +{stats?.visits.last24h} nas últimas 24h
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">
                Total Respostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.rsvp.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {stats?.rsvp.confirmed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Recusados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {stats?.rsvp.declined}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RSVP Table */}
        <Card>
          <CardHeader>
            <CardTitle>Respostas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mensagem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell>
                      {new Date(rsvp.createdAt).toLocaleDateString("pt-PT")}
                    </TableCell>
                    <TableCell className="font-medium">{rsvp.name}</TableCell>
                    <TableCell>{rsvp.email || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rsvp.attendance === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rsvp.attendance === "confirmed"
                          ? "Confirmado"
                          : "Recusado"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {rsvp.message || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
