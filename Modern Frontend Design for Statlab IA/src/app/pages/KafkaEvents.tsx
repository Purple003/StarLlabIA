import { useState, useEffect } from "react";
import { Zap, Activity, Clock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MetricsChart } from "../components/MetricsChart";
import { ScrollArea } from "../components/ui/scroll-area";

interface KafkaEvent {
  id: string;
  topic: string;
  type: string;
  message: string;
  timestamp: string;
  partition: number;
  offset: number;
}

export function KafkaEvents() {
  const [events, setEvents] = useState<KafkaEvent[]>([
    {
      id: "evt-1001",
      topic: "analysis-results",
      type: "ANALYSIS_COMPLETED",
      message: "Analyse prédictive Q4 terminée avec succès",
      timestamp: "2024-12-28 16:45:32",
      partition: 0,
      offset: 1245,
    },
    {
      id: "evt-1002",
      topic: "dataset-events",
      type: "DATASET_UPLOADED",
      message: "Nouveau dataset: customer_data_2024.csv",
      timestamp: "2024-12-28 16:44:18",
      partition: 1,
      offset: 8902,
    },
    {
      id: "evt-1003",
      topic: "report-generation",
      type: "REPORT_STARTED",
      message: "Génération rapport mensuel décembre",
      timestamp: "2024-12-28 16:43:05",
      partition: 0,
      offset: 3456,
    },
    {
      id: "evt-1004",
      topic: "system-health",
      type: "HEALTH_CHECK",
      message: "Tous les services opérationnels",
      timestamp: "2024-12-28 16:42:00",
      partition: 2,
      offset: 7821,
    },
    {
      id: "evt-1005",
      topic: "analysis-results",
      type: "ANALYSIS_STARTED",
      message: "Démarrage segmentation clients",
      timestamp: "2024-12-28 16:41:15",
      partition: 0,
      offset: 1244,
    },
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simuler l'arrivée d'un nouvel événement
      const eventTypes = [
        { topic: "analysis-results", type: "ANALYSIS_COMPLETED", message: "Analyse terminée" },
        { topic: "dataset-events", type: "DATASET_UPDATED", message: "Dataset mis à jour" },
        { topic: "report-generation", type: "REPORT_COMPLETED", message: "Rapport généré" },
        { topic: "system-health", type: "HEALTH_CHECK", message: "Vérification système" },
      ];

      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const now = new Date();
      const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;

      const newEvent: KafkaEvent = {
        id: `evt-${Date.now()}`,
        topic: randomEvent.topic,
        type: randomEvent.type,
        message: randomEvent.message,
        timestamp,
        partition: Math.floor(Math.random() * 3),
        offset: Math.floor(Math.random() * 10000),
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const eventsData = [
    { name: "00:00", value: 342 },
    { name: "04:00", value: 289 },
    { name: "08:00", value: 456 },
    { name: "12:00", value: 612 },
    { name: "16:00", value: 734 },
    { name: "20:00", value: 521 },
    { name: "24:00", value: 398 },
  ];

  const throughputData = [
    { name: "00:00", value: 1.2 },
    { name: "04:00", value: 0.9 },
    { name: "08:00", value: 2.1 },
    { name: "12:00", value: 3.4 },
    { name: "16:00", value: 4.2 },
    { name: "20:00", value: 2.8 },
    { name: "24:00", value: 1.5 },
  ];

  const topicStats = [
    { name: "analysis-results", events: "12.5K", partition: 3, lag: 0 },
    { name: "dataset-events", events: "8.9K", partition: 2, lag: 0 },
    { name: "report-generation", events: "3.4K", partition: 2, lag: 12 },
    { name: "system-health", events: "7.8K", partition: 3, lag: 0 },
    { name: "user-activity", events: "15.2K", partition: 4, lag: 0 },
    { name: "error-logs", events: "234", partition: 1, lag: 0 },
  ];

  const kafkaMetrics = [
    { label: "Événements/sec", value: "342", color: "text-blue-600" },
    { label: "Topics actifs", value: "12", color: "text-purple-600" },
    { label: "Total aujourd'hui", value: "24.5K", color: "text-green-600" },
    { label: "Lag moyen", value: "12", color: "text-orange-600" },
  ];

  const getTopicColor = (topic: string) => {
    const colors: Record<string, string> = {
      "analysis-results": "bg-blue-100 text-blue-800",
      "dataset-events": "bg-purple-100 text-purple-800",
      "report-generation": "bg-green-100 text-green-800",
      "system-health": "bg-orange-100 text-orange-800",
      "user-activity": "bg-pink-100 text-pink-800",
      "error-logs": "bg-red-100 text-red-800",
    };
    return colors[topic] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    if (type.includes("COMPLETED") || type.includes("SUCCESS")) {
      return "bg-green-100 text-green-800";
    }
    if (type.includes("STARTED") || type.includes("PROCESSING")) {
      return "bg-blue-100 text-blue-800";
    }
    if (type.includes("ERROR") || type.includes("FAILED")) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-900">Kafka Events</h2>
              <p className="text-gray-500">Flux d'événements en temps réel</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </Button>
        </div>
      </div>

      {/* Kafka Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Métriques Kafka</span>
            <Badge className="bg-green-100 text-green-800">Connecté</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kafkaMetrics.map((metric, idx) => (
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
          title="Événements par heure"
          data={eventsData}
          type="area"
          dataKey="value"
          color="#eab308"
        />
        <MetricsChart
          title="Débit (MB/s)"
          data={throughputData}
          type="line"
          dataKey="value"
          color="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques par topic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topicStats.map((topic, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-mono text-sm text-gray-900">{topic.name}</p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {topic.events} événements
                      </span>
                      <span className="text-xs text-gray-500">
                        {topic.partition} partitions
                      </span>
                      {topic.lag > 0 && (
                        <span className="text-xs text-orange-600">
                          Lag: {topic.lag}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={getTopicColor(topic.name)}>
                    {topic.partition}P
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Event Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600 animate-pulse" />
              Flux en direct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {events.slice(0, 10).map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getTopicColor(event.topic)}>
                        {event.topic}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {event.timestamp.split(' ')[1]}
                      </div>
                    </div>
                    <Badge className={`${getTypeColor(event.type)} mb-2`}>
                      {event.type}
                    </Badge>
                    <p className="text-sm text-gray-700 mb-2">{event.message}</p>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>Partition: {event.partition}</span>
                      <span>Offset: {event.offset}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
