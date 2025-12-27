import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { User, Bell, Shield, Database, Palette, Globe, Key, Trash2 } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'data', label: 'Données', icon: Database },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'api', label: 'API', icon: Key }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[color:var(--color-text-primary)] mb-2">Paramètres</h1>
        <p className="text-[color:var(--color-text-secondary)]">
          Gérez vos préférences et configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="md">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[color:var(--color-primary)] text-white'
                        : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-tertiary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
              <Card>
                <h3 className="mb-6">Informations du profil</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-secondary)] rounded-full flex items-center justify-center text-white text-2xl">
                      U
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Changer la photo</Button>
                      <p className="text-xs text-[color:var(--color-text-tertiary)] mt-2">
                        JPG, PNG ou GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Prénom</label>
                      <input 
                        type="text" 
                        defaultValue="John" 
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Nom</label>
                      <input 
                        type="text" 
                        defaultValue="Doe" 
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue="user@example.com" 
                      className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Organisation</label>
                    <input 
                      type="text" 
                      defaultValue="Acme Corporation" 
                      className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Rôle</label>
                    <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                      <option>Data Analyst</option>
                      <option>Data Scientist</option>
                      <option>Business Analyst</option>
                      <option>Researcher</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-[color:var(--color-border)]">
                  <Button variant="outline">Annuler</Button>
                  <Button variant="primary">Enregistrer les modifications</Button>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h3 className="mb-6">Préférences de notifications</h3>
              <div className="space-y-6">
                <div>
                  <h5 className="mb-3">Notifications par email</h5>
                  <div className="space-y-3">
                    {[
                      { label: 'Analyse terminée', desc: 'Recevoir un email quand une analyse est complétée' },
                      { label: 'Rapport hebdomadaire', desc: 'Résumé de votre activité chaque semaine' },
                      { label: 'Nouvelles fonctionnalités', desc: 'Être informé des nouvelles features' },
                      { label: 'Conseils et astuces', desc: 'Recevoir des conseils d\'utilisation' }
                    ].map((item) => (
                      <label key={item.label} className="flex items-start gap-3 p-3 bg-[color:var(--color-bg-secondary)] rounded-lg cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-1 rounded" />
                        <div>
                          <p className="text-sm">{item.label}</p>
                          <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="mb-3">Notifications dans l'application</h5>
                  <div className="space-y-3">
                    {[
                      { label: 'Erreurs de traitement', desc: 'Alertes en cas de problème' },
                      { label: 'Recommandations IA', desc: 'Suggestions d\'analyse automatiques' },
                      { label: 'Mises à jour système', desc: 'Maintenance et mises à jour' }
                    ].map((item) => (
                      <label key={item.label} className="flex items-start gap-3 p-3 bg-[color:var(--color-bg-secondary)] rounded-lg cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-1 rounded" />
                        <div>
                          <p className="text-sm">{item.label}</p>
                          <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[color:var(--color-border)]">
                  <Button variant="primary">Enregistrer</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <>
              <Card>
                <h3 className="mb-6">Sécurité du compte</h3>
                <div className="space-y-6">
                  <div>
                    <h5 className="mb-3">Changer le mot de passe</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-2">Mot de passe actuel</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Nouveau mot de passe</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Confirmer le mot de passe</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg"
                        />
                      </div>
                      <Button variant="primary" size="sm">Mettre à jour le mot de passe</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[color:var(--color-border)]">
                    <h5 className="mb-3">Authentification à deux facteurs</h5>
                    <div className="flex items-start justify-between p-4 bg-[color:var(--color-bg-secondary)] rounded-lg">
                      <div>
                        <p className="text-sm mb-1">2FA désactivée</p>
                        <p className="text-xs text-[color:var(--color-text-tertiary)]">
                          Ajouter une couche de sécurité supplémentaire
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Activer</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[color:var(--color-border)]">
                    <h5 className="mb-3">Sessions actives</h5>
                    <div className="space-y-3">
                      {[
                        { device: 'Chrome sur Windows', location: 'Paris, France', current: true, date: 'Maintenant' },
                        { device: 'Safari sur iPhone', location: 'Lyon, France', current: false, date: 'Il y a 2h' }
                      ].map((session, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[color:var(--color-bg-secondary)] rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm">{session.device}</p>
                              {session.current && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Actuelle</span>
                              )}
                            </div>
                            <p className="text-xs text-[color:var(--color-text-tertiary)]">
                              {session.location} • {session.date}
                            </p>
                          </div>
                          {!session.current && (
                            <Button variant="ghost" size="sm">Révoquer</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'data' && (
            <>
              <Card>
                <h3 className="mb-6">Gestion des données</h3>
                <div className="space-y-6">
                  <div>
                    <h5 className="mb-3">Stockage</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[color:var(--color-text-secondary)]">Espace utilisé</span>
                        <span className="text-sm">2.4 GB / 10 GB</span>
                      </div>
                      <div className="w-full bg-[color:var(--color-bg-tertiary)] rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-secondary)] h-3 rounded-full"
                          style={{ width: '24%' }}
                        />
                      </div>
                      <Button variant="outline" size="sm">Augmenter le stockage</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[color:var(--color-border)]">
                    <h5 className="mb-3">Rétention des données</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-2">Supprimer automatiquement</label>
                        <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                          <option>Jamais</option>
                          <option>Après 30 jours</option>
                          <option>Après 90 jours</option>
                          <option>Après 1 an</option>
                        </select>
                      </div>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">
                        Les datasets et analyses seront supprimés après la période sélectionnée
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[color:var(--color-border)]">
                    <h5 className="mb-3">Export de données</h5>
                    <p className="text-sm text-[color:var(--color-text-secondary)] mb-3">
                      Téléchargez toutes vos données dans un format portable
                    </p>
                    <Button variant="outline">Demander un export</Button>
                  </div>

                  <div className="pt-6 border-t border-[color:var(--color-border)]">
                    <h5 className="mb-3 text-red-600">Zone de danger</h5>
                    <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                      <p className="text-sm text-red-800 mb-3">
                        Supprimer définitivement toutes vos données. Cette action est irréversible.
                      </p>
                      <Button variant="danger" size="sm">
                        <Trash2 className="w-4 h-4" />
                        Supprimer toutes les données
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <h3 className="mb-6">Apparence</h3>
              <div className="space-y-6">
                <div>
                  <h5 className="mb-3">Thème</h5>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Clair', active: true },
                      { id: 'dark', label: 'Sombre', active: false },
                      { id: 'auto', label: 'Automatique', active: false }
                    ].map((theme) => (
                      <div
                        key={theme.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                          theme.active
                            ? 'border-[color:var(--color-primary)] bg-blue-50'
                            : 'border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-2 rounded-lg ${
                          theme.id === 'light' ? 'bg-white border-2 border-gray-200' :
                          theme.id === 'dark' ? 'bg-gray-900' :
                          'bg-gradient-to-br from-white to-gray-900'
                        }`} />
                        <p className="text-sm">{theme.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="mb-3">Langue</h5>
                  <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                    <option>Deutsch</option>
                  </select>
                </div>

                <div>
                  <h5 className="mb-3">Format de date</h5>
                  <select className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg">
                    <option>JJ/MM/AAAA</option>
                    <option>MM/JJ/AAAA</option>
                    <option>AAAA-MM-JJ</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[color:var(--color-border)]">
                  <Button variant="primary">Enregistrer</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'api' && (
            <>
              <Card>
                <h3 className="mb-6">Clés API</h3>
                <p className="text-sm text-[color:var(--color-text-secondary)] mb-6">
                  Gérez vos clés API pour accéder aux microservices StatLabAI de manière programmatique.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { name: 'Production Key', key: 'sk_prod_abc123...', created: 'Créée il y a 30j', lastUsed: 'Il y a 2h' },
                    { name: 'Development Key', key: 'sk_dev_xyz789...', created: 'Créée il y a 5j', lastUsed: 'Il y a 1j' }
                  ].map((apiKey, idx) => (
                    <div key={idx} className="p-4 border border-[color:var(--color-border)] rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="mb-1">{apiKey.name}</h5>
                          <code className="text-xs text-[color:var(--color-text-tertiary)]">{apiKey.key}</code>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Copier</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Révoquer</Button>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-[color:var(--color-text-tertiary)]">
                        <span>{apiKey.created}</span>
                        <span>Dernière utilisation: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="primary">
                  <Key className="w-4 h-4" />
                  Créer une nouvelle clé
                </Button>
              </Card>

              <Card className="bg-blue-50 border-2 border-blue-200">
                <h4 className="text-blue-900 mb-3">Documentation API</h4>
                <p className="text-sm text-blue-800 mb-4">
                  Consultez la documentation complète pour intégrer StatLabAI dans vos applications.
                </p>
                <div className="flex gap-3">
                  <Button variant="primary" size="sm">Voir la documentation</Button>
                  <Button variant="outline" size="sm">Exemples de code</Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
