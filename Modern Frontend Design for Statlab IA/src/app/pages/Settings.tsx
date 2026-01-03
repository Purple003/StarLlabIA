import { Settings as SettingsIcon, Server, Bell, Users, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-2xl text-gray-900">Paramètres</h2>
            <p className="text-gray-500">Configuration de l'application</p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Paramètres généraux
          </CardTitle>
          <CardDescription>
            Configuration de base de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-name">Nom de l'application</Label>
            <Input id="app-name" defaultValue="Statlab IA Project" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-endpoint">URL API Backend</Label>
            <Input id="api-endpoint" defaultValue="https://api.statlab.io" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refresh-rate">Taux de rafraîchissement (secondes)</Label>
            <Input id="refresh-rate" type="number" defaultValue="30" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Gérer les préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications par email</Label>
              <p className="text-sm text-gray-500">
                Recevoir des alertes par email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertes système</Label>
              <p className="text-sm text-gray-500">
                Notifications pour les erreurs système
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rapports hebdomadaires</Label>
              <p className="text-sm text-gray-500">
                Recevoir un résumé hebdomadaire
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestion des utilisateurs
          </CardTitle>
          <CardDescription>
            Paramètres du compte utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" type="email" defaultValue="admin@statlab.io" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-name">Nom complet</Label>
            <Input id="user-name" defaultValue="Admin User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-role">Rôle</Label>
            <Input id="user-role" defaultValue="Administrateur" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Paramètres de sécurité et authentification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-gray-500">
                Ajouter une couche de sécurité supplémentaire
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Déconnexion automatique</Label>
              <p className="text-sm text-gray-500">
                Se déconnecter après 30 min d'inactivité
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Changer le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Annuler</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
