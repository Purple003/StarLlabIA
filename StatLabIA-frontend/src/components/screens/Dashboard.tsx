import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { StatusBadge } from '../StatusBadge';
import { Upload, Database, Sparkles, TrendingUp, Activity, Clock } from 'lucide-react';

export function Dashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[color:var(--color-text-primary)] mb-2">Dashboard</h1>
        <p className="text-[color:var(--color-text-secondary)]">
          Vue d'ensemble de vos analyses de données
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" hover className="cursor-pointer" onClick={() => onNavigate('import')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Importer</p>
              <h3 className="text-[color:var(--color-primary)]">Nouvelles données</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-[color:var(--color-primary)]" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Datasets</p>
              <h3>24</h3>
              <p className="text-xs text-[color:var(--color-text-tertiary)] mt-1">+3 ce mois</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-[color:var(--color-secondary)]" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Analyses</p>
              <h3>156</h3>
              <p className="text-xs text-[color:var(--color-text-tertiary)] mt-1">+12 cette semaine</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Précision moy.</p>
              <h3>94.2%</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +2.3%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3>Projets récents</h3>
          <Button variant="ghost" size="sm">Voir tout</Button>
        </div>
        
        <div className="space-y-4">
          {[
            { 
              name: 'Analyse des ventes Q4', 
              dataset: 'sales_data_2024.csv', 
              status: 'success' as const, 
              progress: 100,
              time: 'Il y a 2h',
              microservices: ['Import', 'Cleaning', 'Analysis', 'Export']
            },
            { 
              name: 'Segmentation clients', 
              dataset: 'customer_behavior.xlsx', 
              status: 'pending' as const, 
              progress: 65,
              time: 'En cours',
              microservices: ['Import', 'Cleaning', 'Processing']
            },
            { 
              name: 'Prévisions tendances', 
              dataset: 'market_trends.json', 
              status: 'success' as const, 
              progress: 100,
              time: 'Hier',
              microservices: ['Import', 'Cleaning', 'Analysis', 'Visualization']
            }
          ].map((project, idx) => (
            <div key={idx} className="p-4 border border-[color:var(--color-border-light)] rounded-lg hover:border-[color:var(--color-primary)] transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="mb-1">{project.name}</h5>
                  <p className="text-sm text-[color:var(--color-text-tertiary)]">
                    <code className="text-xs">{project.dataset}</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={project.status}>
                    {project.status === 'success' ? 'Terminé' : 'En cours'}
                  </StatusBadge>
                  <Clock className="w-4 h-4 text-[color:var(--color-text-tertiary)]" />
                  <span className="text-xs text-[color:var(--color-text-tertiary)]">{project.time}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-[color:var(--color-text-tertiary)] mb-1">
                  <span>Progression</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-[color:var(--color-bg-tertiary)] rounded-full h-2">
                  <div 
                    className="bg-[color:var(--color-secondary)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {project.microservices.map((service) => (
                  <span key={service} className="text-xs px-2 py-1 bg-[color:var(--color-bg-tertiary)] rounded text-[color:var(--color-text-secondary)]">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Microservices Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h4 className="mb-4">État des microservices</h4>
          <div className="space-y-3">
            {[
              { name: 'Import Service', status: 'success', endpoint: '/api/v1/import' },
              { name: 'Cleaning Service', status: 'success', endpoint: '/api/v1/cleaning' },
              { name: 'Processing Service', status: 'success', endpoint: '/api/v1/processing' },
              { name: 'Analysis Service', status: 'success', endpoint: '/api/v1/analysis' },
              { name: 'Visualization Service', status: 'warning', endpoint: '/api/v1/visualization' },
              { name: 'Export Service', status: 'success', endpoint: '/api/v1/export' }
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-[color:var(--color-bg-secondary)] rounded-lg">
                <div>
                  <p className="text-sm">{service.name}</p>
                  <code className="text-xs text-[color:var(--color-text-tertiary)]">{service.endpoint}</code>
                </div>
                <div className={`w-3 h-3 rounded-full ${service.status === 'success' ? 'bg-green-500' : 'bg-orange-500'}`} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h4 className="mb-4">Activité récente</h4>
          <div className="space-y-4">
            {[
              { action: 'Dataset importé', detail: 'sales_data_2024.csv', time: 'Il y a 15 min' },
              { action: 'Nettoyage complété', detail: '98.5% de qualité', time: 'Il y a 1h' },
              { action: 'Analyse générée', detail: 'Corrélations détectées', time: 'Il y a 2h' },
              { action: 'Export réussi', detail: 'Format PDF + Excel', time: 'Il y a 3h' }
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[color:var(--color-primary)] mt-2" />
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">{activity.detail}</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
