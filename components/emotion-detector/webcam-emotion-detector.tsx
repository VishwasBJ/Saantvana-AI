"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, CameraOff, Loader2 } from "lucide-react"

interface EmotionResult {
  emotion: string
  confidence: number
  emoji: string
  color: string
}

const EMOTIONS = [
  { name: "Happy", emoji: "😊", color: "text-green-600" },
  { name: "Sad", emoji: "😢", color: "text-blue-600" },
  { name: "Anxious", emoji: "😰", color: "text-yellow-600" },
  { name: "Stressed", emoji: "😫", color: "text-orange-600" },
  { name: "Angry", emoji: "😠", color: "text-red-600" },
]

export default function WebcamEmotionDetector({ onEmotionDetected }: { onEmotionDetected?: (emotion: string) => void }) {
  const webcamRef = useRef<Webcam>(null)
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emotion, setEmotion] = useState<EmotionResult | null>(null)
  const [model, setModel] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load face-api.js models
  useEffect(() => {
    loadModel()
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])

  const loadModel = async () => {
    try {
      setIsLoading(true)
      console.log("Starting to load face-api.js models...")
      
      // Dynamically import face-api.js
      const faceapi = await import('face-api.js')
      console.log("face-api.js imported successfully")
      
      // Load face detection and expression models
      console.log("Loading TinyFaceDetector model...")
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      console.log("TinyFaceDetector loaded successfully")
      
      console.log("Loading FaceExpression model...")
      await faceapi.nets.faceExpressionNet.loadFromUri('/models')
      console.log("FaceExpression loaded successfully")
      
      setModel({ loaded: true, faceapi })
      setIsLoading(false)
      console.log("All models loaded successfully!")
    } catch (error) {
      console.error("Error loading models:", error)
      const errorMsg = error instanceof Error ? error.message : String(error)
      setError(`Failed to load AI models: ${errorMsg}`)
      setIsLoading(false)
    }
  }

  const detectEmotion = useCallback(async () => {
    if (!webcamRef.current || !model || !model.faceapi) return

    try {
      const video = webcamRef.current.video
      if (!video) return

      const faceapi = model.faceapi

      // Detect face and expressions
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()

      if (detection) {
        const expressions = detection.expressions
        
        // Map face-api.js emotions to our 5 categories
        // face-api.js provides: neutral, happy, sad, angry, fearful, disgusted, surprised
        const mappedEmotions = {
          Happy: expressions.happy,
          Sad: expressions.sad,
          Anxious: expressions.fearful + expressions.surprised * 0.5,
          Stressed: expressions.disgusted + expressions.neutral * 0.3,
          Angry: expressions.angry
        }
        
        // Find highest scoring emotion
        const maxEmotion = Object.entries(mappedEmotions)
          .reduce((a, b) => a[1] > b[1] ? a : b)
        
        const emotionData = EMOTIONS.find(e => e.name === maxEmotion[0])
        
        if (emotionData) {
          const result: EmotionResult = {
            emotion: maxEmotion[0],
            confidence: maxEmotion[1] * 100,
            emoji: emotionData.emoji,
            color: emotionData.color,
          }

          setEmotion(result)
          onEmotionDetected?.(maxEmotion[0])
          
          // Stop detection after first emotion is detected
          setIsActive(false)
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current)
            detectionIntervalRef.current = null
          }
        }
      }
    } catch (error) {
      console.error("Error detecting emotion:", error)
    }
  }, [model, onEmotionDetected])

  const startDetection = () => {
    setIsActive(true)
    detectEmotion() // Detect immediately
    detectionIntervalRef.current = setInterval(detectEmotion, 3000) // Every 3 seconds
  }

  const stopDetection = () => {
    setIsActive(false)
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    setEmotion(null)
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Emotion Detection</h2>
        <Button
          onClick={isActive ? stopDetection : startDetection}
          disabled={isLoading || !model}
          variant={isActive ? "destructive" : "default"}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading Models...
            </>
          ) : isActive ? (
            <>
              <CameraOff className="w-4 h-4" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              Start Camera
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Webcam Feed */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {isActive ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-75">
                  {model ? "Click 'Start Camera' to begin" : "Loading AI models..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Emotion Display */}
        <div className="flex flex-col justify-center space-y-4">
          {emotion ? (
            <>
              <div className="text-center">
                <div className="text-8xl mb-4 animate-in zoom-in duration-300">{emotion.emoji}</div>
                <h3 className={`text-3xl font-bold ${emotion.color} animate-in fade-in duration-300`}>
                  {emotion.emotion}
                </h3>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Confidence</span>
                  <span>{emotion.confidence.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${emotion.confidence}%` }}
                  />
                </div>
              </div>

              {/* Emotion Description */}
              <Card className="p-4 bg-secondary/20">
                <p className="text-sm text-muted-foreground">
                  {getEmotionDescription(emotion.emotion)}
                </p>
              </Card>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Waiting for emotion detection...</p>
              <p className="text-sm mt-2">
                {isActive ? "Analyzing your facial expression..." : model ? "Start the camera to begin" : "Loading AI models..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Powered by face-api.js */}
      <div className="text-center text-xs text-muted-foreground">
        Powered by face-api.js • Real-time AI emotion detection
      </div>
    </Card>
  )
}

function getEmotionDescription(emotion: string): string {
  const descriptions: Record<string, string> = {
    Happy: "You're showing positive emotions! Your facial expression indicates contentment and well-being.",
    Sad: "You appear to be experiencing sadness. It's okay to feel this way. Consider reaching out for support.",
    Anxious: "Signs of anxiety detected. Try some breathing exercises or grounding techniques to help calm your mind.",
    Stressed: "You seem stressed. Take a moment to relax. Consider taking a short break or practicing mindfulness.",
    Angry: "You're showing signs of anger or frustration. Deep breathing and stepping away can help manage these feelings.",
  }
  return descriptions[emotion] || "Analyzing your emotional state..."
}
