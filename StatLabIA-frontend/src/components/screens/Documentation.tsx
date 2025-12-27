import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { BookOpen, Search, ExternalLink, Code, PlayCircle, FileText, Video, HelpCircle } from 'lucide-react';

export function Documentation() {
  const [selectedTopic, setSelectedTopic] = useState('getting-started');
  
  const topics = [
    { id: 'getting-started', title: 'Démarrage rapide', icon: PlayCircle },
    { id: 'import', title: 'Import de données', icon: FileText },
    { id: 'cleaning', title: 'Nettoyage', icon: FileText },
    { id: 'analysis', title: 'Analyses', icon: FileText },
    { id: 'api', title: 'API Reference', icon: Code },
    { id: 'faq', title: 'FAQ', icon: HelpCircle }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[color:var(--color-text-primary)] mb-2">Documentation</h1>
        <p className="text-[color:var(--color-text-secondary)]">
          Guides et ressources pour utiliser StatLabAI
        </p>
      </div>

      {/* Search */}
      <Card padding="md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--color-text-tertiary)]" />
          <input
            type="text"
            placeholder="Rechercher dans la documentation..."
            className="w-full pl-12 pr-4 py-3 border border-[color:var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="md">
            <h4 className="mb-4">Table des matières</h4>
            <div className="space-y-1">
              {topics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTopic === topic.id
                        ? 'bg-[color:var(--color-primary)] text-white'
                        : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-tertiary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {topic.title}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-[color:var(--color-border)]">
              <h5 className="mb-3 text-sm">Ressources</h5>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary)]">
                  <Video className="w-4 h-4" />
                  Tutoriels vidéo
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary)]">
                  <Code className="w-4 h-4" />
                  Exemples de code
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary)]">
                  <ExternalLink className="w-4 h-4" />
                  Forum communauté
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedTopic === 'getting-started' && (
            <>
              <Card>
                <h2 className="mb-4">Démarrage rapide</h2>
                <div className="prose max-w-none">
                  <p className="text-[color:var(--color-text-secondary)] mb-4">
                    Bienvenue sur StatLabAI ! Cette plateforme vous permet d'analyser vos données sans compétences techniques avancées. Suivez ces étapes pour commencer :
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3">1. Importer vos données</h4>
                      <p className="text-[color:var(--color-text-secondary)] mb-3">
                        Commencez par importer votre dataset depuis un fichier local, une base de données ou une API externe.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <code className="text-green-400 text-sm">
                          POST /api/v1/import/file<br/>
                          Content-Type: multipart/form-data<br/>
                          <br/>
                          Formats supportés: CSV, Excel, JSON, XML
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3">2. Nettoyer les données</h4>
                      <p className="text-[color:var(--color-text-secondary)] mb-3">
                        Le service de nettoyage détecte automatiquement les problèmes de qualité et propose des corrections.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-[color:var(--color-text-secondary)]">
                        <li>Valeurs manquantes</li>
                        <li>Doublons</li>
                        <li>Valeurs aberrantes</li>
                        <li>Format invalide</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3">3. Prétraiter et analyser</h4>
                      <p className="text-[color:var(--color-text-secondary)] mb-3">
                        Configurez les transformations nécessaires puis lancez l'analyse recommandée par l'IA.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-3">4. Visualiser et exporter</h4>
                      <p className="text-[color:var(--color-text-secondary)] mb-3">
                        Explorez les résultats via des visualisations interactives et exportez dans le format de votre choix.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-blue-50 border-2 border-blue-200">
                <div className="flex gap-4">
                  <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-blue-900 mb-2">Exemple complet</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Consultez notre guide pas-à-pas avec un dataset d'exemple pour comprendre le workflow complet.
                    </p>
                    <Button variant="primary" size="sm">
                      Voir l'exemple
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {selectedTopic === 'api' && (
            <>
              <Card>
                <h2 className="mb-4">API Reference</h2>
                <p className="text-[color:var(--color-text-secondary)] mb-6">
                  StatLabAI expose 6 microservices accessibles via API REST. Tous les endpoints utilisent le format JSON.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      service: 'Import Service',
                      endpoint: '/api/v1/import',
                      description: 'Importer des données depuis différentes sources',
                      methods: [
                        { method: 'POST', path: '/file', desc: 'Upload fichier local' },
                        { method: 'POST', path: '/database', desc: 'Connexion BDD' },
                        { method: 'POST', path: '/api', desc: 'Import depuis API externe' }
                      ]
                    },
                    {
                      service: 'Cleaning Service',
                      endpoint: '/api/v1/cleaning',
                      description: 'Détecter et corriger les problèmes de qualité',
                      methods: [
                        { method: 'POST', path: '/analyze', desc: 'Analyse de qualité' },
                        { method: 'POST', path: '/fix', desc: 'Appliquer corrections' }
                      ]
                    },
                    {
                      service: 'Processing Service',
                      endpoint: '/api/v1/processing',
                      description: 'Transformer et prétraiter les données',
                      methods: [
                        { method: 'POST', path: '/transform', desc: 'Appliquer transformations' },
                        { method: 'GET', path: '/operations', desc: 'Liste des opérations' }
                      ]
                    },
                    {
                      service: 'Analysis Service',
                      endpoint: '/api/v1/analysis',
                      description: 'Exécuter des analyses statistiques et ML',
                      methods: [
                        { method: 'POST', path: '/recommend', desc: 'Recommandations IA' },
                        { method: 'POST', path: '/execute', desc: 'Lancer analyse' }
                      ]
                    },
                    {
                      service: 'Visualization Service',
                      endpoint: '/api/v1/visualization',
                      description: 'Générer des visualisations',
                      methods: [
                        { method: 'POST', path: '/generate', desc: 'Créer graphique' },
                        { method: 'GET', path: '/types', desc: 'Types disponibles' }
                      ]
                    },
                    {
                      service: 'Export Service',
                      endpoint: '/api/v1/export',
                      description: 'Exporter résultats dans différents formats',
                      methods: [
                        { method: 'POST', path: '/generate', desc: 'Générer export' },
                        { method: 'GET', path: '/download/:id', desc: 'Télécharger fichier' }
                      ]
                    }
                  ].map((service) => (
                    <div key={service.service} className="border border-[color:var(--color-border)] rounded-lg p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="mb-1">{service.service}</h4>
                          <code className="text-xs text-[color:var(--color-text-tertiary)]">{service.endpoint}</code>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Active</span>
                      </div>
                      <p className="text-sm text-[color:var(--color-text-secondary)] mb-4">
                        {service.description}
                      </p>
                      <div className="space-y-2">
                        {service.methods.map((method) => (
                          <div key={method.path} className="flex items-center gap-3 p-2 bg-[color:var(--color-bg-secondary)] rounded">
                            <span className={`px-2 py-1 text-xs rounded ${
                              method.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {method.method}
                            </span>
                            <code className="text-xs flex-1">{method.path}</code>
                            <span className="text-xs text-[color:var(--color-text-tertiary)]">{method.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h4 className="mb-3">Authentification</h4>
                <p className="text-sm text-[color:var(--color-text-secondary)] mb-4">
                  Tous les appels API nécessitent un token d'authentification dans le header :
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-green-400 text-sm">
                    Authorization: Bearer YOUR_API_TOKEN<br/>
                    Content-Type: application/json
                  </code>
                </div>
              </Card>
            </>
          )}

          {selectedTopic === 'faq' && (
            <Card>
              <h2 className="mb-6">Questions fréquentes</h2>
              <div className="space-y-6">
                {[
                  {
                    q: 'Quels formats de fichiers sont supportés ?',
                    a: 'StatLabAI supporte CSV, Excel (.xlsx, .xls), JSON, XML et les connexions directes aux bases de données (PostgreSQL, MySQL, MongoDB).'
                  },
                  {
                    q: 'Quelle est la taille maximale de fichier ?',
                    a: 'La limite est de 100 MB par fichier. Pour des datasets plus volumineux, utilisez la connexion directe à une base de données.'
                  },
                  {
                    q: 'Les données sont-elles sécurisées ?',
                    a: 'Oui, toutes les données sont chiffrées en transit (TLS) et au repos. Vous pouvez supprimer vos données à tout moment depuis les paramètres.'
                  },
                  {
                    q: 'Comment fonctionnent les recommandations IA ?',
                    a: 'L\'IA analyse la structure, les types de données et les patterns pour suggérer les analyses les plus pertinentes automatiquement.'
                  },
                  {
                    q: 'Puis-je personnaliser les analyses ?',
                    a: 'Oui, en plus des recommandations automatiques, vous pouvez configurer manuellement tous les paramètres d\'analyse.'
                  },
                  {
                    q: 'Les visualisations sont-elles interactives ?',
                    a: 'Oui, toutes les visualisations sont interactives. Vous pouvez également les exporter en PNG, SVG ou format interactif HTML.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="pb-6 border-b border-[color:var(--color-border)] last:border-0">
                    <h5 className="mb-2">{faq.q}</h5>
                    <p className="text-[color:var(--color-text-secondary)]">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
