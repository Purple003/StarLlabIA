import { Activity, Database, FileText, TrendingUp, Server, Zap } from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";
import { MetricsChart } from "../components/MetricsChart";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // Données mockées pour les graphiques
  const cpuData = [
    { name: "00:00", value: 45 },
    { name: "04:00", value: 52 },
    { name: "08:00", value: 68 },
    { name: "12:00", value: 73 },
    { name: "16:00", value: 85 },
    { name: "20:00", value: 62 },
    { name: "24:00", value: 48 },
  ];

  const requestsData = [
    { name: "Lun", value: 1200 },
    { name: "Mar", value: 1900 },
    { name: "Mer", value: 1500 },
    { name: "Jeu", value: 2100 },
    { name: "Ven", value: 2400 },
    { name: "Sam", value: 1800 },
    { name: "Dim", value: 1300 },
  ];

  const dataProcessedData = [
    { name: "Jan", value: 340 },
    { name: "Fév", value: 420 },
    { name: "Mar", value: 580 },
    { name: "Avr", value: 650 },
    { name: "Mai", value: 720 },
    { name: "Juin", value: 890 },
  ];

  const services = [
    {
      title: "Analysis Service",
      icon: Activity,
      status: "healthy" as const,
      description: "Service d'analyse de données",
      metrics: [
        { label: "Analyses actives", value: "24" },
        { label: "Taux de succès", value: "98.5%" },
      ],
      page: "analysis",
    },
    {
      title: "Dataset Service",
      icon: Database,
      status: "healthy" as const,
      description: "Gestion des ensembles de données",
      metrics: [
        { label: "Datasets", value: "156" },
        { label: "Stockage utilisé", value: "2.4 TB" },
      ],
      page: "dataset",
    },
    {
      title: "Report Service",
      icon: FileText,
      status: "warning" as const,
      description: "Génération de rapports",
      metrics: [
        { label: "Rapports générés", value: "342" },
        { label: "En attente", value: "7" },
      ],
      page: "report",
    },
  ];

  const statsCards = [
    {
      title: "Total Requêtes",
      value: "24.5K",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Services Actifs",
      value: "12/12",
      change: "100%",
      icon: Server,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Événements Kafka",
      value: "8.2K",
      change: "+5.2%",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Datasets MinIO",
      value: "156",
      change: "+8",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-500">Vue d'ensemble de votre infrastructure</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart
          title="Utilisation CPU (%)"
          data={cpuData}
          type="area"
          dataKey="value"
          color="#2563eb"
        />
        <MetricsChart
          title="Requêtes par jour"
          data={requestsData}
          type="bar"
          dataKey="value"
          color="#10b981"
        />
      </div>

      {/* Services */}
      <div>
        <h3 className="text-xl text-gray-900 mb-4">Microservices</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <ServiceCard
              key={idx}
              {...service}
              onViewDetails={() => onNavigate(service.page)}
            />
          ))}
        </div>
      </div>

      {/* Data Processed Chart */}
      <MetricsChart
        title="Données traitées (GB) - 6 derniers mois"
        data={dataProcessedData}
        type="line"
        dataKey="value"
        color="#8b5cf6"
      />
    </div>
  );
}
