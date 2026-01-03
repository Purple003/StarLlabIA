import { FileBox, Upload, Download, Eye, Trash, RefreshCw, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { MetricsChart } from "../components/MetricsChart";
import { Progress } from "../components/ui/progress";

export function MinIOManager() {
  const storageData = [
    { name: "Jan", value: 1240 },
    { name: "Fév", value: 1580 },
    { name: "Mar", value: 1890 },
    { name: "Avr", value: 2120 },
    { name: "Mai", value: 2340 },
    { name: "Juin", value: 2450 },
  ];

  const uploadData = [
    { name: "Lun", value: 145 },
    { name: "Mar", value: 168 },
    { name: "Mer", value: 152 },
    { name: "Jeu", value: 189 },
    { name: "Ven", value: 201 },
    { name: "Sam", value: 134 },
    { name: "Dim", value: 98 },
  ];

  const buckets = [
    {
      name: "statlab-datasets",
      objects: "1,245",
      size: "567 GB",
      lastModified: "2024-12-28",
      status: "active",
      usage: 68,
    },
    {
      name: "statlab-models",
      objects: "342",
      size: "234 GB",
      lastModified: "2024-12-27",
      status: "active",
      usage: 45,
    },
    {
      name: "statlab-reports",
      objects: "890",
      size: "123 GB",
      lastModified: "2024-12-28",
      status: "active",
      usage: 32,
    },
    {
      name: "statlab-logs",
      objects: "4,567",
      size: "890 GB",
      lastModified: "2024-12-28",
      status: "active",
      usage: 82,
    },
    {
      name: "statlab-backups",
      objects: "156",
      size: "456 GB",
      lastModified: "2024-12-26",
      status: "active",
      usage: 56,
    },
    {
      name: "statlab-temp",
      objects: "89",
      size: "34 GB",
      lastModified: "2024-12-28",
      status: "active",
      usage: 12,
    },
  ];

  const recentFiles = [
    {
      name: "customer_analysis_2024.csv",
      bucket: "statlab-datasets",
      size: "45.2 MB",
      type: "CSV",
      uploaded: "2024-12-28 15:30",
      uploadedBy: "Marie Dubois",
    },
    {
      name: "ml_model_v3.pkl",
      bucket: "statlab-models",
      size: "128 MB",
      type: "Model",
      uploaded: "2024-12-28 14:12",
      uploadedBy: "Jean Martin",
    },
    {
      name: "monthly_report_dec.pdf",
      bucket: "statlab-reports",
      size: "2.4 MB",
      type: "PDF",
      uploaded: "2024-12-28 13:45",
      uploadedBy: "Sophie Laurent",
    },
    {
      name: "transaction_logs.json",
      bucket: "statlab-logs",
      size: "67.8 MB",
      type: "JSON",
      uploaded: "2024-12-28 12:20",
      uploadedBy: "Luc Petit",
    },
    {
      name: "db_backup_20241228.sql",
      bucket: "statlab-backups",
      size: "234 MB",
      type: "SQL",
      uploaded: "2024-12-28 10:00",
      uploadedBy: "System",
    },
  ];

  const minioMetrics = [
    { label: "Total Buckets", value: "12", color: "text-blue-600" },
    { label: "Total Objects", value: "7,289", color: "text-purple-600" },
    { label: "Stockage utilisé", value: "2.3 TB", color: "text-orange-600" },
    { label: "Uploads aujourd'hui", value: "145", color: "text-green-600" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "readonly":
        return <Badge className="bg-blue-100 text-blue-800">Lecture seule</Badge>;
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
      PDF: "bg-red-100 text-red-800",
      Model: "bg-purple-100 text-purple-800",
      SQL: "bg-green-100 text-green-800",
    };
    return <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileBox className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900">MinIO Manager</h2>
              <p className="text-gray-500">Gestion du stockage d'objets MinIO</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
            <Upload className="w-4 h-4" />
            Uploader fichier
          </Button>
        </div>
      </div>

      {/* MinIO Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Métriques MinIO</span>
            <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {minioMetrics.map((metric, idx) => (
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
          color="#ea580c"
        />
        <MetricsChart
          title="Uploads par jour"
          data={uploadData}
          type="bar"
          dataKey="value"
          color="#10b981"
        />
      </div>

      {/* Buckets */}
      <Card>
        <CardHeader>
          <CardTitle>Buckets MinIO</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du bucket</TableHead>
                <TableHead>Objets</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Utilisation</TableHead>
                <TableHead>Dernière modif.</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buckets.map((bucket) => (
                <TableRow key={bucket.name}>
                  <TableCell className="font-mono text-sm">{bucket.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{bucket.objects}</TableCell>
                  <TableCell className="text-sm text-gray-600">{bucket.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={bucket.usage} className="w-24" />
                      <span className="text-sm text-gray-500">{bucket.usage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{bucket.lastModified}</TableCell>
                  <TableCell>{getStatusBadge(bucket.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Files */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fichiers récents</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un fichier..."
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du fichier</TableHead>
                <TableHead>Bucket</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Uploadé le</TableHead>
                <TableHead>Par</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentFiles.map((file, idx) => (
                <TableRow key={idx}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">{file.bucket}</TableCell>
                  <TableCell>{getTypeBadge(file.type)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{file.size}</TableCell>
                  <TableCell className="text-sm text-gray-500">{file.uploaded}</TableCell>
                  <TableCell className="text-sm text-gray-600">{file.uploadedBy}</TableCell>
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
