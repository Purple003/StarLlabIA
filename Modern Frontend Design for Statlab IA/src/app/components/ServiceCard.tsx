import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface ServiceCardProps {
  title: string;
  icon: LucideIcon;
  status: "healthy" | "warning" | "error";
  description: string;
  metrics: {
    label: string;
    value: string | number;
  }[];
  onViewDetails: () => void;
}

export function ServiceCard({
  title,
  icon: Icon,
  status,
  description,
  metrics,
  onViewDetails,
}: ServiceCardProps) {
  const statusConfig = {
    healthy: { label: "Opérationnel", className: "bg-green-100 text-green-800" },
    warning: { label: "Attention", className: "bg-yellow-100 text-yellow-800" },
    error: { label: "Erreur", className: "bg-red-100 text-red-800" },
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
          <Badge className={cn("text-xs", statusConfig[status].className)}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">{metric.label}</p>
              <p className="text-lg text-gray-900 mt-1">{metric.value}</p>
            </div>
          ))}
        </div>
        <Button
          onClick={onViewDetails}
          variant="outline"
          className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
}
