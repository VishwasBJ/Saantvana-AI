#!/bin/bash

# Create models directory
mkdir -p public/models

# Base URL for face-api.js models
BASE_URL="https://github.com/justadudewhohacks/face-api.js-models/raw/master"

echo "Downloading face-api.js models..."

# Download tiny face detector
curl -L -o public/models/tiny_face_detector_model-weights_manifest.json "$BASE_URL/tiny_face_detector_model-weights_manifest.json"
curl -L -o public/models/tiny_face_detector_model-shard1 "$BASE_URL/tiny_face_detector_model-shard1"

# Download face expression model
curl -L -o public/models/face_expression_model-weights_manifest.json "$BASE_URL/face_expression_model-weights_manifest.json"
curl -L -o public/models/face_expression_model-shard1 "$BASE_URL/face_expression_model-shard1"

echo "Models downloaded successfully!"
ls -lh public/models/
