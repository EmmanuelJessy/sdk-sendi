// examples/order.js
import SendiAPI from '../src/index.js';

const api = new SendiAPI('sk_live_votre_cle_api', {
  baseURL: 'https://api.sendi-api.com/api/v1'
});

/**
 * Exemple de création et gestion de commande
 */
async function orderExample() {
  console.log('\n📦 Exemple de gestion de commande\n');
  console.log('='.repeat(60));

  try {
    // 1. Créer une commande
    console.log('\n1️⃣ Création d\'une commande...');
    const orderData = {
      clientName: 'Jean Dupont',
      clientPhone: '+22501020304',
      clientAddress: '123 Rue de la Paix, Cocody',
      clientCommune: 'Cocody',
      clientCountry: 'CI',
      pickupAddress: '456 Rue du Commerce, Yopougon',
      pickupCommune: 'Yopougon',
      pickupCountry: 'CI',
      merchantName: 'Ma Boutique',
      merchantPhone: '+22507080910',
      merchantEmail: 'contact@maboutique.com',
      merchantCountry: 'CI',
      deliveryMode: 'client_pays',
      currency: 'FCFA',
      orderTotal: 25000,
      packageWeight: 2,
      packageDescription: 'Colis de vêtements',
      instructions: 'Appeler avant livraison'
    };

    const order = await api.orders.create(orderData);
    console.log('✅ Commande créée avec succès!');
    console.log(`  Course ID: ${order.courseId}`);
    console.log(`  Code secret: ${order.codeSecret}`);
    console.log(`  Prix: ${order.price} FCFA`);

    // 2. Récupérer les détails de la commande
    console.log('\n2️⃣ Récupération des détails...');
    const details = await api.orders.get(order.courseId);
    console.log('✅ Détails de la commande:');
    console.log(`  Statut: ${details.status}`);
    console.log(`  Client: ${details.clientName}`);
    console.log(`  Téléphone: ${details.clientPhone}`);

    // 3. Suivre la commande
    console.log('\n3️⃣ Suivi de la commande...');
    const tracking = await api.orders.track(order.courseId);
    console.log('✅ Suivi:');
    console.log(`  Statut: ${tracking.status}`);
    if (tracking.steps) {
      tracking.steps.forEach((step, i) => {
        console.log(`  ${i + 1}. ${step.label} ${step.completed ? '✅' : '⏳'}`);
      });
    }

    // 4. Lister les commandes
    console.log('\n4️⃣ Liste des commandes...');
    const orders = await api.orders.list({ limit: 5 });
    console.log(`✅ ${orders.orders?.length || 0} commandes récupérées`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Gestion de commande terminée');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (error.data) {
      console.error('Détails:', error.data);
    }
  }
}

// Exécution
orderExample();