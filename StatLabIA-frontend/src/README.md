# StatLabAI - Plateforme d'Analyse de Données

Application web interactive présentant les maquettes complètes de StatLabAI, une plateforme d'analyse de données avec architecture microservices.

## 🎨 Design System

### Couleurs
- **Bleu Scientifique Principal**: `#2E5AAC` - Couleur principale de la marque
- **Vert Secondaire**: `#4CAF50` - Couleur d'accent et succès
- Palette complète définie dans `/styles/globals.css`

### Typographie
- **Police principale**: Inter (sans-serif) - Pour l'interface générale
- **Police code**: Roboto Mono (monospace) - Pour les éléments de code

### Composants Réutilisables
- `Button` - Boutons avec variants (primary, secondary, outline, ghost, danger)
- `Card` - Cartes pour organiser le contenu
- `StatusBadge` - Badges de statut colorés
- `Sidebar` - Navigation principale

## 📱 Les 10 Écrans

### 1. Dashboard
Vue d'ensemble avec:
- Statistiques clés (datasets, analyses, précision)
- Projets récents avec progression
- État des 6 microservices
- Activité récente

### 2. Import
Import de données depuis:
- Fichiers locaux (CSV, Excel, JSON, XML)
- Bases de données (PostgreSQL, MySQL, MongoDB)
- APIs externes (REST, GraphQL)
- Appels API vers Import Service

### 3. Cleaning Report
Rapport de qualité des données:
- Score de qualité global (94.5%)
- Détection des problèmes (valeurs manquantes, doublons, aberrantes)
- Analyse par colonne (complétude, validité, unicité)
- Appels API vers Cleaning Service

### 4. Preprocessing
Configuration des transformations:
- Pipeline de traitement visuel
- Opérations disponibles (normalisation, encodage, imputation)
- Configuration personnalisée par opération
- Aperçu des transformations
- Appels API vers Processing Service

### 5. Analysis Recommendation
Recommandations IA:
- 4 types d'analyses suggérés (régression, clustering, classification, temporelle)
- Niveau de confiance pour chaque analyse
- Insights clés automatiques
- Complexité et temps estimé
- Appels API vers Analysis Service

### 6. Results
Résultats détaillés:
- Métriques de performance (R², RMSE, MAE, précision)
- Résumé du modèle
- Importance des features
- Échantillon de prédictions
- Recommandations d'amélioration

### 7. Visualization
Visualisations interactives:
- Matrice de corrélation
- Distribution des variables
- Nuages de points
- Importance des features
- Graphiques par région et tendances temporelles
- Appels API vers Visualization Service

### 8. Export
Export multi-format:
- PDF, Excel, CSV, JSON, HTML, PNG
- Options de contenu personnalisables
- Méthodes de livraison (téléchargement, email, cloud)
- Historique des exports
- Appels API vers Export Service

### 9. Documentation
Guide complet:
- Démarrage rapide avec workflow complet
- API Reference pour les 6 microservices
- FAQ pour utilisateurs non-experts
- Ressources additionnelles (vidéos, exemples)

### 10. Settings
Paramètres utilisateur:
- Profil et informations personnelles
- Notifications (email et in-app)
- Sécurité (mot de passe, 2FA, sessions)
- Gestion des données et stockage
- Apparence (thème, langue)
- Clés API

## 🔧 Architecture Microservices

Les 6 microservices sont intégrés dans l'interface avec des exemples d'appels API:

1. **Import Service** (`/api/v1/import`) - Import de données
2. **Cleaning Service** (`/api/v1/cleaning`) - Nettoyage et validation
3. **Processing Service** (`/api/v1/processing`) - Prétraitement et transformations
4. **Analysis Service** (`/api/v1/analysis`) - Analyses statistiques et ML
5. **Visualization Service** (`/api/v1/visualization`) - Génération de graphiques
6. **Export Service** (`/api/v1/export`) - Export multi-format

Chaque écran affiche les appels API correspondants avec exemples de requêtes/réponses.

## 🎯 Public Cible

Interface conçue pour **utilisateurs non-experts**:
- Terminologie accessible et claire
- Workflows guidés pas-à-pas
- Recommandations automatiques de l'IA
- Documentation intégrée avec exemples
- Visualisations intuitives

## 🚀 Navigation

L'application utilise une navigation par sidebar avec 10 sections principales. Le prototype est interactif avec transitions fluides entre les écrans.

## 💡 Fonctionnalités Clés

- **Design System cohérent** avec couleurs et composants réutilisables
- **Prototype interactif** avec navigation complète
- **Liens UI ↔ API** clairement documentés pour chaque écran
- **Visualisations de données** avec graphiques et statistiques
- **Workflow complet** du import à l'export
- **Architecture microservices** visible et documentée

---

Créé avec React, TypeScript et Tailwind CSS
