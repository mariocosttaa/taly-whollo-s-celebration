import { useEffect, useState } from "react";
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

interface Visit {
  id: number;
  page: string;
  ip: string | null;
  userAgent: string | null;
  timestamp: string;
}

const AdminVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await api.get("/visits");
        setVisits(response.data);
      } catch (error) {
        console.error("Error fetching visits", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl text-stone-800">
            Registo de Acessos
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Visitas (Home Page)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Página</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Dispositivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      {new Date(visit.timestamp).toLocaleString("pt-PT")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{visit.page}</TableCell>
                    <TableCell className="font-mono text-xs text-stone-500">
                      {visit.ip || "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-stone-500">
                      {visit.userAgent || "-"}
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

export default AdminVisits;
