import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { BarChart3, LineChart, PieChart as PieChartIcon, ScatterChart, Download, Settings, Maximize2 } from 'lucide-react';

export function Visualization() {
  const [selectedChart, setSelectedChart] = useState('correlation');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[color:var(--color-text-primary)] mb-2">Visualisations</h1>
          <p className="text-[color:var(--color-text-secondary)]">
            Graphiques et visualisations interactives
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="w-4 h-4" />
            Personnaliser
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4" />
            Exporter tout
          </Button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { id: 'correlation', label: 'Matrice de corrélation', icon: BarChart3 },
          { id: 'distribution', label: 'Distribution', icon: LineChart },
          { id: 'scatter', label: 'Nuage de points', icon: ScatterChart },
          { id: 'importance', label: 'Importance features', icon: BarChart3 },
          { id: 'residuals', label: 'Résidus', icon: LineChart },
          { id: 'predictions', label: 'Prédictions vs Réel', icon: ScatterChart }
        ].map((chart) => {
          const Icon = chart.icon;
          return (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 whitespace-nowrap transition-all ${
                selectedChart === chart.id
                  ? 'border-[color:var(--color-primary)] bg-blue-50 text-[color:var(--color-primary)]'
                  : 'border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{chart.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Visualization */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3>
            {selectedChart === 'correlation' && 'Matrice de corrélation'}
            {selectedChart === 'distribution' && 'Distribution des variables'}
            {selectedChart === 'scatter' && 'Relations entre variables'}
            {selectedChart === 'importance' && 'Importance des features'}
            {selectedChart === 'residuals' && 'Analyse des résidus'}
            {selectedChart === 'predictions' && 'Prédictions vs Valeurs réelles'}
          </h3>
          <Button variant="ghost" size="sm">
            <Maximize2 className="w-4 h-4" />
            Plein écran
          </Button>
        </div>

        {/* Correlation Matrix */}
        {selectedChart === 'correlation' && (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              <div className="col-span-1" />
              {['age', 'revenue', 'frequency', 'tenure', 'status', 'region'].map((label) => (
                <div key={label} className="text-xs text-center text-[color:var(--color-text-tertiary)]">
                  <code>{label}</code>
                </div>
              ))}
              
              {[
                ['age', 1.00, 0.84, 0.52, 0.45, 0.23, 0.31],
                ['revenue', 0.84, 1.00, 0.67, 0.39, 0.19, 0.42],
                ['frequency', 0.52, 0.67, 1.00, 0.28, 0.15, 0.36],
                ['tenure', 0.45, 0.39, 0.28, 1.00, 0.11, 0.22],
                ['status', 0.23, 0.19, 0.15, 0.11, 1.00, 0.08],
                ['region', 0.31, 0.42, 0.36, 0.22, 0.08, 1.00]
              ].map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  <div className="flex items-center justify-end pr-2">
                    <code className="text-xs text-[color:var(--color-text-tertiary)]">{row[0]}</code>
                  </div>
                  {(row.slice(1) as number[]).map((value, colIdx) => {
                    const intensity = Math.abs(value);
                    const isPositive = value >= 0;
                    const bgColor = isPositive
                      ? `rgba(76, 175, 80, ${intensity * 0.8})`
                      : `rgba(244, 67, 54, ${intensity * 0.8})`;
                    
                    return (
                      <div
                        key={colIdx}
                        className="aspect-square rounded flex items-center justify-center text-xs"
                        style={{ backgroundColor: bgColor, color: intensity > 0.5 ? 'white' : '#333' }}
                      >
                        {value.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Forte corrélation positive entre age et revenue (0.84) • Corrélation modérée entre revenue et frequency (0.67)
            </p>
          </div>
        )}

        {/* Distribution Chart */}
        {selectedChart === 'distribution' && (
          <div className="space-y-4">
            <div className="h-64 bg-[color:var(--color-bg-secondary)] rounded-lg flex items-end justify-around px-8 py-4">
              {[32, 45, 67, 89, 76, 54, 43, 56, 78, 65, 54, 38, 29, 41, 52].map((height, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[40px]">
                  <div 
                    className="w-full bg-gradient-to-t from-[color:var(--color-primary)] to-[color:var(--color-secondary)] rounded-t transition-all duration-500 hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  {idx % 3 === 0 && (
                    <span className="text-xs text-[color:var(--color-text-tertiary)]">{idx * 100}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-[color:var(--color-bg-secondary)] rounded">
                <p className="text-[color:var(--color-text-tertiary)] mb-1">Moyenne</p>
                <p>542.3</p>
              </div>
              <div className="text-center p-3 bg-[color:var(--color-bg-secondary)] rounded">
                <p className="text-[color:var(--color-text-tertiary)] mb-1">Médiane</p>
                <p>498.7</p>
              </div>
              <div className="text-center p-3 bg-[color:var(--color-bg-secondary)] rounded">
                <p className="text-[color:var(--color-text-tertiary)] mb-1">Écart-type</p>
                <p>234.5</p>
              </div>
            </div>
          </div>
        )}

        {/* Scatter Plot */}
        {selectedChart === 'scatter' && (
          <div className="space-y-4">
            <div className="h-80 bg-[color:var(--color-bg-secondary)] rounded-lg relative p-8">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <g key={i}>
                    <line 
                      x1={i * 100} 
                      y1="0" 
                      x2={i * 100} 
                      y2="300" 
                      stroke="var(--color-border)" 
                      strokeWidth="1" 
                      opacity="0.3"
                    />
                    <line 
                      x1="0" 
                      y1={i * 75} 
                      x2="400" 
                      y2={i * 75} 
                      stroke="var(--color-border)" 
                      strokeWidth="1" 
                      opacity="0.3"
                    />
                  </g>
                ))}
                
                {/* Data points */}
                {Array.from({ length: 50 }, (_, i) => ({
                  x: Math.random() * 380 + 10,
                  y: Math.random() * 280 + 10
                })).map((point, idx) => (
                  <circle
                    key={idx}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="var(--color-primary)"
                    opacity="0.6"
                    className="hover:opacity-100 transition-opacity"
                  />
                ))}
                
                {/* Trend line */}
                <line 
                  x1="10" 
                  y1="280" 
                  x2="390" 
                  y2="20" 
                  stroke="var(--color-secondary)" 
                  strokeWidth="2" 
                  strokeDasharray="5,5"
                />
              </svg>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-[color:var(--color-text-tertiary)]">
                age
              </div>
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2 -rotate-90 text-xs text-[color:var(--color-text-tertiary)]">
                revenue
              </div>
            </div>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Corrélation positive forte (r=0.84) • Tendance linéaire claire • Quelques valeurs aberrantes détectées
            </p>
          </div>
        )}

        {/* Feature Importance */}
        {selectedChart === 'importance' && (
          <div className="space-y-3">
            {[
              { feature: 'age', value: 34.2, color: 'from-blue-500 to-blue-600' },
              { feature: 'region_encoded', value: 21.8, color: 'from-green-500 to-green-600' },
              { feature: 'category_encoded', value: 19.5, color: 'from-purple-500 to-purple-600' },
              { feature: 'frequency', value: 12.4, color: 'from-orange-500 to-orange-600' },
              { feature: 'status_active', value: 8.6, color: 'from-pink-500 to-pink-600' },
              { feature: 'tenure', value: 3.5, color: 'from-gray-500 to-gray-600' }
            ].map((item) => (
              <div key={item.feature} className="space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm">{item.feature}</code>
                  <span className="text-sm">{item.value}%</span>
                </div>
                <div className="h-8 bg-[color:var(--color-bg-tertiary)] rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 flex items-center justify-end pr-3`}
                    style={{ width: `${item.value * 2.5}%` }}
                  >
                    {item.value > 15 && (
                      <span className="text-white text-xs">{item.value}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4>Distribution par région</h4>
            <PieChartIcon className="w-5 h-5 text-[color:var(--color-text-tertiary)]" />
          </div>
          <div className="flex items-center justify-center h-48">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="40" />
              <circle 
                cx="90" 
                cy="90" 
                r="70" 
                fill="none" 
                stroke="#2E5AAC" 
                strokeWidth="40" 
                strokeDasharray="154 440"
                transform="rotate(-90 90 90)"
              />
              <circle 
                cx="90" 
                cy="90" 
                r="70" 
                fill="none" 
                stroke="#4CAF50" 
                strokeWidth="40" 
                strokeDasharray="110 440"
                strokeDashoffset="-154"
                transform="rotate(-90 90 90)"
              />
              <circle 
                cx="90" 
                cy="90" 
                r="70" 
                fill="none" 
                stroke="#FF9800" 
                strokeWidth="40" 
                strokeDasharray="88 440"
                strokeDashoffset="-264"
                transform="rotate(-90 90 90)"
              />
            </svg>
          </div>
          <div className="space-y-2 mt-4">
            {[
              { label: 'Nord', value: 35, color: 'bg-[#2E5AAC]' },
              { label: 'Sud', value: 25, color: 'bg-[#4CAF50]' },
              { label: 'Est', value: 20, color: 'bg-[#FF9800]' },
              { label: 'Ouest', value: 20, color: 'bg-gray-300' }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4>Tendance temporelle</h4>
            <LineChart className="w-5 h-5 text-[color:var(--color-text-tertiary)]" />
          </div>
          <div className="h-48 bg-[color:var(--color-bg-secondary)] rounded-lg p-4">
            <svg width="100%" height="100%" viewBox="0 0 300 150">
              <path 
                d="M 10,120 L 30,110 L 50,100 L 70,95 L 90,85 L 110,80 L 130,70 L 150,65 L 170,55 L 190,50 L 210,45 L 230,40 L 250,35 L 270,30 L 290,25" 
                fill="none" 
                stroke="var(--color-primary)" 
                strokeWidth="3"
                strokeLinecap="round"
              />
              {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290].map((x, idx) => {
                const y = 120 - idx * 7;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--color-secondary)"
                    className="hover:r-6 transition-all"
                  />
                );
              })}
            </svg>
          </div>
          <p className="text-sm text-[color:var(--color-text-secondary)] mt-4">
            Croissance stable de +12.3% sur 12 mois
          </p>
        </Card>
      </div>

      {/* API Integration */}
      <Card>
        <h4 className="mb-3">Appel API - Visualization Service</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            POST /api/v1/visualization/generate<br/>
            Content-Type: application/json<br/>
            <br/>
            {'{'}<br/>
            &nbsp;&nbsp;"analysis_id": "analysis_456",<br/>
            &nbsp;&nbsp;"chart_type": "correlation | scatter | distribution",<br/>
            &nbsp;&nbsp;"variables": ["age", "revenue"],<br/>
            &nbsp;&nbsp;"format": "svg | png | interactive"<br/>
            {'}'}<br/>
            <br/>
            <span className="text-blue-400">// Response: SVG/PNG data or interactive config</span>
          </code>
        </div>
      </Card>
    </div>
  );
}
