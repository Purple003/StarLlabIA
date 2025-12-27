import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { FileText, FileSpreadsheet, FileCode, Image, Download, Check, Mail, Cloud } from 'lucide-react';

export function Export() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['pdf']);
  
  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[color:var(--color-text-primary)] mb-2">Export des résultats</h1>
        <p className="text-[color:var(--color-text-secondary)]">
          Exportez vos analyses dans différents formats
        </p>
      </div>

      {/* Export Formats */}
      <div>
        <h3 className="mb-4">Sélectionner les formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              id: 'pdf', 
              name: 'PDF', 
              icon: FileText, 
              desc: 'Rapport complet avec graphiques',
              size: '~2.3 MB',
              color: 'red'
            },
            { 
              id: 'excel', 
              name: 'Excel', 
              icon: FileSpreadsheet, 
              desc: 'Données et résultats tabulaires',
              size: '~1.8 MB',
              color: 'green'
            },
            { 
              id: 'csv', 
              name: 'CSV', 
              icon: FileSpreadsheet, 
              desc: 'Données brutes exportées',
              size: '~0.8 MB',
              color: 'blue'
            },
            { 
              id: 'json', 
              name: 'JSON', 
              icon: FileCode, 
              desc: 'Format API structuré',
              size: '~1.2 MB',
              color: 'orange'
            },
            { 
              id: 'html', 
              name: 'HTML', 
              icon: FileCode, 
              desc: 'Rapport interactif web',
              size: '~3.5 MB',
              color: 'purple'
            },
            { 
              id: 'png', 
              name: 'PNG', 
              icon: Image, 
              desc: 'Visualisations en images',
              size: '~4.2 MB',
              color: 'pink'
            }
          ].map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormats.includes(format.id);
            
            return (
              <Card 
                key={format.id}
                padding="md" 
                hover 
                className={`cursor-pointer border-2 ${isSelected ? 'border-[color:var(--color-primary)] bg-blue-50' : 'border-transparent'}`}
                onClick={() => toggleFormat(format.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    format.color === 'red' ? 'bg-red-100' :
                    format.color === 'green' ? 'bg-green-100' :
                    format.color === 'blue' ? 'bg-blue-100' :
                    format.color === 'orange' ? 'bg-orange-100' :
                    format.color === 'purple' ? 'bg-purple-100' :
                    'bg-pink-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      format.color === 'red' ? 'text-red-600' :
                      format.color === 'green' ? 'text-green-600' :
                      format.color === 'blue' ? 'text-blue-600' :
                      format.color === 'orange' ? 'text-orange-600' :
                      format.color === 'purple' ? 'text-purple-600' :
                      'text-pink-600'
                    }`} />
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)]'
                      : 'border-[color:var(--color-border)]'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <h5 className="mb-1">{format.name}</h5>
                <p className="text-sm text-[color:var(--color-text-secondary)] mb-2">{format.desc}</p>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">{format.size}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <Card>
        <h3 className="mb-4">Options d'export</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Contenu à inclure</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Résumé de l'analyse",
                'Métriques de performance',
                'Importance des features',
                'Prédictions complètes',
                'Visualisations',
                'Code Python généré',
                'Recommandations',
                'Métadonnées du dataset'
              ].map((option) => (
                <label key={option} className="flex items-center gap-2 p-3 bg-[color:var(--color-bg-secondary)] rounded-lg cursor-pointer hover:bg-[color:var(--color-bg-tertiary)]">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Nom du fichier</label>
              <input 
                type="text" 
                defaultValue="sales_analysis_2024" 
                className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Qualité des images</label>
              <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                <option>Haute (300 DPI)</option>
                <option>Moyenne (150 DPI)</option>
                <option>Basse (72 DPI)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Inclure les données brutes nettoyées</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Delivery Method */}
      <Card>
        <h3 className="mb-4">Méthode de livraison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-[color:var(--color-primary)] bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[color:var(--color-primary)] rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5>Téléchargement</h5>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">Immédiat</p>
              </div>
            </div>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Télécharger directement sur votre appareil
            </p>
          </div>

          <div className="p-4 border-2 border-[color:var(--color-border)] rounded-lg hover:border-[color:var(--color-primary)] cursor-pointer transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h5>Email</h5>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">~2 min</p>
              </div>
            </div>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Recevoir par email
            </p>
          </div>

          <div className="p-4 border-2 border-[color:var(--color-border)] rounded-lg hover:border-[color:var(--color-primary)] cursor-pointer transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h5>Cloud</h5>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">Instantané</p>
              </div>
            </div>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Sauvegarder sur le cloud
            </p>
          </div>
        </div>
      </Card>

      {/* Export Summary */}
      <Card className="bg-[color:var(--color-bg-secondary)]">
        <h4 className="mb-4">Résumé de l'export</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[color:var(--color-text-secondary)]">Formats sélectionnés</span>
            <span>{selectedFormats.length} format{selectedFormats.length > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[color:var(--color-text-secondary)]">Taille estimée</span>
            <span>
              {selectedFormats.reduce((sum, format) => {
                const sizes: Record<string, number> = { pdf: 2.3, excel: 1.8, csv: 0.8, json: 1.2, html: 3.5, png: 4.2 };
                return sum + (sizes[format] || 0);
              }, 0).toFixed(1)} MB
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[color:var(--color-text-secondary)]">Temps estimé</span>
            <span>~{Math.ceil(selectedFormats.length * 1.5)} secondes</span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          Prévisualiser
        </Button>
        <Button variant="primary" className="flex-1" disabled={selectedFormats.length === 0}>
          <Download className="w-4 h-4" />
          Exporter ({selectedFormats.length})
        </Button>
      </div>

      {/* Recent Exports */}
      <Card>
        <h4 className="mb-4">Exports récents</h4>
        <div className="space-y-3">
          {[
            { name: 'sales_analysis_2024.pdf', date: 'Il y a 2h', size: '2.3 MB', status: 'success' },
            { name: 'customer_segmentation.xlsx', date: 'Hier', size: '1.8 MB', status: 'success' },
            { name: 'market_trends_report.html', date: 'Il y a 2j', size: '3.5 MB', status: 'success' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[color:var(--color-bg-secondary)] rounded-lg hover:bg-[color:var(--color-bg-tertiary)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">
                    {item.size} • {item.date}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* API Integration */}
      <Card>
        <h4 className="mb-3">Appel API - Export Service</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            POST /api/v1/export/generate<br/>
            Content-Type: application/json<br/>
            <br/>
            {'{'}<br/>
            &nbsp;&nbsp;"analysis_id": "analysis_456",<br/>
            &nbsp;&nbsp;"formats": ["pdf", "excel", "csv"],<br/>
            &nbsp;&nbsp;"options": {'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"include_visualizations": true,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"include_raw_data": true,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;"image_quality": "high"<br/>
            &nbsp;&nbsp;{'}'},<br/>
            &nbsp;&nbsp;"delivery_method": "download | email | cloud"<br/>
            {'}'}<br/>
            <br/>
            <span className="text-blue-400">// Response: Download URLs or delivery confirmation</span>
          </code>
        </div>
      </Card>
    </div>
  );
}