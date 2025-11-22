# 🤖 ML Emotion Detection Model - Implementation Guide

## 🎯 Goal
Build a functional face-based emotion detection system that classifies 5 emotions: Happy, Sad, Anxious, Stressed, Angry

---

## 📊 Three Approaches (Ranked by Effort vs Results)

### ⭐ Approach 1: Use Pre-trained Model (RECOMMENDED - Quick Start)
**Time**: 1-2 hours
**Accuracy**: 70-80%
**Effort**: Low

Use an existing emotion detection model and adapt it to your 5 categories.

#### Best Pre-trained Models:
1. **FER+ (Facial Expression Recognition)**
   - Already trained on 8 emotions
   - Can be remapped to your 5 categories
   - Available in TensorFlow.js format

2. **face-api.js Emotion Model**
   - Built-in emotion detection
   - Works directly in browser
   - Easy integration

3. **DeepFace (Python)**
   - High accuracy
   - Multiple backend options
   - Can export to TensorFlow.js

#### Implementation Steps:

**Option A: Use face-api.js (Easiest)**
```bash
npm install face-api.js
```

```typescript
import * as faceapi from 'face-api.js'

// Load models
await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
await faceapi.nets.faceExpressionNet.loadFromUri('/models')

// Detect emotions
const detections = await faceapi
  .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
  .withFaceExpressions()

// Map to your 5 emotions
const emotions = mapToFiveEmotions(detections.expressions)
```

**Emotion Mapping:**
```typescript
function mapToFiveEmotions(expressions: any) {
  // face-api.js gives: neutral, happy, sad, angry, fearful, disgusted, surprised
  
  return {
    Happy: expressions.happy,
    Sad: expressions.sad,
    Anxious: expressions.fearful + expressions.surprised * 0.5,
    Stressed: expressions.disgusted + expressions.neutral * 0.3,
    Angry: expressions.angry
  }
}
```

---

### ⭐⭐ Approach 2: Fine-tune Existing Model (BALANCED)
**Time**: 1-2 days
**Accuracy**: 80-85%
**Effort**: Medium

Take a pre-trained model and fine-tune it on your specific 5 categories.

#### Steps:

1. **Get Pre-trained Model**
   - Download FER-2013 trained model
   - Or use MobileNetV2 with ImageNet weights

2. **Prepare Small Dataset**
   - Collect 100-200 images per emotion (500-1000 total)
   - Use Google Images, Kaggle, or record yourself
   - Label them as: Happy, Sad, Anxious, Stressed, Angry

3. **Fine-tune Model**
```python
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model

# Load pre-trained base
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze base layers

# Add custom head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(5, activation='softmax')(x)  # 5 emotions

model = Model(inputs=base_model.input, outputs=predictions)

# Compile
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train on your data
model.fit(
    train_dataset,
    epochs=10,
    validation_data=val_dataset
)

# Export to TensorFlow.js
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, 'public/models/emotion_model')
```

---

### ⭐⭐⭐ Approach 3: Train from Scratch (BEST ACCURACY)
**Time**: 1-2 weeks
**Accuracy**: 85-90%+
**Effort**: High

Train a custom model using the datasets you specified.

#### Datasets to Use:

1. **AffectNet** (Primary)
   - 450,000+ images
   - Real-world expressions
   - Download: http://mohammadmahoor.com/affectnet/

2. **RAF-DB** (Secondary)
   - 30,000 images
   - High quality
   - Download: http://www.whdeng.cn/raf/model1.html

3. **FER-2013** (Supplementary)
   - 35,000 images
   - Kaggle: https://www.kaggle.com/datasets/msambare/fer2013

#### Label Mapping Strategy:
```python
# Original labels → Your 5 categories
LABEL_MAPPING = {
    # Happy
    'happy': 'Happy',
    'joy': 'Happy',
    
    # Sad
    'sad': 'Sad',
    'sadness': 'Sad',
    
    # Anxious
    'fear': 'Anxious',
    'fearful': 'Anxious',
    'surprise': 'Anxious',  # Partial
    
    # Stressed
    'disgust': 'Stressed',
    'contempt': 'Stressed',
    'neutral': 'Stressed',  # Partial - tired/overwhelmed
    
    # Angry
    'anger': 'Angry',
    'angry': 'Angry',
}
```

#### Training Pipeline:
```python
# 1. Data Preprocessing
def preprocess_datasets():
    # Load AffectNet, RAF-DB, FER-2013
    # Remap labels to 5 categories
    # Resize to 224x224
    # Normalize pixel values
    # Data augmentation
    pass

# 2. Model Architecture
def create_model():
    base = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Unfreeze last few layers for fine-tuning
    for layer in base.layers[-20:]:
        layer.trainable = True
    
    x = base.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(5, activation='softmax')(x)
    
    return Model(inputs=base.input, outputs=predictions)

# 3. Training Configuration
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy', 'top_k_categorical_accuracy']
)

# 4. Callbacks
callbacks = [
    tf.keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True),
    tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3)
]

# 5. Train
history = model.fit(
    train_dataset,
    epochs=50,
    validation_data=val_dataset,
    callbacks=callbacks
)
```

---

## 🚀 Quick Implementation Plan (Recommended Path)

### Phase 1: Get It Working (Week 1)
**Use Approach 1 - Pre-trained Model**

1. **Install face-api.js**
```bash
npm install face-api.js
```

2. **Download Pre-trained Models**
```bash
# Create public/models directory
mkdir -p public/models

# Download face-api.js models
# From: https://github.com/justadudewhohacks/face-api.js-models
# Download:
# - tiny_face_detector_model-weights_manifest.json
# - face_expression_model-weights_manifest.json
```

3. **Update Webcam Detector Component**
Replace the simulated detection with real face-api.js detection.

4. **Test & Iterate**
- Test with different faces
- Adjust emotion mapping
- Fine-tune confidence thresholds

### Phase 2: Improve Accuracy (Week 2-3)
**Use Approach 2 - Fine-tune Model**

1. **Collect Small Dataset**
- 100-200 images per emotion
- Use Google Images or record yourself
- Label correctly

2. **Fine-tune Model**
- Use transfer learning
- Train for 10-20 epochs
- Export to TensorFlow.js

3. **Replace face-api.js**
- Load your custom model
- Update inference code
- Test accuracy improvement

### Phase 3: Production Ready (Week 4+)
**Use Approach 3 - Full Training** (Optional)

1. **Download Full Datasets**
2. **Train Custom Model**
3. **Optimize for Web**
4. **Deploy**

---

## 📝 Detailed Implementation: Approach 1 (face-api.js)

### Step 1: Install Dependencies
```bash
npm install face-api.js
```

### Step 2: Download Models
Create a script to download models:

```typescript
// scripts/download-models.ts
import * as faceapi from 'face-api.js'
import * as fs from 'fs'
import * as path from 'path'

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights'

async function downloadModels() {
  const modelsDir = path.join(process.cwd(), 'public', 'models')
  
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true })
  }
  
  console.log('Downloading face-api.js models...')
  
  // Download required models
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
  
  console.log('Models downloaded successfully!')
}

downloadModels()
```

### Step 3: Update Webcam Detector

```typescript
// components/emotion-detector/webcam-emotion-detector.tsx
import * as faceapi from 'face-api.js'

// Load models
useEffect(() => {
  loadModels()
}, [])

const loadModels = async () => {
  try {
    setIsLoading(true)
    
    // Load face-api.js models
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
    await faceapi.nets.faceExpressionNet.loadFromUri('/models')
    
    setModel({ loaded: true })
    setIsLoading(false)
  } catch (error) {
    console.error("Error loading models:", error)
    setIsLoading(false)
  }
}

// Detect emotion
const detectEmotion = useCallback(async () => {
  if (!webcamRef.current || !model) return

  try {
    const video = webcamRef.current.video
    if (!video) return

    // Detect face and expressions
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()

    if (detection) {
      const expressions = detection.expressions
      
      // Map to your 5 emotions
      const mappedEmotions = {
        Happy: expressions.happy,
        Sad: expressions.sad,
        Anxious: expressions.fearful + expressions.surprised * 0.5,
        Stressed: expressions.disgusted + expressions.neutral * 0.3,
        Angry: expressions.angry
      }
      
      // Find highest emotion
      const maxEmotion = Object.entries(mappedEmotions)
        .reduce((a, b) => a[1] > b[1] ? a : b)
      
      const emotionData = EMOTIONS.find(e => e.name === maxEmotion[0])
      
      setEmotion({
        emotion: maxEmotion[0],
        confidence: maxEmotion[1] * 100,
        emoji: emotionData?.emoji || '😐',
        color: emotionData?.color || 'text-gray-600'
      })
      
      onEmotionDetected?.(maxEmotion[0])
    }
  } catch (error) {
    console.error("Error detecting emotion:", error)
  }
}, [model, onEmotionDetected])
```

---

## 🎯 Success Metrics

### Minimum Viable Product (MVP):
- ✅ Detects faces in real-time
- ✅ Classifies 5 emotions with >60% accuracy
- ✅ Updates every 2-3 seconds
- ✅ Shows confidence scores
- ✅ Provides mood suggestions

### Production Ready:
- ✅ >80% accuracy on test set
- ✅ <100ms inference time
- ✅ Works in various lighting conditions
- ✅ Handles multiple face angles
- ✅ Robust error handling

---

## 🔧 Troubleshooting

### Common Issues:

1. **Low Accuracy**
   - Adjust emotion mapping weights
   - Improve lighting conditions
   - Use higher quality webcam
   - Fine-tune model

2. **Slow Performance**
   - Use TinyFaceDetector (faster)
   - Reduce detection frequency
   - Optimize model size
   - Use Web Workers

3. **False Positives**
   - Add confidence threshold (>70%)
   - Smooth predictions over time
   - Use temporal averaging

---

## 📚 Resources

### Pre-trained Models:
- face-api.js: https://github.com/justadudewhohacks/face-api.js
- TensorFlow.js Models: https://www.tensorflow.org/js/models
- MediaPipe: https://mediapipe.dev/

### Datasets:
- AffectNet: http://mohammadmahoor.com/affectnet/
- RAF-DB: http://www.whdeng.cn/raf/model1.html
- FER-2013: https://www.kaggle.com/datasets/msambare/fer2013

### Tutorials:
- TensorFlow.js: https://www.tensorflow.org/js/tutorials
- Transfer Learning: https://www.tensorflow.org/tutorials/images/transfer_learning
- Model Optimization: https://www.tensorflow.org/lite/performance/model_optimization

---

## 🚀 Next Steps

1. **Choose Your Approach**
   - Quick: Use face-api.js (Approach 1)
   - Balanced: Fine-tune model (Approach 2)
   - Best: Train from scratch (Approach 3)

2. **Implement**
   - Follow the steps for your chosen approach
   - Test thoroughly
   - Iterate based on results

3. **Deploy**
   - Optimize model size
   - Test on different devices
   - Monitor performance

---

**Recommendation**: Start with **Approach 1 (face-api.js)** to get it working quickly, then move to **Approach 2** for better accuracy if needed.

Would you like me to implement Approach 1 now?
