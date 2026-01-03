import { FileText, Download, Eye, Clock, RefreshCw, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MetricsChart } from "../components/MetricsChart";
import { Progress } from "../components/ui/progress";

export function ReportService() {
  const reportsData = [
    { name: "Lun", value: 45 },
    { name: "Mar", value: 52 },
    { name: "Mer", value: 48 },
    { name: "Jeu", value: 61 },
    { name: "Ven", value: 58 },
    { name: "Sam", value: 42 },
    { name: "Dim", value: 38 },
  ];

  const generationTimeData = [
    { name: "Lun", value: 3.2 },
    { name: "Mar", value: 2.8 },
    { name: "Mer", value: 3.5 },
    { name: "Jeu", value: 4.1 },
    { name: "Ven", value: 3.7 },
    { name: "Sam", value: 2.9 },
    { name: "Dim", value: 2.5 },
  ];

  const reports = [
    {
      id: "RPT-4501",
      name: "Rapport Mensuel - Décembre 2024",
      type: "PDF",
      status: "completed",
      progress: 100,
      requestedBy: "Marie Dubois",
      createdAt: "2024-12-28 14:30",
      size: "2.4 MB",
    },
    {
      id: "RPT-4502",
      name: "Analyse Performance Q4",
      type: "Excel",
      status: "generating",
      progress: 73,
      requestedBy: "Jean Martin",
      createdAt: "2024-12-28 15:12",
      size: "-",
    },
    {
      id: "RPT-4503",
      name: "Dashboard Exécutif",
      type: "PDF",
      status: "generating",
      progress: 45,
      requestedBy: "Sophie Laurent",
      createdAt: "2024-12-28 15:45",
      size: "-",
    },
    {
      id: "RPT-4504",
      name: "Statistiques Hebdomadaires",
      type: "PDF",
      status: "pending",
      progress: 0,
      requestedBy: "Luc Petit",
      createdAt: "2024-12-28 16:00",
      size: "-",
    },
    {
      id: "RPT-4505",
      name: "Rapport KPI - Novembre",
      type: "Excel",
      status: "completed",
      progress: 100,
      requestedBy: "Claire Rousseau",
      createdAt: "2024-12-27 10:20",
      size: "1.8 MB",
    },
    {
      id: "RPT-4506",
      name: "Analyse Prédictive Ventes",
      type: "PDF",
      status: "completed",
      progress: 100,
      requestedBy: "Marc Lefebvre",
      createdAt: "2024-12-27 09:15",
      size: "3.2 MB",
    },
    {
      id: "RPT-4507",
      name: "Rapport d'Activité Annuel",
      type: "PDF",
      status: "error",
      progress: 0,
      requestedBy: "Anne Bernard",
      createdAt: "2024-12-26 16:30",
      size: "-",
    },
  ];

  const serviceMetrics = [
    { label: "Rapports générés", value: "342", color: "text-blue-600" },
    { label: "En cours", value: "2", color: "text-orange-600" },
    { label: "En attente", value: "7", color: "text-yellow-600" },
    { label: "Temps moyen", value: "3.2 min", color: "text-purple-600" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      PDF: "bg-red-100 text-red-800",
      Excel: "bg-green-100 text-green-800",
      CSV: "bg-blue-100 text-blue-800",
    };
    return <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900">Report Service</h2>
              <p className="text-gray-500">Génération automatisée de rapports</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Service Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Métriques du service</span>
            <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceMetrics.map((metric, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                <p className={`text-2xl ${metric.color}`}>{metric.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart
          title="Rapports générés par jour"
          data={reportsData}
          type="bar"
          dataKey="value"
          color="#10b981"
        />
        <MetricsChart
          title="Temps de génération moyen (min)"
          data={generationTimeData}
          type="line"
          dataKey="value"
          color="#8b5cf6"
        />
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rapports récents</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un rapport..."
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom du rapport</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-sm">{report.id}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{getTypeBadge(report.type)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    {report.status === "generating" ? (
                      <div className="flex items-center gap-3">
                        <Progress value={report.progress} className="w-20" />
                        <span className="text-sm text-gray-500">{report.progress}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{report.requestedBy}</TableCell>
                  <TableCell className="text-sm text-gray-500">{report.createdAt}</TableCell>
                  <TableCell className="text-sm text-gray-600">{report.size}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {report.status === "completed" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {report.status === "generating" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                          <Clock className="w-4 h-4 animate-spin" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
