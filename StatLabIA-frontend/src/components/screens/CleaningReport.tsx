import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { StatusBadge } from '../StatusBadge';
import { AlertTriangle, CheckCircle2, XCircle, Info, TrendingUp, Zap } from 'lucide-react';

export function CleaningReport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[color:var(--color-text-primary)] mb-2">Rapport de nettoyage</h1>
          <p className="text-[color:var(--color-text-secondary)]">
            Analyse de la qualité des données et problèmes détectés
          </p>
        </div>
        <Button variant="primary">Appliquer les corrections</Button>
      </div>

      {/* Overall Quality Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" className="col-span-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Score de qualité global</p>
              <h1 className="text-[color:var(--color-secondary)] mb-2">94.5%</h1>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+3.2% après nettoyage</span>
              </div>
            </div>
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="10" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke="var(--color-secondary)" 
                  strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 50 * 0.945} ${2 * Math.PI * 50}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">94.5%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Lignes valides</p>
              <h3>14,398</h3>
              <p className="text-xs text-[color:var(--color-text-tertiary)] mt-1">sur 15,234</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">Problèmes</p>
              <h3>836</h3>
              <p className="text-xs text-orange-600 mt-1">5.5% des données</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Issues Summary */}
      <Card>
        <h3 className="mb-4">Résumé des problèmes détectés</h3>
        <div className="space-y-4">
          {[
            { 
              type: 'Valeurs manquantes', 
              count: 412, 
              severity: 'warning' as const, 
              percentage: 2.7,
              action: 'Imputation recommandée',
              columns: ['age', 'revenue', 'email']
            },
            { 
              type: 'Doublons', 
              count: 234, 
              severity: 'error' as const, 
              percentage: 1.5,
              action: 'Suppression proposée',
              columns: ['id', 'transaction_id']
            },
            { 
              type: 'Valeurs aberrantes', 
              count: 123, 
              severity: 'warning' as const, 
              percentage: 0.8,
              action: 'Vérification manuelle',
              columns: ['price', 'quantity']
            },
            { 
              type: 'Format invalide', 
              count: 67, 
              severity: 'error' as const, 
              percentage: 0.4,
              action: 'Correction automatique',
              columns: ['date', 'phone']
            }
          ].map((issue, idx) => (
            <div key={idx} className="p-4 border border-[color:var(--color-border)] rounded-lg hover:border-[color:var(--color-primary)] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5>{issue.type}</h5>
                    <StatusBadge status={issue.severity}>
                      {issue.count} occurrences
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-[color:var(--color-text-secondary)] mb-2">
                    {issue.action}
                  </p>
                  <div className="flex gap-2">
                    {issue.columns.map((col) => (
                      <code key={col} className="text-xs px-2 py-1 bg-[color:var(--color-bg-tertiary)] rounded">
                        {col}
                      </code>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl mb-1">{issue.percentage}%</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">du dataset</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Voir les détails</Button>
                <Button variant="primary" size="sm">Appliquer la correction</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Column Quality Analysis */}
      <Card>
        <h3 className="mb-4">Analyse par colonne</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="text-left py-3 px-4">Colonne</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Complétude</th>
                <th className="text-left py-3 px-4">Validité</th>
                <th className="text-left py-3 px-4">Unicité</th>
                <th className="text-left py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'id', type: 'Integer', completeness: 100, validity: 100, uniqueness: 100, status: 'success' },
                { name: 'name', type: 'String', completeness: 98.5, validity: 100, uniqueness: 92, status: 'success' },
                { name: 'email', type: 'String', completeness: 94.2, validity: 96.8, uniqueness: 98, status: 'warning' },
                { name: 'age', type: 'Integer', completeness: 96.7, validity: 98.3, uniqueness: 45, status: 'success' },
                { name: 'revenue', type: 'Float', completeness: 92.1, validity: 95.4, uniqueness: 89, status: 'warning' },
                { name: 'date', type: 'DateTime', completeness: 99.2, validity: 88.6, uniqueness: 78, status: 'error' }
              ].map((col, idx) => (
                <tr key={idx} className="border-b border-[color:var(--color-border-light)] hover:bg-[color:var(--color-bg-secondary)]">
                  <td className="py-3 px-4">
                    <code className="text-sm">{col.name}</code>
                  </td>
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">{col.type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[color:var(--color-bg-tertiary)] rounded-full h-2 w-16">
                        <div 
                          className={`h-2 rounded-full ${col.completeness >= 95 ? 'bg-green-500' : 'bg-orange-500'}`}
                          style={{ width: `${col.completeness}%` }}
                        />
                      </div>
                      <span className="text-xs">{col.completeness}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[color:var(--color-bg-tertiary)] rounded-full h-2 w-16">
                        <div 
                          className={`h-2 rounded-full ${col.validity >= 95 ? 'bg-green-500' : 'bg-orange-500'}`}
                          style={{ width: `${col.validity}%` }}
                        />
                      </div>
                      <span className="text-xs">{col.validity}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-[color:var(--color-text-secondary)]">{col.uniqueness}%</td>
                  <td className="py-3 px-4">
                    {col.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {col.status === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                    {col.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* API Integration */}
      <Card>
        <h4 className="mb-3">Appel API - Cleaning Service</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            POST /api/v1/cleaning/analyze<br/>
            Content-Type: application/json<br/>
            <br/>
            {'{'}<br/>
            &nbsp;&nbsp;"dataset_id": "dataset_123",<br/>
            &nbsp;&nbsp;"operations": [<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"detect_missing",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"detect_duplicates",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"detect_outliers",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"validate_format"<br/>
            &nbsp;&nbsp;],<br/>
            &nbsp;&nbsp;"auto_correct": false<br/>
            {'}'}<br/>
            <br/>
            <span className="text-blue-400">// Response:</span><br/>
            {'{'}<br/>
            &nbsp;&nbsp;"quality_score": 94.5,<br/>
            &nbsp;&nbsp;"issues": [{'{'} ... {'}'}],<br/>
            &nbsp;&nbsp;"recommendations": [{'{'} ... {'}'}]<br/>
            {'}'}
          </code>
        </div>
      </Card>
    </div>
  );
}
