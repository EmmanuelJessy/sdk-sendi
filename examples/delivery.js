// examples/delivery.js
import SendiAPI from '../src/index.js';

// Initialisation
const api = new SendiAPI('sk_live_votre_cle_api', {
  baseURL: 'https://api.sendi-api.com/api/v1'
});

/**
 * Exemple: Récupérer la configuration de livraison
 */
async function getDeliveryConfig() {
  console.log('\n📦 Récupération de la configuration de livraison...');
  
  try {
    const config = await api.delivery.getConfig();
    
    console.log('\n✅ Configuration récupérée:');
    console.log(`  Pays: ${config.country}`);
    console.log(`  Commune: ${config.commune}`);
    console.log(`  Téléphone: ${config.phone}`);
    console.log(`  Mode de livraison: ${config.deliveryMode}`);
    console.log(`  Seuil gratuité: ${config.freeThreshold} ${config.currency}`);
    console.log(`  Inter-pays: ${config.interCountryEnabled ? 'Activé' : 'Désactivé'}`);
    console.log(`  Pays autorisés: ${config.allowedCountries.join(', ')}`);
    
    return config;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

/**
 * Exemple: Récupérer les communes par pays
 */
async function getCommunes() {
  console.log('\n🌍 Récupération des communes...');
  
  try {
    // Toutes les communes
    const all = await api.delivery.getCommunes();
    console.log(`\n✅ ${all.communes.length} communes disponibles`);
    
    // Filtrer par pays
    const ciCommunes = await api.delivery.getCommunes({ country: 'CI' });
    console.log(`✅ ${ciCommunes.communes.length} communes en Côte d\'Ivoire`);
    
    return ciCommunes;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

/**
 * Exemple: Calculer le prix de livraison
 */
async function calculateDeliveryPrice() {
  console.log('\n💰 Calcul du prix de livraison...');
  
  const scenarios = [
    {
      pickup: 'Yopougon',
      client: 'Cocody',
      mode: 'client_pays',
      total: 0,
      label: 'Client paie (même commune)'
    },
    {
      pickup: 'Yopougon',
      client: 'Cocody',
      mode: 'client_pays',
      total: 0,
      label: 'Client paie (commune différente)'
    },
    {
      pickup: 'Yopougon',
      client: 'Cocody',
      mode: 'threshold',
      freeThreshold: 50000,
      orderTotal: 75000,
      label: 'Gratuit (seuil dépassé)'
    },
    {
      pickup: 'Yopougon',
      client: 'Cocody',
      mode: 'threshold',
      freeThreshold: 50000,
      orderTotal: 30000,
      label: 'Payant (seuil non dépassé)'
    }
  ];

  for (const scenario of scenarios) {
    try {
      const result = await api.delivery.calculatePrice(
        scenario.pickup,
        scenario.client,
        {
          deliveryMode: scenario.mode,
          freeThreshold: scenario.freeThreshold,
          orderTotal: scenario.orderTotal
        }
      );
      
      console.log(`\n✅ ${scenario.label}:`);
      console.log(`  Prix: ${result.price} ${result.currency}`);
      console.log(`  Gratuit: ${result.isFree ? 'Oui' : 'Non'}`);
    } catch (error) {
      console.error(`❌ Erreur pour ${scenario.label}:`, error.message);
    }
  }
}

/**
 * Exemple: Récupérer les agences disponibles
 */
async function getAvailableAgences() {
  console.log('\n🚚 Récupération des agences disponibles...');
  
  try {
    const result = await api.delivery.getAvailableAgences('Cocody', {
      pickupCommune: 'Yopougon',
      clientCommune: 'Cocody',
      limit: 10
    });
    
    console.log(`\n✅ ${result.agences.length} agences disponibles:`);
    result.agences.forEach(agence => {
      console.log(`  - ${agence.name}`);
      console.log(`    Téléphone: ${agence.phone}`);
      console.log(`    Prix (même commune): ${agence.deliveryPriceSame} FCFA`);
      console.log(`    Prix (autre commune): ${agence.deliveryPriceDifferent} FCFA`);
    });
    
    return result;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

/**
 * Exemple: Mettre à jour la configuration de livraison
 */
async function updateDeliveryConfig() {
  console.log('\n⚙️ Mise à jour de la configuration de livraison...');
  
  try {
    const newConfig = {
      country: 'CI',
      commune: 'Cocody',
      phone: '+22507080910',
      deliveryMode: 'threshold',
      freeThreshold: 25000,
      currency: 'FCFA',
      interCountryEnabled: false,
      allowedCountries: ['CI'],
      pickupAddress: '456 Rue de Pickup, Cocody',
      merchantName: 'Ma Boutique',
      merchantEmail: 'contact@maboutique.com'
    };

    const result = await api.delivery.updateConfig(newConfig);
    
    console.log('\n✅ Configuration mise à jour:');
    console.log(`  Mode: ${result.deliveryMode}`);
    console.log(`  Seuil: ${result.freeThreshold} ${result.currency}`);
    
    return result;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

/**
 * Exemple: Vérifier la disponibilité d'une livraison
 */
async function checkAvailability() {
  console.log('\n🔍 Vérification de la disponibilité...');
  
  try {
    const result = await api.delivery.checkAvailability('Yopougon', 'Cocody');
    
    console.log('\n✅ Disponibilité:');
    console.log(`  Disponible: ${result.available ? 'Oui' : 'Non'}`);
    if (result.available) {
      console.log(`  Nombre d'agences: ${result.agencesCount || 0}`);
      console.log(`  Temps estimé: ${result.estimatedTime || 'N/A'}`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter tous les exemples
async function runAllExamples() {
  console.log('\n🚀 Exemples de l\'API Delivery Sendi\n');
  console.log('=' .repeat(60));
  
  await getDeliveryConfig();
  await getCommunes();
  await calculateDeliveryPrice();
  await getAvailableAgences();
  await checkAvailability();
  // await updateDeliveryConfig(); // Décommenter pour tester
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Tous les exemples ont été exécutés');
}

// Exécution
runAllExamples().catch(console.error);