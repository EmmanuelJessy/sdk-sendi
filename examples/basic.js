// examples/basic.js
import SendiAPI from '../src/index.js';

// Initialisation
const api = new SendiAPI('sk_live_votre_cle_api', {
  baseURL: 'https://api.sendi-api.com/api/v1'
});

/**
 * Exemple basique d'utilisation
 */
async function basicExample() {
  console.log('\n🚀 Exemple basique d\'utilisation du SDK SendiAPI\n');
  console.log('='.repeat(60));

  try {
    // 1. Vérifier la santé de l'API
    console.log('\n1️⃣ Vérification de la santé de l\'API...');
    const health = await api.health();
    console.log('✅ API en ligne:', health);

    // 2. Récupérer les communes
    console.log('\n2️⃣ Récupération des communes...');
    const communes = await api.getCommunes();
    console.log(`✅ ${communes.communes?.length || 0} communes disponibles`);

    // 3. Récupérer la configuration de livraison
    console.log('\n3️⃣ Récupération de la configuration de livraison...');
    const config = await api.getDeliveryConfig();
    console.log('✅ Configuration récupérée');
    console.log(`  Pays: ${config.country}`);
    console.log(`  Commune: ${config.commune}`);
    console.log(`  Mode: ${config.deliveryMode}`);

    // 4. Calculer le prix de livraison
    console.log('\n4️⃣ Calcul du prix de livraison...');
    const price = await api.calculatePrice('Yopougon', 'Cocody');
    console.log(`✅ Prix: ${price.price} ${price.currency}`);

    // 5. Vérifier la disponibilité
    console.log('\n5️⃣ Vérification de la disponibilité...');
    const availability = await api.checkAvailability('Yopougon', 'Cocody');
    console.log(`✅ Disponible: ${availability.available ? 'Oui' : 'Non'}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Tous les tests ont réussi');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (error.data) {
      console.error('Détails:', error.data);
    }
  }
}

// Exécution
basicExample();