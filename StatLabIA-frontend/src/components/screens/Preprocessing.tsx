import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Settings2, Plus, Trash2, Check } from 'lucide-react';

export function Preprocessing() {
  const [selectedOperations, setSelectedOperations] = useState<string[]>(['normalize', 'encoding']);
  
  const toggleOperation = (op: string) => {
    setSelectedOperations(prev => 
      prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[color:var(--color-text-primary)] mb-2">Prétraitement des données</h1>
          <p className="text-[color:var(--color-text-secondary)]">
            Configurez les transformations avant l'analyse
          </p>
        </div>
        <Button variant="primary">Appliquer les transformations</Button>
      </div>

      {/* Pipeline Preview */}
      <Card>
        <h3 className="mb-4">Pipeline de traitement</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {[
            { id: 'import', label: 'Import', active: true, completed: true },
            { id: 'cleaning', label: 'Nettoyage', active: true, completed: true },
            { id: 'preprocessing', label: 'Prétraitement', active: true, completed: false },
            { id: 'analysis', label: 'Analyse', active: false, completed: false },
            { id: 'export', label: 'Export', active: false, completed: false }
          ].map((step, idx, arr) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                step.active 
                  ? 'border-[color:var(--color-primary)] bg-blue-50' 
                  : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-[color:var(--color-secondary)] text-white' 
                    : step.active 
                    ? 'bg-[color:var(--color-primary)] text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.completed ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-sm whitespace-nowrap">{step.label}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className="w-8 h-0.5 bg-[color:var(--color-border)]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Operations */}
        <Card>
          <h3 className="mb-4">Opérations disponibles</h3>
          <div className="space-y-3">
            {[
              { 
                id: 'normalize', 
                name: 'Normalisation', 
                desc: "Mise à l'échelle des valeurs numériques (0-1)",
                params: ['min_value', 'max_value']
              },
              { 
                id: 'standardize', 
                name: 'Standardisation', 
                desc: 'Centrage et réduction (moyenne=0, écart-type=1)',
                params: ['mean', 'std']
              },
              { 
                id: 'encoding', 
                name: 'Encodage catégoriel', 
                desc: 'One-hot encoding des variables catégorielles',
                params: ['columns', 'strategy']
              },
              { 
                id: 'imputation', 
                name: 'Imputation', 
                desc: 'Remplissage des valeurs manquantes',
                params: ['strategy', 'fill_value']
              },
              { 
                id: 'feature_eng', 
                name: 'Feature Engineering', 
                desc: 'Création de nouvelles variables dérivées',
                params: ['operations', 'target_cols']
              },
              { 
                id: 'reduction', 
                name: 'Réduction dimensionnelle', 
                desc: 'PCA, t-SNE pour réduire le nombre de features',
                params: ['method', 'n_components']
              }
            ].map((op) => (
              <div 
                key={op.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOperations.includes(op.id)
                    ? 'border-[color:var(--color-primary)] bg-blue-50'
                    : 'border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]'
                }`}
                onClick={() => toggleOperation(op.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="mb-1">{op.name}</h5>
                    <p className="text-sm text-[color:var(--color-text-secondary)]">{op.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedOperations.includes(op.id)
                      ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)]'
                      : 'border-[color:var(--color-border)]'
                  }`}>
                    {selectedOperations.includes(op.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {op.params.map((param) => (
                    <code key={param} className="text-xs px-2 py-0.5 bg-[color:var(--color-bg-tertiary)] rounded">
                      {param}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4">Configuration</h3>
            {selectedOperations.length === 0 ? (
              <div className="text-center py-8 text-[color:var(--color-text-tertiary)]">
                <Settings2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Sélectionnez une opération pour la configurer</p>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedOperations.includes('normalize') && (
                  <div className="p-4 bg-[color:var(--color-bg-secondary)] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5>Normalisation</h5>
                      <button 
                        onClick={() => toggleOperation('normalize')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Colonnes</label>
                        <select className="w-full px-3 py-2 border border-[color:var(--color-border)] rounded-lg text-sm">
                          <option>Toutes les colonnes numériques</option>
                          <option>Sélection personnalisée</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-1">Min</label>
                          <input type="number" defaultValue="0" className="w-full px-3 py-2 border border-[color:var(--color-border)] rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Max</label>
                          <input type="number" defaultValue="1" className="w-full px-3 py-2 border border-[color:var(--color-border)] rounded-lg text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOperations.includes('encoding') && (
                  <div className="p-4 bg-[color:var(--color-bg-secondary)] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5>Encodage catégoriel</h5>
                      <button 
                        onClick={() => toggleOperation('encoding')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Méthode</label>
                        <select className="w-full px-3 py-2 border border-[color:var(--color-border)] rounded-lg text-sm">
                          <option>One-Hot Encoding</option>
                          <option>Label Encoding</option>
                          <option>Target Encoding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Colonnes catégorielles</label>
                        <div className="space-y-2">
                          {['category', 'status', 'region'].map((col) => (
                            <label key={col} className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <code className="text-xs">{col}</code>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h4 className="mb-3">Aperçu des transformations</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm p-3 bg-[color:var(--color-bg-secondary)] rounded">
                <span>Lignes totales</span>
                <span>15,234 → 14,398</span>
              </div>
              <div className="flex items-center justify-between text-sm p-3 bg-[color:var(--color-bg-secondary)] rounded">
                <span>Colonnes</span>
                <span>12 → 18 (+6 encodées)</span>
              </div>
              <div className="flex items-center justify-between text-sm p-3 bg-[color:var(--color-bg-secondary)] rounded">
                <span>Taille</span>
                <span>2.4 MB → 3.1 MB</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* API Integration */}
      <Card>
        <h4 className="mb-3">Appel API - Processing Service</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            POST /api/v1/processing/transform<br/>
            Content-Type: application/json<br/>
            <br/>
            {'{'}<br/>
            &nbsp;&nbsp;"dataset_id": "dataset_123",<br/>
            &nbsp;&nbsp;"operations": [<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "normalize",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"params": {'{'} "min": 0, "max": 1 {'}'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{'}'},<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "encoding",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"params": {'{'} "method": "onehot" {'}'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
            &nbsp;&nbsp;],<br/>
            &nbsp;&nbsp;"output_format": "parquet"<br/>
            {'}'}
          </code>
        </div>
      </Card>
    </div>
  );
}