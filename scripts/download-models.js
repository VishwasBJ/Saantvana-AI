const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_BASE_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

const modelsDir = path.join(__dirname, '..', 'public', 'models');

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded ${path.basename(dest)}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadModels() {
  console.log('Downloading face-api.js models...\n');
  
  for (const model of models) {
    const url = MODEL_BASE_URL + model;
    const dest = path.join(modelsDir, model);
    
    try {
      await downloadFile(url, dest);
    } catch (error) {
      console.error(`✗ Error downloading ${model}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('\n✓ All models downloaded successfully!');
}

downloadModels();
