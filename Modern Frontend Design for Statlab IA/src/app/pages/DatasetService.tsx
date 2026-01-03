import { Database, Upload, Download, Eye, Trash, RefreshCw, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MetricsChart } from "../components/MetricsChart";

export function DatasetService() {
  const storageData = [
    { name: "Jan", value: 340 },
    { name: "Fév", value: 420 },
    { name: "Mar", value: 580 },
    { name: "Avr", value: 650 },
    { name: "Mai", value: 720 },
    { name: "Juin", value: 890 },
  ];

  const datasetsData = [
    { name: "Jan", value: 120 },
    { name: "Fév", value: 125 },
    { name: "Mar", value: 138 },
    { name: "Avr", value: 142 },
    { name: "Mai", value: 149 },
    { name: "Juin", value: 156 },
  ];

  const datasets = [
    {
      id: "DS-2301",
      name: "customer_data_2024.csv",
      type: "CSV",
      size: "45.2 MB",
      records: "125,430",
      lastModified: "2024-12-28",
      status: "active",
    },
    {
      id: "DS-2302",
      name: "sales_transactions.parquet",
      type: "Parquet",
      size: "128.5 MB",
      records: "342,891",
      lastModified: "2024-12-27",
      status: "active",
    },
    {
      id: "DS-2303",
      name: "product_catalog.json",
      type: "JSON",
      size: "12.8 MB",
      records: "8,540",
      lastModified: "2024-12-26",
      status: "active",
    },
    {
      id: "DS-2304",
      name: "user_logs_december.csv",
      type: "CSV",
      size: "234.1 MB",
      records: "1,245,678",
      lastModified: "2024-12-25",
      status: "processing",
    },
    {
      id: "DS-2305",
      name: "ml_training_data.csv",
      type: "CSV",
      size: "567.3 MB",
      records: "2,340,120",
      lastModified: "2024-12-24",
      status: "active",
    },
    {
      id: "DS-2306",
      name: "sensor_data_q4.parquet",
      type: "Parquet",
      size: "892.7 MB",
      records: "4,567,890",
      lastModified: "2024-12-23",
      status: "archived",
    },
  ];

  const storageMetrics = [
    { label: "Total Datasets", value: "156", color: "text-blue-600" },
    { label: "Stockage utilisé", value: "2.4 TB", color: "text-purple-600" },
    { label: "Capacité totale", value: "10 TB", color: "text-gray-600" },
    { label: "Datasets actifs", value: "142", color: "text-green-600" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Traitement</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archivé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      CSV: "bg-blue-100 text-blue-800",
      JSON: "bg-yellow-100 text-yellow-800",
      Parquet: "bg-purple-100 text-purple-800",
    };
    return <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900">Dataset Service</h2>
              <p className="text-gray-500">Gestion centralisée des ensembles de données</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
            <Upload className="w-4 h-4" />
            Importer dataset
          </Button>
        </div>
      </div>

      {/* Storage Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Métriques de stockage</span>
            <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {storageMetrics.map((metric, idx) => (
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
          title="Évolution du stockage (GB)"
          data={storageData}
          type="area"
          dataKey="value"
          color="#8b5cf6"
        />
        <MetricsChart
          title="Nombre de datasets"
          data={datasetsData}
          type="bar"
          dataKey="value"
          color="#10b981"
        />
      </div>

      {/* Datasets Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Datasets disponibles</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un dataset..."
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
                <TableHead>Nom du fichier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Enregistrements</TableHead>
                <TableHead>Dernière modif.</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell className="font-mono text-sm">{dataset.id}</TableCell>
                  <TableCell>{dataset.name}</TableCell>
                  <TableCell>{getTypeBadge(dataset.type)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{dataset.size}</TableCell>
                  <TableCell className="text-sm text-gray-600">{dataset.records}</TableCell>
                  <TableCell className="text-sm text-gray-500">{dataset.lastModified}</TableCell>
                  <TableCell>{getStatusBadge(dataset.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                        <Trash className="w-4 h-4" />
                      </Button>
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
