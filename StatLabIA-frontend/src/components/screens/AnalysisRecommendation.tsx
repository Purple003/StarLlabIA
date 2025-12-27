import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { StatusBadge } from '../StatusBadge';
import { Brain, TrendingUp, Users, Target, Sparkles, ChevronRight } from 'lucide-react';

export function AnalysisRecommendation({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[color:var(--color-text-primary)] mb-2">Recommandations d'analyse</h1>
        <p className="text-[color:var(--color-text-secondary)]">
          IA suggère les meilleures analyses pour vos données
        </p>
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-[color:var(--color-primary)] to-purple-600 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">Analyse automatique complétée</h3>
            <p className="text-white/90 mb-4">
              StatLabAI a analysé votre dataset et identifié 4 opportunités d'analyse pertinentes basées sur la structure et les patterns détectés dans vos données.
            </p>
            <div className="flex gap-3">
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                15,234 lignes analysées
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                18 features détectées
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                3 types de données
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommended Analyses */}
      <div className="space-y-4">
        <h3>Analyses recommandées</h3>
        
        {[
          {
            id: 'regression',
            title: 'Analyse de régression',
            description: 'Prédire les valeurs de revenue basées sur age, region et category',
            icon: TrendingUp,
            confidence: 95,
            complexity: 'Faible',
            time: '~2 min',
            insights: [
              'Forte corrélation détectée entre age et revenue (r=0.84)',
              '3 features explicatives identifiées',
              'R² attendu: 0.78-0.85'
            ],
            color: 'blue',
            recommended: true
          },
          {
            id: 'clustering',
            title: 'Segmentation (Clustering)',
            description: 'Identifier 4-5 groupes distincts de clients',
            icon: Users,
            confidence: 88,
            complexity: 'Moyenne',
            time: '~4 min',
            insights: [
              '5 clusters optimaux suggérés (silhouette score: 0.72)',
              'Variables discriminantes: age, revenue, frequency',
              'Patterns de comportement identifiés'
            ],
            color: 'green',
            recommended: true
          },
          {
            id: 'classification',
            title: 'Classification',
            description: 'Prédire le status (active/inactive) des utilisateurs',
            icon: Target,
            confidence: 82,
            complexity: 'Moyenne',
            time: '~3 min',
            insights: [
              'Dataset balancé: 52% active, 48% inactive',
              'Précision attendue: 85-90%',
              '7 features prédictives identifiées'
            ],
            color: 'purple',
            recommended: false
          },
          {
            id: 'timeseries',
            title: 'Analyse temporelle',
            description: 'Détecter les tendances et saisonnalités',
            icon: TrendingUp,
            confidence: 76,
            complexity: 'Élevée',
            time: '~5 min',
            insights: [
              'Colonne date détectée avec 360 points temporels',
              'Tendance haussière identifiée (+12% YoY)',
              'Saisonnalité mensuelle possible'
            ],
            color: 'orange',
            recommended: false
          }
        ].map((analysis) => {
          const Icon = analysis.icon;
          const colorMap = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          };
          
          return (
            <Card key={analysis.id} padding="lg" hover className={`border-2 ${analysis.recommended ? 'border-[color:var(--color-primary)]' : 'border-transparent'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${colorMap[analysis.color as keyof typeof colorMap]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4>{analysis.title}</h4>
                        {analysis.recommended && (
                          <StatusBadge status="success">
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            Recommandé
                          </StatusBadge>
                        )}
                      </div>
                      <p className="text-[color:var(--color-text-secondary)]">{analysis.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl mb-1">{analysis.confidence}%</div>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">confiance</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm mb-2">Insights clés :</p>
                    <ul className="space-y-1">
                      {analysis.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-[color:var(--color-text-secondary)] flex gap-2">
                          <span className="text-[color:var(--color-secondary)]">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-[color:var(--color-text-tertiary)]">
                      <span>Complexité: {analysis.complexity}</span>
                      <span>Temps estimé: {analysis.time}</span>
                    </div>
                    <Button 
                      variant={analysis.recommended ? "primary" : "outline"} 
                      size="sm"
                      onClick={() => onNavigate('results')}
                    >
                      Lancer l'analyse
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Custom Analysis */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="mb-2">Analyse personnalisée</h4>
            <p className="text-[color:var(--color-text-secondary)]">
              Configurez manuellement les paramètres d'analyse
            </p>
          </div>
          <Button variant="outline">
            <Brain className="w-4 h-4" />
            Créer une analyse
          </Button>
        </div>
      </Card>

      {/* API Integration */}
      <Card>
        <h4 className="mb-3">Appel API - Analysis Service</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            POST /api/v1/analysis/recommend<br/>
            Content-Type: application/json<br/>
            <br/>
            {'{'}<br/>
            &nbsp;&nbsp;"dataset_id": "dataset_123",<br/>
            &nbsp;&nbsp;"auto_detect": true,<br/>
            &nbsp;&nbsp;"analysis_types": ["all"]<br/>
            {'}'}<br/>
            <br/>
            <span className="text-blue-400">// Response:</span><br/>
            {'{'}<br/>
            &nbsp;&nbsp;"recommendations": [<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "regression",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"confidence": 0.95,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parameters": {'{'} ... {'}'},<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"insights": [...]<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
            &nbsp;&nbsp;]<br/>
            {'}'}
          </code>
        </div>
      </Card>
    </div>
  );
}
