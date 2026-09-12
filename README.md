# SendiAPI SDK v1.0.0

**SendiAPI SDK** est le SDK officiel JavaScript/Node.js de **SendiAPI**, une plateforme de livraison unifiée pour l'Afrique.

Il permet aux développeurs d'intégrer facilement les fonctionnalités de livraison, de gestion des commandes, de suivi, de gestion des crédits et d'administration d'agence dans leurs applications.

---

## Installation

Installez le SDK avec npm :

```bash
npm install sendi-api
```

---

## Fonctionnalités

### Commandes — Orders

* Créer une commande avec tous les champs requis
* Récupérer les détails d'une commande
* Lister les commandes avec pagination et filtrage
* Annuler une commande
* Suivre une commande en temps réel

### Commerçant — Commercant

* Consulter le solde des crédits
* Recharger les crédits via Mobile Money, etc.
* Obtenir et régénérer la clé API
* Consulter les statistiques complètes

  * Nombre de commandes
  * Taux de complétion
  * Dépenses
* Consulter l'historique des commandes
* Consulter le profil utilisateur

### Agence — Agence

* Consulter le solde
* Consulter la liste des courses assignées
* Mettre à jour le statut d'une course

  * `assigned`
  * `in_progress`
  * `delivered`
  * `cancelled`
* Gérer les livreurs

### Gestion des erreurs

Le SDK fournit des erreurs typées et faciles à gérer :

* Erreurs de validation
* Erreurs d'authentification
* Erreurs de crédits insuffisants
* Erreurs de rate limiting
* Messages d'erreur clairs et explicites

---

## Quick Start

### Initialiser le client

```javascript
import SendiAPI from 'sendi-api';

const api = new SendiAPI('sk_live_votre_cle_api');
```

### Créer une commande

```javascript
const order = await api.orders.create({
  clientName: 'Jean Dupont',
  clientPhone: '+22501020304',
  clientAddress: '123 Rue de la Paix, Cocody',
  clientCommune: 'Cocody',
  pickupAddress: '456 Rue du Commerce, Yopougon',
  pickupCommune: 'Yopougon',
  phonecommercant: '+22507080910'
});

console.log('Commande créée:', order.courseId);
console.log('Code secret:', order.codeSecret);
console.log('Prix:', order.price);
```

---

## Exemples d'utilisation

### Consulter les crédits

```javascript
const credits = await api.commercant.getCredits();

console.log('Crédits disponibles:', credits.credits);
```

### Suivre une commande

```javascript
const tracking = await api.orders.track('order_id');

console.log('Statut:', tracking.status);
```

### Gestion d'agence

#### Lister les courses

```javascript
const courses = await api.agence.getCourses({
  status: 'assigned'
});

console.log(courses);
```

#### Mettre à jour le statut

```javascript
await api.agence.updateStatus(
  'course_id',
  'in_progress'
);
```

---

## Gestion des erreurs

Le SDK fournit une classe `SendiAPIError` permettant d'identifier facilement le type d'erreur rencontré.

```javascript
import SendiAPI, { SendiAPIError } from 'sendi-api';

const api = new SendiAPI('sk_live_votre_cle_api');

try {
  const order = await api.orders.create(data);

  console.log('Commande créée:', order);
} catch (error) {
  if (error instanceof SendiAPIError) {
    console.error(
      `Erreur ${error.statusCode}:`,
      error.message
    );

    if (error.isValidationError()) {
      // Gérer les erreurs de validation (400)
    }

    if (error.isCreditError()) {
      // Gérer les crédits insuffisants (402)
    }
  }
}
```

---

## Configuration avancée

Le client peut être configuré avec plusieurs options :

```javascript
const api = new SendiAPI(
  'sk_live_votre_cle_api',
  {
    baseURL: 'https://api.sendi-api.com/api/v1',
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
    headers: {
      'X-Custom-Header': 'custom-value'
    }
  }
);
```

### Options disponibles

| Option       | Description                      | Valeur par défaut |
| ------------ | -------------------------------- | ----------------: |
| `baseURL`    | URL de l'API Sendi               |    API production |
| `timeout`    | Timeout des requêtes en ms       |                 - |
| `maxRetries` | Nombre maximum de tentatives     |                 - |
| `retryDelay` | Délai entre les tentatives en ms |                 - |
| `headers`    | Headers HTTP personnalisés       |              `{}` |

---

## Environnements

### Développement

```javascript
const api = new SendiAPI(
  'sk_test_votre_cle',
  {
    baseURL: 'http://localhost:5001/api/v1'
  }
);
```

### Production

```javascript
const api = new SendiAPI(
  'sk_live_votre_cle',
  {
    baseURL: 'https://api.sendi-api.com/api/v1'
  }
);
```

---

## Documentation

* Documentation complète : https://sendi-api.com/docs
* API Reference : https://sendi-api.com/docs
* npm Package : https://www.npmjs.com/
* GitHub Repository : https://github.com/EmmanuelJessy/sdk-sendi

---

## Prérequis

Avant d'utiliser le SDK, assurez-vous de disposer de :

* Node.js >= 14.0.0
* Une clé API Sendi

Vous pouvez obtenir votre clé API sur :

https://sendi-api.com

---

## Sécurité

Le SDK est conçu selon les bonnes pratiques de sécurité :

* Les clés API peuvent être gérées via des variables d'environnement
* Aucune donnée sensible n'est stockée dans le SDK
* Authentification via `x-api-key`
* Les clés API ne doivent jamais être exposées côté client
* Utilisation recommandée de variables d'environnement en production

### Exemple avec une variable d'environnement

```bash
SENDI_API_KEY=sk_live_votre_cle_api
```

Puis :

```javascript
import SendiAPI from 'sendi-api';

const api = new SendiAPI(
  process.env.SENDI_API_KEY
);
```

---

## Contribution

Les contributions sont les bienvenues.

### 1. Forker le projet

```bash
git clone https://github.com/EmmanuelJessy/sdk-sendi.git
```

### 2. Créer une branche

```bash
git checkout -b feature/amazing
```

### 3. Effectuer vos modifications

```bash
git add .
git commit -m "Add amazing feature"
```

### 4. Pousser la branche

```bash
git push origin feature/amazing
```

### 5. Ouvrir une Pull Request

Créez ensuite une Pull Request afin de proposer vos modifications.

---

## Support

Pour toute question ou problème :

* Email : [support@sendi-api.com](mailto:support@sendi-api.com)
* Site web : https://sendi-api.com
* Documentation : https://sendi-api.com/docs
* Issues GitHub : https://github.com/EmmanuelJessy/sdk-sendi
* Communauté Discord : https://discord.gg/sendi

---

## Licence

Ce projet est distribué sous licence MIT.

```text
MIT © Sendi API Team
```

---

## Remerciements

Merci à tous les contributeurs, développeurs et utilisateurs qui participent à l'évolution de SendiAPI.

Fait par l'équipe Sendi API.

---

## Informations sur la version

| Information           | Valeur         |
| --------------------- | -------------- |
| Version               | `1.0.0`        |
| Date                  | Août 2026      |
| Taille du package     | `8.6 kB`       |
| Dépendance principale | `axios ^1.6.0` |
| Node.js               | `>= 14.0.0`    |

---

## Roadmap

Les fonctionnalités suivantes sont prévues pour les prochaines versions :

* [ ] Support TypeScript
* [ ] Ajout de tests unitaires
* [ ] Support des webhooks
* [ ] Ajout de nouvelles ressources API
* [ ] Amélioration de la documentation
* [ ] Amélioration du système de retry
* [ ] Support de fonctionnalités avancées de suivi

---

## SendiAPI

Une seule API pour connecter votre application aux services de livraison en Afrique.

```bash
npm install sendi-api
```

**SendiAPI SDK v1.0.0**
