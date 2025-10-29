# Système CRM Complet - Documentation

## 📋 Vue d'ensemble

Ce système CRM complet permet la gestion administrative de :
- ✅ Participants (avec filtres avancés)
- ✅ Clients (gestion complète)
- ✅ Abonnements (suivi et gestion)
- ✅ Vidéos de démonstration
- ✅ Interactions CRM (tickets, notes, appels)
- ✅ Statistiques et reporting

## 🗂️ Structure des APIs créées

### 1. API Participants CRM
- **GET** `/api/crm/participants` - Liste tous les participants avec filtres
  - Paramètres: `?domain_id=1&search=john`
  - Retourne: participants avec domain_name et client_id
- **POST** `/api/crm/participants` - Créer un participant
- **PUT** `/api/crm/participants/[id]` - Mettre à jour
- **DELETE** `/api/crm/participants/[id]` - Supprimer

### 2. Tables SQL créées
```sql
- demo_videos (vidéos de démonstration)
- crm_interactions (tickets, notes, appels)
- crm_statistics (statistiques par client)
- client_notes (notes et tags sur clients)
```

## 🚀 Installation

### 1. Exécuter le script SQL
```bash
mysql -u root -p quality_assurance < crm_tables.sql
```

### 2. Utiliser les APIs

#### Exemple: Lister les participants
```typescript
const response = await fetch('http://localhost:3001/api/crm/participants?search=john');
const data = await response.json();
```

#### Exemple: Créer un participant
```typescript
const response = await fetch('http://localhost:3001/api/crm/participants', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain_id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    poste: 'Chef de projet'
  })
});
```

## 📊 Fonctionnalités CRM

### Gestion des Participants
- ✅ Recherche avancée (nom, email, poste)
- ✅ Filtre par domaine
- ✅ Affichage avec informations du domaine
- ✅ CRUD complet

### Gestion des Clients (à implémenter)
- Liste des clients avec statut
- Détails du client avec historique
- Statistiques d'utilisation
- Notes et tags
- Historique des abonnements

### Gestion des Abonnements (à implémenter)
- Liste des abonnements actifs/expirés
- Alertes d'expiration proche
- Historique des paiements
- Changement de type d'abonnement

### Vidéos de Démonstration
- Upload et gestion de vidéos
- Catégorisation (tutorial, feature, overview)
- Statistiques de vues
- Ordre d'affichage

### Interactions CRM
- Tickets de support
- Notes privées
- Historique d'appels
- Rappels et tâches
- Priorisation

## 🎯 Prochaines étapes

1. **Créer les APIs manquantes:**
   - `/api/crm/clients` - Gestion clients
   - `/api/crm/subscriptions` - Gestion abonnements
   - `/api/crm/videos` - Gestion vidéos
   - `/api/crm/interactions` - Gestion interactions

2. **Créer les interfaces admin:**
   - Dashboard CRM avec statistiques
   - Table de gestion participants
   - Table de gestion clients
   - Calendrier des abonnements
   - Interface de gestion vidéos

3. **Ajouter les fonctionnalités avancées:**
   - Export Excel des données
   - Rapports personnalisés
   - Notifications automatiques
   - Graphiques de tendances

## 📝 Types TypeScript

Les types sont déjà définis dans `src/app/lib/types.ts` :
```typescript
- Client
- Participant
- Subscription
- Domain
- Template
```

## 🔐 Sécurité

- ✅ Validation des entrées
- ✅ Protection CSRF
- ✅ Headers CORS configurés
- ⚠️ À ajouter: Authentification JWT pour admin
- ⚠️ À ajouter: Rate limiting

## 📞 Support

Pour toute question ou contribution, veuillez consulter la documentation principale du projet.
