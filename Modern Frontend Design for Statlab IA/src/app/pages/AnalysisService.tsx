import { Activity, Clock, Check, TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MetricsChart } from "../components/MetricsChart";
import { Progress } from "../components/ui/progress";

export function AnalysisService() {
  const metricsData = [
    { name: "00:00", value: 45 },
    { name: "04:00", value: 52 },
    { name: "08:00", value: 68 },
    { name: "12:00", value: 73 },
    { name: "16:00", value: 85 },
    { name: "20:00", value: 62 },
    { name: "24:00", value: 48 },
  ];

  const responseTimeData = [
    { name: "00:00", value: 120 },
    { name: "04:00", value: 115 },
    { name: "08:00", value: 145 },
    { name: "12:00", value: 168 },
    { name: "16:00", value: 152 },
    { name: "20:00", value: 130 },
    { name: "24:00", value: 118 },
  ];

  const recentAnalyses = [
    {
      id: "AN-1234",
      name: "Analyse Prédictive Q4",
      status: "completed",
      progress: 100,
      startTime: "10:30",
      duration: "3m 42s",
    },
    {
      id: "AN-1235",
      name: "Segmentation Clients",
      status: "running",
      progress: 65,
      startTime: "11:15",
      duration: "1m 28s",
    },
    {
      id: "AN-1236",
      name: "Détection Anomalies",
      status: "running",
      progress: 42,
      startTime: "11:45",
      duration: "0m 52s",
    },
    {
      id: "AN-1237",
      name: "Analyse Sentiment",
      status: "pending",
      progress: 0,
      startTime: "-",
      duration: "-",
    },
    {
      id: "AN-1238",
      name: "Clustering K-Means",
      status: "completed",
      progress: 100,
      startTime: "09:20",
      duration: "5m 12s",
    },
  ];

  const healthMetrics = [
    { label: "Uptime", value: "99.98%", color: "text-green-600" },
    { label: "Temps de réponse moyen", value: "142ms", color: "text-blue-600" },
    { label: "Requêtes/min", value: "324", color: "text-purple-600" },
    { label: "Taux d'erreur", value: "0.02%", color: "text-red-600" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900">Analysis Service</h2>
              <p className="text-gray-500">Service d'analyse de données en temps réel</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Nouvelle analyse
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>État de santé du service</span>
            <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {healthMetrics.map((metric, idx) => (
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
          title="Utilisation CPU (%)"
          data={metricsData}
          type="area"
          dataKey="value"
          color="#2563eb"
        />
        <MetricsChart
          title="Temps de réponse (ms)"
          data={responseTimeData}
          type="line"
          dataKey="value"
          color="#10b981"
        />
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle>Analyses récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom de l'analyse</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Heure de début</TableHead>
                <TableHead>Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAnalyses.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell className="font-mono text-sm">{analysis.id}</TableCell>
                  <TableCell>{analysis.name}</TableCell>
                  <TableCell>{getStatusBadge(analysis.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={analysis.progress} className="w-24" />
                      <span className="text-sm text-gray-500">{analysis.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{analysis.startTime}</TableCell>
                  <TableCell className="text-sm text-gray-500">{analysis.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
