# SendiAPI SDK v3.0.2


[![npm version](https://img.shields.io/npm/v/sendi-api.svg)](https://www.npmjs.com/package/sendi-api)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-129%20passed-brightgreen.svg)](https://github.com/EmmanuelJessy/sdk-sendi)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.x-green.svg)](https://nodejs.org/)

> **Une seule API pour connecter votre application aux services de livraison en Afrique.**

**SendiAPI SDK** est le SDK officiel JavaScript / Node.js de **SendiAPI**.

Il permet aux développeurs d'intégrer rapidement les fonctionnalités de livraison, de gestion des commandes, de suivi, de gestion des crédits, d'administration d'agence, de statistiques et de webhooks dans leurs applications.

Le SDK est conçu pour les applications e-commerce, marketplaces, plateformes SaaS, applications mobiles, ERP, CRM et intégrations personnalisées.

---

## Table des matières

* [Installation](#installation)
* [Quick Start](#quick-start)
* [Fonctionnalités](#fonctionnalités)

  * [Commandes](#commandes--orders)
  * [Commerçant](#commerçant--commercant)
  * [Agence](#agence--agence)
  * [Livraison](#livraison--delivery)
  * [Statistiques](#statistiques--stats)
  * [Webhooks](#webhooks--webhook)
* [Exemples d'utilisation](#exemples-dutilisation)
* [Cas d'usage réels](#cas-dusage-réels)
* [Tutoriels](#tutoriels)
* [Gestion des erreurs](#gestion-des-erreurs)
* [Dépannage](#dépannage)
* [Configuration avancée](#configuration-avancée)
* [Sécurité](#sécurité)
* [Performance](#performance)
* [Architecture](#architecture-du-sdk)
* [Formats de build](#formats-de-build)
* [Roadmap](#roadmap)
* [Showcase](#showcase)
* [FAQ](#faq)
* [Ressources](#ressources)
* [Contribution](#contribution)
* [Support](#support)
* [Licence](#licence)

---

## Installation

Installez la dernière version du SDK avec npm :

```bash
npm install sendi-api@latest
```

Pour installer une version spécifique :

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

Le client `api` donne accès aux différentes ressources de SendiAPI :

```javascript
api.orders
api.commercant
api.agence
api.delivery
api.stats
api.webhook
```

---

# Fonctionnalités

## Commandes — `orders`

Gestion complète du cycle de vie des commandes.

* Créer une commande
* Consulter les détails d'une commande
* Lister les commandes
* Filtrer et paginer les commandes
* Annuler une commande
* Suivre une commande
* Confirmer la réception d'une commande

---

## Commerçant — `commercant`

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

## Agence — `agence`

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

## Livraison — `delivery`

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

## Statistiques — `stats`

Accédez aux données de performance de votre activité.

* Statistiques commerçant
* Statistiques des commandes
* Statistiques de livraison
* Top des agences
* Performance globale

---

## Webhooks — `webhook`

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

# Exemples d'utilisation

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

## Consulter les crédits

```javascript
const credits = await api.commercant.getCredits();

console.log('Crédits disponibles :', credits.credits);
```

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

## Suivre une commande

```javascript
const tracking = await api.orders.track('order_id');

console.log('Statut :', tracking.status);
```

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

## Gestion des webhooks

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

# Cas d'usage réels

SendiAPI peut être intégré dans différents types de produits et d'applications.

## E-commerce

Un site e-commerce peut créer automatiquement une commande SendiAPI lors de la validation du panier.

```javascript
const order = await api.orders.create({
  clientName: `${formData.firstName} ${formData.lastName}`,
  clientPhone: formData.phone,
  clientAddress: formData.address,
  clientCommune: formData.city,

  pickupAddress: 'Abidjan Cocody Angré',
  pickupCommune: 'Cocody',

  merchantPhone: '+22507080910',
  merchantName: 'JJK Shop',

  items: cart,
  orderTotal: subtotal
});

console.log(`Commande créée : ${order.courseId}`);
console.log(`Code secret : ${order.codeSecret}`);
```

Le commerçant peut ensuite afficher les informations de livraison et le code de suivi directement dans son interface.

---

## Marketplace

Une marketplace peut utiliser SendiAPI pour créer une commande pour chaque vendeur.

```javascript
const order = await api.orders.create({
  clientName: 'Client final',
  clientPhone: client.phone,
  clientAddress: client.address,
  clientCommune: client.commune,

  merchantPhone: vendeur.phone,
  merchantName: vendeur.shopName,

  pickupAddress: vendeur.address,
  pickupCommune: vendeur.commune,

  deliveryMode: 'client_pays',
  currency: 'FCFA'
});
```

Cette approche permet à chaque vendeur de conserver ses propres informations de retrait tout en utilisant une infrastructure de livraison commune.

---

## Application mobile

Une application mobile peut utiliser l'API de suivi pour actualiser le statut d'une commande.

```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const tracking = await api.orders.track(orderId);
      setStatus(tracking.status);
    } catch (error) {
      console.error('Erreur de suivi :', error);
    }
  }, 30000);

  return () => clearInterval(interval);
}, [orderId]);
```

Pour une expérience temps réel native, l'utilisation de WebSocket pourra être envisagée lorsque cette fonctionnalité sera disponible dans SendiAPI.

---

## Plugin e-commerce

SendiAPI peut également être intégré dans un plugin e-commerce ou une solution backend.

Exemple conceptuel côté serveur :

```php
$order_data = [
    'clientName' => $order->get_billing_first_name(),
    'clientPhone' => $order->get_billing_phone(),
    'clientAddress' => $order->get_billing_address_1(),
    'clientCommune' => $order->get_billing_city(),
];

$api->create_order($order_data);
```

> L'exemple PHP illustre le principe d'une intégration côté serveur. Le SDK présenté dans ce dépôt est un SDK JavaScript / Node.js.

---

# Tutoriels

## Intégration en 5 minutes

### Étape 1 — Installation

```bash
npm install sendi-api@latest
```

### Étape 2 — Configuration

Créez un fichier `.env` :

```env
SENDI_API_KEY=sk_live_votre_cle
```

### Étape 3 — Initialisation

```javascript
import SendiAPI from 'sendi-api';

const api = new SendiAPI(
  process.env.SENDI_API_KEY
);
```

### Étape 4 — Créer une commande

```javascript
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
```

### Étape 5 — Suivre la livraison

```javascript
const tracking = await api.orders.track(
  order.courseId
);

console.log(tracking.status);
```

---

## Intégration React

Si votre projet contient un dossier d'exemples React :

```text
examples/react/
```

Vous pouvez y documenter une intégration spécifique à React.

---

## Intégration Vue.js

Pour une intégration Vue.js :

```text
examples/vue/
```

---

## Intégration Node.js

Pour une intégration backend Node.js :

```text
examples/nodejs/
```

---

# Gestion des erreurs

Le SDK fournit une classe `SendiAPIError` permettant de gérer proprement les erreurs retournées par l'API.

```javascript
import SendiAPI, { SendiAPIError } from 'sendi-api';

const api = new SendiAPI(
  'sk_live_votre_cle_api'
);

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

# Dépannage

## Erreur 401 — Unauthorized

### Problème

La clé API est invalide, absente ou incorrecte.

### Solution

Vérifiez votre variable d'environnement :

```bash
echo $SENDI_API_KEY
```

Vérifiez également que votre clé utilise le bon environnement :

```text
sk_test_...
```

ou :

```text
sk_live_...
```

Ne partagez jamais votre clé API publiquement.

---

## Erreur 404 — Not Found

### Problème

L'URL de l'API configurée est incorrecte.

### Mauvaise configuration

```javascript
const api = new SendiAPI(key, {
  baseURL: 'https://sendi-api.com'
});
```

### Bonne configuration

```javascript
const api = new SendiAPI(key, {
  baseURL: 'https://api.sendi-api.com/api/v1'
});
```

---

## Erreur CORS

### Problème

Votre application rencontre une restriction liée à l'origine de la requête.

### Recommandations

1. Vérifiez l'origine autorisée par votre configuration API.
2. Utilisez HTTPS en production.
3. Privilégiez les appels API côté serveur lorsque votre clé API doit rester secrète.
4. Contactez le support SendiAPI si le problème persiste.

---

## Erreur 429 — Rate Limit

### Problème

Trop de requêtes ont été envoyées dans un délai trop court.

### Configuration des retries

```javascript
const api = new SendiAPI(key, {
  maxRetries: 3,
  retryDelay: 2000
});
```

Le SDK peut ainsi effectuer automatiquement plusieurs tentatives selon sa configuration.

---

# Configuration avancée

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

## Options disponibles

| Option       | Description                      | Valeur par défaut |
| ------------ | -------------------------------- | ----------------- |
| `baseURL`    | URL de l'API SendiAPI            | API production    |
| `timeout`    | Timeout des requêtes en ms       | `30000`           |
| `maxRetries` | Nombre maximum de tentatives     | `3`               |
| `retryDelay` | Délai entre les tentatives en ms | `1000`            |
| `headers`    | Headers HTTP personnalisés       | `{}`              |

---

# Environnements

## Développement

```javascript
const api = new SendiAPI(
  'sk_test_votre_cle',
  {
    baseURL: 'http://localhost:5001/api/v1'
  }
);
```

## Production

```javascript
const api = new SendiAPI(
  'sk_live_votre_cle',
  {
    baseURL: 'https://api.sendi-api.com/api/v1'
  }
);
```

Utilisez une clé `sk_test_...` pour vos développements et tests et une clé `sk_live_...` pour votre environnement de production.

---

# Sécurité

La clé API SendiAPI est une information sensible.

## Bonnes pratiques

* Stockez votre clé API dans une variable d'environnement.
* Ne commitez jamais votre clé API dans Git.
* N'exposez jamais votre clé API dans du code exécuté côté navigateur.
* Utilisez des clés différentes pour les environnements de test et de production.
* Utilisez HTTPS en production.

## À éviter

```javascript
const api = new SendiAPI(
  'sk_live_ma-vraie-cle-api'
);
```

## Recommandé

Créez un fichier `.env` :

```env
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

# Performance

## Optimisations intégrées

| Fonctionnalité       | Détail                                    |
| -------------------- | ----------------------------------------- |
| Bundle optimisé      | `49.2 kB`                                 |
| Tree-shaking         | Compatible selon l'environnement de build |
| ESM                  | Support                                   |
| CommonJS             | Support                                   |
| UMD                  | Support                                   |
| Retry automatique    | Jusqu'à 3 tentatives par défaut           |
| Timeout configurable | 30 secondes par défaut                    |

Le bundle du SDK a été optimisé afin de réduire son poids par rapport aux versions précédentes.

## Benchmarks

Les performances réelles dépendent notamment de la connexion réseau, de la localisation du serveur et de la charge de l'API.

Les valeurs de benchmark doivent donc être mesurées dans un environnement contrôlé avant d'être publiées comme références officielles.

Exemple de tableau pouvant être complété avec des mesures réelles :

| Action                      | Temps moyen |
| --------------------------- | ----------: |
| `orders.create()`           |   À mesurer |
| `orders.track()`            |   À mesurer |
| `delivery.calculatePrice()` |   À mesurer |
| `commercant.getCredits()`   |   À mesurer |

---

# Architecture du SDK

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

# Formats de build

Le package prend en charge plusieurs formats afin de faciliter son intégration dans différents environnements JavaScript :

* ESM
* CommonJS (CJS)
* UMD

Le bundle a également été optimisé avec une réduction annoncée de 91 %.

---

# Informations sur la version

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

# Tests

Le SDK dispose actuellement de **129 tests automatisés**.

Pour lancer les tests :

```bash
npm test
```

La suite de tests permet de vérifier le comportement des différentes ressources et fonctionnalités du SDK.

---

# Roadmap

## Réalisé

* [x] Support TypeScript
* [x] Tests unitaires — 129 tests
* [x] Support des webhooks
* [x] Ressource `orders`
* [x] Ressource `commercant`
* [x] Ressource `agence`
* [x] Ressource `delivery`
* [x] Ressource `stats`
* [x] Ressource `webhook`
* [x] Build ESM
* [x] Build CommonJS
* [x] Build UMD
* [x] Optimisation du bundle

## En cours

* [ ] Documentation en ligne complète
* [ ] Support React Hooks
* [ ] Support Vue Composables
* [ ] CLI SendiAPI
* [ ] Documentation interactive

## Prévu

* [ ] Support des paiements
* [ ] Notifications push
* [ ] WebSocket temps réel
* [ ] Support multilingue
* [ ] Fonctionnalités avancées d'automatisation

---

# Roadmap visuelle

```text
2026                         2027
 Q1       Q2       Q3       Q4       Q1       Q2
 │        │        │        │        │        │
 ├────────┤        │        │        │        │
 SDK v1   │        │        │        │        │
          ├────────┤        │        │        │
          SDK v3   │        │        │        │
                   ├────────┤        │        │
                   React / Vue      │        │
                            ├────────┤        │
                            WebSocket        │
                                     ├────────┤
                                     IA / avancé
```

Cette roadmap est indicative et peut évoluer en fonction des priorités produit et des besoins des développeurs.

---

# Showcase

## Ils utilisent SendiAPI

Cette section peut être utilisée pour présenter les projets ayant intégré SendiAPI.

| Projet         | Type       | Stack            |
| -------------- | ---------- | ---------------- |
| JJK Shop       | E-commerce | React + Firebase |
| Votre projet ? | À définir  | À définir        |

Votre projet utilise SendiAPI ?

Ouvrez une Pull Request afin de proposer son ajout au showcase.

---

# FAQ

## Combien coûte SendiAPI ?

Consultez les conditions commerciales et la tarification actuellement proposées sur le site SendiAPI.

https://sendi-api.com

## Puis-je utiliser SendiAPI en production ?

Oui, le SDK est conçu pour être utilisé dans des applications de production, sous réserve du respect des prérequis et de la configuration appropriée de votre compte.

## Combien de commandes puis-je créer ?

Les limites applicables dépendent de votre compte, de vos crédits et des règles de l'API.

Consultez la documentation officielle pour connaître les limites actuellement applicables.

## Le SDK fonctionne-t-il avec React Native ?

Le SDK est conçu principalement pour JavaScript / Node.js. Pour React Native, vérifiez la compatibilité de votre environnement avec les fonctionnalités et dépendances utilisées par le SDK avant une intégration en production.

## Le SDK fonctionne-t-il dans le navigateur ?

Le package fournit un build UMD. Cependant, une clé API ne doit jamais être exposée dans du code frontend public.

Pour les opérations nécessitant une clé secrète, utilisez un backend ou une couche serveur intermédiaire.

## Comment obtenir une clé API ?

1. Créez un compte sur SendiAPI.
2. Accédez à votre dashboard.
3. Ouvrez la section dédiée aux clés API.
4. Générez ou récupérez votre clé.
5. Stockez-la dans une variable d'environnement.

https://sendi-api.com

## Le SDK est-il open source ?

Oui. Le SDK est distribué sous licence MIT.

---

# Bonus

## Générateur de commande

Vous pouvez créer vos propres fonctions utilitaires afin de simplifier les intégrations.

```javascript
export const createQuickOrder = async (
  api,
  cart,
  client
) => {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return api.orders.create({
    clientName: client.name,
    clientPhone: client.phone,
    clientAddress: client.address,
    clientCommune: client.commune,

    pickupAddress: process.env.PICKUP_ADDRESS,
    pickupCommune: process.env.PICKUP_COMMUNE,
    merchantPhone: process.env.MERCHANT_PHONE,

    items: cart,
    orderTotal: subtotal
  });
};
```

Utilisation :

```javascript
const order = await createQuickOrder(
  api,
  cart,
  client
);

console.log(order.courseId);
```

---

# Ressources

| Ressource     | Lien                                              |
| ------------- | ------------------------------------------------- |
| Documentation | https://sendi-api.com/docs                        |
| npm           | https://www.npmjs.com/package/sendi-api           |
| GitHub        | https://github.com/EmmanuelJessy/sdk-sendi        |
| SendiAPI      | https://sendi-api.com                             |
| Issues        | https://github.com/EmmanuelJessy/sdk-sendi/issues |

---

# Prérequis

* Node.js `>= 14.0.0`
* Une clé API SendiAPI

Obtenez votre clé API depuis votre compte SendiAPI :

https://sendi-api.com

---

# Contribution

Les contributions sont les bienvenues.

## 1. Forker le projet

Forkez le dépôt GitHub :

https://github.com/EmmanuelJessy/sdk-sendi

## 2. Créer une branche

```bash
git checkout -b feature/amazing-feature
```

## 3. Commiter vos modifications

```bash
git commit -m "Add amazing feature"
```

## 4. Pousser votre branche

```bash
git push origin feature/amazing-feature
```

## 5. Ouvrir une Pull Request

Décrivez clairement les changements apportés et leur objectif.

---

# Support

Une question, un problème ou besoin d'aide pour votre intégration ?

**Email :** [support@sendi-api.com](mailto:support@sendi-api.com)

**Site web :** https://sendi-api.com

**GitHub Issues :** https://github.com/EmmanuelJessy/sdk-sendi/issues

---

# Licence

Ce projet est distribué sous licence **MIT**.

```text
MIT © Sendi API Team
```

---

# SendiAPI

> **Une seule API pour connecter votre application aux services de livraison en Afrique.**

Que vous développiez :

* Une boutique e-commerce
* Une marketplace
* Une application mobile
* Une plateforme SaaS
* Un ERP ou CRM
* Un plugin e-commerce
* Une application métier

**SendiAPI vous permet d'intégrer les services de livraison à votre application à travers une API unique.**

## Installation

```bash
npm install sendi-api@latest
```

**Build. Integrate. Deliver.**
