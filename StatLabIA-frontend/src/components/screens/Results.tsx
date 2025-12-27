import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { StatusBadge } from '../StatusBadge';
import { TrendingUp, Download, Share2, Eye, BarChart2, AlertCircle } from 'lucide-react';

export function Results({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[color:var(--color-text-primary)] mb-2">Résultats d'analyse</h1>
          <p className="text-[color:var(--color-text-secondary)]">
            Analyse de régression • Complétée il y a 5 min
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNavigate('visualization')}>
            <Eye className="w-4 h-4" />
            Visualiser
          </Button>
          <Button variant="outline" onClick={() => onNavigate('export')}>
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button variant="primary">
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md">
          <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Score R²</p>
          <h2 className="text-[color:var(--color-primary)] mb-1">0.847</h2>
          <StatusBadge status="success">Excellent</StatusBadge>
        </Card>

        <Card padding="md">
          <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">RMSE</p>
          <h2 className="mb-1">234.5</h2>
          <p className="text-xs text-[color:var(--color-text-tertiary)]">±12.3</p>
        </Card>

        <Card padding="md">
          <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">MAE</p>
          <h2 className="mb-1">189.2</h2>
          <p className="text-xs text-[color:var(--color-text-tertiary)]">±8.7</p>
        </Card>

        <Card padding="md">
          <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Précision</p>
          <h2 className="text-[color:var(--color-secondary)] mb-1">94.2%</h2>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2.1%
          </p>
        </Card>
      </div>

      {/* Model Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="mb-4">Résumé du modèle</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[color:var(--color-text-secondary)]">Type d'analyse</span>
                <span>Régression linéaire multiple</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[color:var(--color-text-secondary)]">Dataset</span>
                <code className="text-xs">sales_data_2024.csv</code>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[color:var(--color-text-secondary)]">Échantillons</span>
                <span>14,398 lignes (70/30 split)</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[color:var(--color-text-secondary)]">Features</span>
                <span>18 variables (12 originales + 6 encodées)</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[color:var(--color-text-secondary)]">Variable cible</span>
                <code className="text-xs">revenue</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--color-text-secondary)]">Temps d'exécution</span>
                <span>1m 34s</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4">Distribution des erreurs</h3>
          <div className="h-48 bg-[color:var(--color-bg-secondary)] rounded-lg flex items-center justify-center mb-4">
            <svg width="100%" height="100%" viewBox="0 0 300 150" className="px-4">
              <path 
                d="M 10,120 Q 50,100 70,80 T 130,60 T 190,70 T 250,90 L 250,130 L 10,130 Z" 
                fill="url(#gradient)" 
                opacity="0.5"
              />
              <path 
                d="M 10,120 Q 50,100 70,80 T 130,60 T 190,70 T 250,90" 
                fill="none" 
                stroke="var(--color-primary)" 
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            Distribution normale des résidus confirmée (Jarque-Bera test: p=0.82)
          </p>
        </Card>
      </div>

      {/* Feature Importance */}
      <Card>
        <h3 className="mb-4">Importance des variables</h3>
        <div className="space-y-3">
          {[
            { feature: 'age', importance: 0.342, coefficient: '+234.5', pvalue: '< 0.001' },
            { feature: 'region_encoded', importance: 0.218, coefficient: '+156.2', pvalue: '< 0.001' },
            { feature: 'category_encoded', importance: 0.195, coefficient: '+142.8', pvalue: '< 0.001' },
            { feature: 'frequency', importance: 0.124, coefficient: '+89.3', pvalue: '0.002' },
            { feature: 'status_active', importance: 0.086, coefficient: '+67.1', pvalue: '0.015' },
            { feature: 'tenure', importance: 0.035, coefficient: '+23.4', pvalue: '0.089' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <code className="text-sm min-w-[140px]">{item.feature}</code>
                  <div className="flex-1 bg-[color:var(--color-bg-tertiary)] rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.importance * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-6 text-sm ml-4">
                  <span className="text-[color:var(--color-text-tertiary)] min-w-[60px]">{(item.importance * 100).toFixed(1)}%</span>
                  <span className="text-[color:var(--color-text-secondary)] min-w-[70px]">{item.coefficient}</span>
                  <span className="text-xs text-[color:var(--color-text-tertiary)] min-w-[70px]">p={item.pvalue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Predictions Sample */}
      <Card>
        <h3 className="mb-4">Échantillon de prédictions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Valeur réelle</th>
                <th className="text-left py-3 px-4">Valeur prédite</th>
                <th className="text-left py-3 px-4">Erreur</th>
                <th className="text-left py-3 px-4">Erreur %</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '10234', actual: 1245.50, predicted: 1289.23, error: 43.73, errorPct: 3.5 },
                { id: '10235', actual: 2341.00, predicted: 2298.45, error: -42.55, errorPct: -1.8 },
                { id: '10236', actual: 876.25, predicted: 892.10, error: 15.85, errorPct: 1.8 },
                { id: '10237', actual: 3456.80, predicted: 3512.34, error: 55.54, errorPct: 1.6 },
                { id: '10238', actual: 1567.90, predicted: 1543.22, error: -24.68, errorPct: -1.6 }
              ].map((row) => (
                <tr key={row.id} className="border-b border-[color:var(--color-border-light)] hover:bg-[color:var(--color-bg-secondary)]">
                  <td className="py-3 px-4">
                    <code className="text-xs">{row.id}</code>
                  </td>
                  <td className="py-3 px-4">${row.actual.toFixed(2)}</td>
                  <td className="py-3 px-4">${row.predicted.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={row.error > 0 ? 'text-orange-600' : 'text-green-600'}>
                      {row.error > 0 ? '+' : ''}{row.error.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={Math.abs(row.errorPct) > 2 ? 'text-orange-600' : 'text-green-600'}>
                      {row.errorPct > 0 ? '+' : ''}{row.errorPct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm">Voir toutes les prédictions (4,319 lignes)</Button>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-blue-900 mb-2">Recommandations</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Le modèle présente d'excellentes performances (R²=0.847)</li>
              <li>• La variable <code className="text-xs bg-blue-100 px-1 rounded">age</code> est le prédicteur le plus important (34.2%)</li>
              <li>• Envisagez d'ajouter des interactions entre <code className="text-xs bg-blue-100 px-1 rounded">age</code> et <code className="text-xs bg-blue-100 px-1 rounded">region</code></li>
              <li>• La variable <code className="text-xs bg-blue-100 px-1 rounded">tenure</code> a une p-value élevée (0.089), considérez sa suppression</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* API Integration */}
      <Card>
        <h4 className="mb-3">Appel API - Analysis Service</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            POST /api/v1/analysis/execute<br/>
            Content-Type: application/json<br/>
            <br/>
            {'{'}<br/>
            &nbsp;&nbsp;"dataset_id": "dataset_123",<br/>
            &nbsp;&nbsp;"analysis_type": "regression",<br/>
            &nbsp;&nbsp;"target_variable": "revenue",<br/>
            &nbsp;&nbsp;"features": ["age", "region", "category", ...],<br/>
            &nbsp;&nbsp;"test_size": 0.3<br/>
            {'}'}<br/>
            <br/>
            <span className="text-blue-400">// Response:</span><br/>
            {'{'}<br/>
            &nbsp;&nbsp;"results": {'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"r2_score": 0.847,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"rmse": 234.5,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"feature_importance": {'{'} ... {'}'},<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"predictions": [...]<br/>
            &nbsp;&nbsp;{'}'}<br/>
            {'}'}
          </code>
        </div>
      </Card>
    </div>
  );
}
