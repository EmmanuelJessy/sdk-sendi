// scripts/build.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script de build du SDK
 */
async function build() {
  console.log('\n🚀 Build du SDK SendiAPI...\n');

  // Vérifier que le dossier src existe
  const srcDir = path.join(__dirname, '..', 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Dossier src non trouvé');
    process.exit(1);
  }

  // Créer le dossier dist
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Dossier dist créé');
  }

  console.log('✅ Build terminé avec succès !\n');
}

// Exécution
build().catch(console.error);