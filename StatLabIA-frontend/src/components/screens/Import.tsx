import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Upload, File, Database, Link2, CheckCircle2, AlertCircle } from 'lucide-react';

export function Import() {
  const [selectedMethod, setSelectedMethod] = useState<'file' | 'database' | 'api'>('file');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[color:var(--color-text-primary)] mb-2">Import de données</h1>
        <p className="text-[color:var(--color-text-secondary)]">
          Importez vos données depuis différentes sources
        </p>
      </div>

      {/* Import Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          padding="md" 
          hover 
          className={`cursor-pointer border-2 ${selectedMethod === 'file' ? 'border-[color:var(--color-primary)]' : 'border-transparent'}`}
          onClick={() => setSelectedMethod('file')}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <File className="w-8 h-8 text-[color:var(--color-primary)]" />
            </div>
            <h4 className="mb-2">Fichier local</h4>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              CSV, Excel, JSON, XML
            </p>
          </div>
        </Card>

        <Card 
          padding="md" 
          hover 
          className={`cursor-pointer border-2 ${selectedMethod === 'database' ? 'border-[color:var(--color-primary)]' : 'border-transparent'}`}
          onClick={() => setSelectedMethod('database')}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Database className="w-8 h-8 text-[color:var(--color-secondary)]" />
            </div>
            <h4 className="mb-2">Base de données</h4>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              MySQL, PostgreSQL, MongoDB
            </p>
          </div>
        </Card>

        <Card 
          padding="md" 
          hover 
          className={`cursor-pointer border-2 ${selectedMethod === 'api' ? 'border-[color:var(--color-primary)]' : 'border-transparent'}`}
          onClick={() => setSelectedMethod('api')}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Link2 className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="mb-2">API externe</h4>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              REST API, GraphQL
            </p>
          </div>
        </Card>
      </div>

      {/* File Upload Area */}
      {selectedMethod === 'file' && (
        <Card>
          <div className="border-2 border-dashed border-[color:var(--color-border)] rounded-xl p-12 text-center hover:border-[color:var(--color-primary)] transition-colors cursor-pointer">
            <Upload className="w-16 h-16 mx-auto text-[color:var(--color-text-tertiary)] mb-4" />
            <h4 className="mb-2">Glissez-déposez vos fichiers ici</h4>
            <p className="text-[color:var(--color-text-secondary)] mb-4">
              ou cliquez pour parcourir
            </p>
            <Button variant="primary">Sélectionner un fichier</Button>
            <p className="text-xs text-[color:var(--color-text-tertiary)] mt-4">
              Formats supportés: CSV, XLSX, JSON, XML (max 100MB)
            </p>
          </div>
          
          <div className="mt-6">
            <h5 className="mb-3">Appel API - Import Service</h5>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                POST /api/v1/import/file<br/>
                Content-Type: multipart/form-data<br/>
                <br/>
                {'{'}<br/>
                &nbsp;&nbsp;"file": File,<br/>
                &nbsp;&nbsp;"format": "csv | excel | json | xml",<br/>
                &nbsp;&nbsp;"encoding": "utf-8"<br/>
                {'}'}
              </code>
            </div>
          </div>
        </Card>
      )}

      {/* Database Connection */}
      {selectedMethod === 'database' && (
        <Card>
          <h4 className="mb-4">Connexion à la base de données</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Type de base de données</label>
              <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                <option>PostgreSQL</option>
                <option>MySQL</option>
                <option>MongoDB</option>
                <option>SQLite</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Hôte</label>
                <input type="text" placeholder="localhost" className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg" />
              </div>
              <div>
                <label className="block text-sm mb-2">Port</label>
                <input type="text" placeholder="5432" className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Nom de la base</label>
              <input type="text" placeholder="database_name" className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Utilisateur</label>
                <input type="text" placeholder="username" className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg" />
              </div>
              <div>
                <label className="block text-sm mb-2">Mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline">Tester la connexion</Button>
              <Button variant="primary">Se connecter et importer</Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h5 className="mb-3">Appel API - Import Service</h5>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                POST /api/v1/import/database<br/>
                Content-Type: application/json<br/>
                <br/>
                {'{'}<br/>
                &nbsp;&nbsp;"type": "postgresql | mysql | mongodb",<br/>
                &nbsp;&nbsp;"connection": {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"host": "localhost",<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"port": 5432,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"database": "db_name",<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"credentials": {'{'} ... {'}'}<br/>
                &nbsp;&nbsp;{'}'},<br/>
                &nbsp;&nbsp;"query": "SELECT * FROM table"<br/>
                {'}'}
              </code>
            </div>
          </div>
        </Card>
      )}

      {/* API Connection */}
      {selectedMethod === 'api' && (
        <Card>
          <h4 className="mb-4">Connexion API</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Type d'API</label>
              <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                <option>REST API</option>
                <option>GraphQL</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-2">URL de l'endpoint</label>
              <input type="text" placeholder="https://api.example.com/data" className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Méthode</label>
              <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                <option>GET</option>
                <option>POST</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Authentification</label>
              <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                <option>API Key</option>
                <option>Bearer Token</option>
                <option>OAuth 2.0</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Clé / Token</label>
              <input type="password" placeholder="••••••••••••••••" className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg" />
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline">Tester l'API</Button>
              <Button variant="primary">Importer les données</Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h5 className="mb-3">Appel API - Import Service</h5>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                POST /api/v1/import/api<br/>
                Content-Type: application/json<br/>
                <br/>
                {'{'}<br/>
                &nbsp;&nbsp;"source_url": "https://api.example.com/data",<br/>
                &nbsp;&nbsp;"method": "GET | POST",<br/>
                &nbsp;&nbsp;"authentication": {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"type": "api_key | bearer | oauth",<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;"token": "your_token"<br/>
                &nbsp;&nbsp;{'}'},<br/>
                &nbsp;&nbsp;"parameters": {'{'} ... {'}'}<br/>
                {'}'}
              </code>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Imports */}
      <Card>
        <h4 className="mb-4">Imports récents</h4>
        <div className="space-y-3">
          {[
            { name: 'sales_data_2024.csv', size: '2.4 MB', rows: '15,234', status: 'success', time: 'Il y a 2h' },
            { name: 'customer_behavior.xlsx', size: '5.1 MB', rows: '32,891', status: 'success', time: 'Hier' },
            { name: 'market_trends.json', size: '1.8 MB', rows: '8,456', status: 'success', time: 'Il y a 2j' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[color:var(--color-bg-secondary)] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">
                    {item.size} • {item.rows} lignes • {item.time}
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
