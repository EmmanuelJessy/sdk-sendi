# SendiAPI SDK v3.0.2

[![npm version](https://img.shields.io/npm/v/sendi-api.svg)](https://www.npmjs.com/package/sendi-api)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-129%20passed-brightgreen.svg)](https://github.com/EmmanuelJessy/sdk-sendi)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.x-green.svg)](https://nodejs.org/)

> **Une seule API pour connecter votre application aux services de livraison en Afrique.**

**SendiAPI SDK** est le SDK officiel JavaScript / Node.js de **SendiAPI**.

Il permet d'intégrer rapidement les fonctionnalités de livraison de SendiAPI dans vos applications e-commerce, marketplaces, ERP, CRM et autres solutions digitales.

Avec le SDK, vous pouvez notamment :

* Créer et gérer des commandes
* Suivre les livraisons
* Gérer les crédits
* Calculer les tarifs et vérifier la disponibilité de la livraison
* Gérer les agences et les courses
* Consulter les statistiques
* Configurer des webhooks
* Gérer votre authentification API

---

## Fonctionnalités

### Commandes — `orders`

Gestion complète du cycle de vie des commandes.

* Créer une commande
* Consulter les détails d'une commande
* Lister les commandes
* Filtrer et paginer les commandes
* Annuler une commande
* Suivre une commande
* Confirmer la réception d'une commande

---

### Commerçant — `commercant`

Gestion du compte commerçant.

* Consulter le solde de crédits
* Recharger les crédits via Mobile Money
* Obtenir la clé API
* Régénérer la clé API
* Consulter les statistiques
* Consulter l'historique des commandes
* Consulter le profil utilisateur
* Gérer la configuration de livraison

---

### Agence — `agence`

Outils dédiés à la gestion des agences de livraison.

* Consulter le solde
* Lister les courses assignées
* Filtrer les courses par statut
* Mettre à jour le statut d'une course
* Gérer les livreurs
* Consulter les statistiques d'agence

Statuts de course disponibles :

```text
assigned
in_progress
delivered
cancelled
```

---

### Livraison — `delivery`

Gestion de la configuration et de la tarification de la livraison.

* Configurer une livraison
* Récupérer les communes par pays
* Calculer le prix d'une livraison
* Vérifier la disponibilité
* Récupérer les agences disponibles
* Gérer les différents modes de livraison

Modes de livraison disponibles :

```text
client_pays
merchant_pays
threshold
```

---

### Statistiques — `stats`

Accédez aux données de performance de votre activité.

* Statistiques commerçant
* Statistiques des commandes
* Statistiques de livraison
* Top des agences
* Performance globale

---

### Webhooks — `webhook`

Recevez automatiquement les événements SendiAPI dans votre application.

* Créer un webhook
* Lister les webhooks
* Mettre à jour un webhook
* Supprimer un webhook
* Tester un webhook
* Gérer les événements

Exemples d'événements :

```text
order.created
order.delivered
```

---

## Installation

Installez la dernière version du SDK avec npm :

```bash
npm install sendi-api@latest
```

Ou installez une version spécifique :

```bash
npm install sendi-api@3.0.2
```

---

## Quick Start

### Initialiser le SDK

```javascript
import SendiAPI from 'sendi-api';

const api = new SendiAPI('sk_live_votre_cle_api');
```

Le client `api` donne ensuite accès aux différentes ressources de SendiAPI.

---

## Créer une commande

```javascript
const order = await api.orders.create({
  clientName: 'Jean Dupont',
  clientPhone: '+22501020304',
  clientAddress: '123 Rue de la Paix, Cocody',
  clientCommune: 'Cocody',

  pickupAddress: '456 Rue du Commerce, Yopougon',
  pickupCommune: 'Yopougon',

  merchantPhone: '+22507080910',

  deliveryMode: 'client_pays',
  currency: 'FCFA'
});

console.log('Commande créée :', order.courseId);
console.log('Code secret :', order.codeSecret);
console.log('Prix :', order.price);
```

---

## Consulter les crédits

```javascript
const credits = await api.commercant.getCredits();

console.log('Crédits disponibles :', credits.credits);
```

---

## Calculer le prix d'une livraison

```javascript
const price = await api.delivery.calculatePrice(
  'Yopougon',
  'Cocody',
  {
    deliveryMode: 'threshold',
    freeThreshold: 50000,
    orderTotal: 75000
  }
);

console.log('Prix :', price.price);
console.log('Devise :', price.currency);
console.log('Livraison gratuite :', price.isFree);
```

---

## Suivre une commande

```javascript
const tracking = await api.orders.track('order_id');

console.log('Statut :', tracking.status);
```

---

## Gestion d'agence

### Lister les courses

```javascript
const courses = await api.agence.getCourses({
  status: 'assigned'
});

console.log(courses);
```

### Mettre à jour le statut d'une course

```javascript
await api.agence.updateStatus(
  'course_id',
  'in_progress',
  'livreur_id'
);
```

---

## Gestion des Webhooks

Les webhooks permettent à votre application de recevoir automatiquement les événements générés par SendiAPI.

### Créer un webhook

```javascript
const webhook = await api.webhook.create({
  url: 'https://example.com/webhook',
  events: [
    'order.created',
    'order.delivered'
  ]
});

console.log('Webhook créé :', webhook);
```

### Lister les webhooks

```javascript
const webhooks = await api.webhook.list();

console.log(webhooks);
```

---

## Gestion des erreurs

Le SDK fournit une classe `SendiAPIError` permettant de gérer proprement les erreurs retournées par l'API.

```javascript
import SendiAPI, { SendiAPIError } from 'sendi-api';

const api = new SendiAPI('sk_live_votre_cle_api');

try {
  const order = await api.orders.create(data);

  console.log(order);

} catch (error) {

  if (error instanceof SendiAPIError) {
    console.error(
      `Erreur ${error.statusCode}:`,
      error.message
    );

    if (error.isValidationError()) {
      // Erreur de validation — 400
    }

    if (error.isCreditError()) {
      // Crédits insuffisants — 402
    }

    if (error.isRateLimitError()) {
      // Trop de requêtes — 429
    }

    if (error.isServerError()) {
      // Erreur serveur — 500+
    }
  }
}
```

### Types d'erreurs courants

|   Code | Type       | Description                 |
| -----: | ---------- | --------------------------- |
|  `400` | Validation | Données envoyées invalides  |
|  `402` | Crédit     | Crédits insuffisants        |
|  `429` | Rate limit | Limite de requêtes atteinte |
| `500+` | Serveur    | Erreur côté SendiAPI        |

---

## Configuration avancée

Le client peut être personnalisé avec plusieurs options.

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
| ------------ | -------------------------------- | ----------------- |
| `baseURL`    | URL de l'API SendiAPI            | API production    |
| `timeout`    | Timeout des requêtes en ms       | `30000`           |
| `maxRetries` | Nombre maximum de tentatives     | `3`               |
| `retryDelay` | Délai entre les tentatives en ms | `1000`            |
| `headers`    | Headers HTTP personnalisés       | `{}`              |

---

## Environnements

SendiAPI propose différents environnements pour vos intégrations.

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

> Utilisez une clé `sk_test_...` pour vos développements et tests et une clé `sk_live_...` pour votre environnement de production.

---

## Sécurité

La clé API SendiAPI est une information sensible.

### Bonnes pratiques

* Stockez votre clé API dans une variable d'environnement.
* Ne commitez jamais votre clé API dans Git.
* N'exposez jamais votre clé API dans du code exécuté côté navigateur.
* Utilisez des clés différentes pour les environnements de test et de production.

### À éviter

```javascript
const api = new SendiAPI(
  'sk_live_ma-vraie-cle-api'
);
```

### Recommandé

Créez un fichier `.env` :

```bash
SENDI_API_KEY=sk_live_votre_cle_api
```

Puis utilisez la variable d'environnement :

```javascript
import SendiAPI from 'sendi-api';

const api = new SendiAPI(
  process.env.SENDI_API_KEY
);
```

Ajoutez également `.env` à votre `.gitignore` :

```gitignore
.env
.env.local
```

---

## Utilisation avec une application Node.js

Exemple minimal :

```javascript
import SendiAPI from 'sendi-api';

const api = new SendiAPI(
  process.env.SENDI_API_KEY
);

async function createOrder() {
  try {
    const order = await api.orders.create({
      clientName: 'Jean Dupont',
      clientPhone: '+22501020304',
      clientAddress: 'Cocody',
      clientCommune: 'Cocody',
      pickupAddress: 'Yopougon',
      pickupCommune: 'Yopougon',
      merchantPhone: '+22507080910',
      deliveryMode: 'client_pays',
      currency: 'FCFA'
    });

    console.log('Commande créée :', order);

  } catch (error) {
    console.error('Erreur SendiAPI :', error);
  }
}

createOrder();
```

---

## Ressources

| Ressource     | Lien                                              |
| ------------- | ------------------------------------------------- |
| Documentation | https://sendi-api.com/docs                        |
| npm           | https://www.npmjs.com/package/sendi-api           |
| GitHub        | https://github.com/EmmanuelJessy/sdk-sendi        |
| SendiAPI      | https://sendi-api.com                             |
| Issues        | https://github.com/EmmanuelJessy/sdk-sendi/issues |

---

## Prérequis

* **Node.js >= 14.0.0**
* Une **clé API SendiAPI**

Obtenez votre clé API depuis votre compte SendiAPI :

https://sendi-api.com

---

## Informations sur la version

| Information           | Valeur         |
| --------------------- | -------------- |
| Version               | `3.0.2`        |
| Publication           | Septembre 2026 |
| Taille du package     | `49.2 kB`      |
| Taille décompressée   | `286.0 kB`     |
| Fichiers              | `42`           |
| Tests                 | `129`          |
| Dépendance principale | `axios ^1.6.0` |
| Node.js               | `>= 14.0.0`    |
| Licence               | MIT            |

---

## Tests

Le SDK dispose actuellement de **129 tests automatisés**.

Pour lancer les tests du projet :

```bash
npm test
```

> La suite de tests permet de vérifier le comportement des différentes ressources et fonctionnalités du SDK.

---

## Architecture du SDK

Le SDK est organisé autour de plusieurs ressources principales :

```text
SendiAPI
├── orders
├── commercant
├── agence
├── delivery
├── stats
└── webhook
```

Cette organisation permet de conserver une API simple et intuitive :

```javascript
api.orders
api.commercant
api.agence
api.delivery
api.stats
api.webhook
```

---

## Formats de build

Le package prend en charge plusieurs formats afin de faciliter son intégration dans différents environnements JavaScript :

* **ESM**
* **CommonJS (CJS)**
* **UMD**

Le bundle a également été optimisé avec une réduction annoncée de **91 %**.

---

## Roadmap

### Réalisé

* [ ] Documentation en ligne complète
* [x] Support TypeScript
* [x] Support des webhooks
* [x] Ressource `delivery`
* [x] Ressource `stats`
* [x] Ressource `webhook`
* [x] Build ESM
* [x] Build CommonJS
* [x] Build UMD
* [x] Optimisation du bundle


### Prévu

* [ ] Notifications push
* [ ] WebSocket temps réel

---

## Contribution

Les contributions sont les bienvenues.

### 1. Forker le projet

Forkez le dépôt GitHub :

https://github.com/EmmanuelJessy/sdk-sendi

### 2. Créer une branche

```bash
git checkout -b feature/amazing-feature
```

### 3. Commiter vos modifications

```bash
git commit -m "Add amazing feature"
```

### 4. Pousser votre branche

```bash
git push origin feature/amazing-feature
```

### 5. Ouvrir une Pull Request

Décrivez clairement les changements apportés et leur objectif.

---

## Support

Une question, un problème ou besoin d'aide pour votre intégration ?

**Email :** [contact@sendi-api.com](mailto:contact@sendi-api.com)

**Site web :** https://sendi-api.com

**GitHub Issues :** https://github.com/EmmanuelJessy/sdk-sendi/issues

---

## Licence

Ce projet est distribué sous licence **MIT**.

```text
MIT © Sendi API Team
```

---

# SendiAPI

**Une seule API pour connecter votre application aux services de livraison en Afrique.**

Que vous développiez :

* Une boutique e-commerce
* Une marketplace
* Une application mobile
* Une plateforme SaaS
* Un ERP ou CRM
* Un plugin e-commerce

**SendiAPI vous permet d'intégrer les services de livraison à votre application à travers une API unique.**

## Installation

```bash
npm install sendi-api@latest
```

**Build. Integrate. Deliver.**
