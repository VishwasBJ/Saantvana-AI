"use client"

import { useState, useEffect } from "react"
import WebcamEmotionDetector from "./emotion-detector/webcam-emotion-detector"
import MoodSuggestions from "./emotion-detector/mood-suggestions"
import { Alert, AlertDescription } from "./ui/alert"
import { Card } from "./ui/card"
import { Info, Loader2, Sparkles } from "lucide-react"

export default function StressDetectorPage() {
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)

  // Fetch AI suggestions when emotion is detected
  useEffect(() => {
    if (detectedEmotion) {
      fetchAISuggestions(detectedEmotion)
    }
  }, [detectedEmotion])

  const fetchAISuggestions = async (emotion: string) => {
    setLoadingSuggestion(true)
    try {
      const response = await fetch("/api/emotion-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiSuggestion(data.suggestion)
      } else {
        console.error("Failed to fetch AI suggestions")
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error)
    } finally {
      setLoadingSuggestion(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Stress & Emotion Detector
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered system analyzes your facial expressions in real-time to detect your emotional state
          and provide personalized wellness recommendations.
        </p>
      </div>

      {/* Privacy Notice */}
      <Alert className="max-w-4xl mx-auto">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Notice:</strong> All emotion detection happens locally in your browser. 
          No images or video are sent to any server. Your privacy is completely protected.
        </AlertDescription>
      </Alert>

      {/* Webcam Emotion Detector */}
      <div className="max-w-6xl mx-auto">
        <WebcamEmotionDetector onEmotionDetected={setDetectedEmotion} />
      </div>

      {/* AI-Generated Personalized Suggestions */}
      {detectedEmotion && (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered Personalized Suggestions
              </h2>
            </div>
            
            {loadingSuggestion ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-3 text-muted-foreground">Generating personalized suggestions...</span>
              </div>
            ) : aiSuggestion ? (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div 
                    className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed"
                    style={{ 
                      fontSize: '0.95rem',
                      lineHeight: '1.7'
                    }}
                  >
                    {aiSuggestion.split('\n').map((line, index) => {
                      // Bold headings that start with **
                      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                        const text = line.replace(/\*\*/g, '')
                        return (
                          <div key={index} className="font-bold text-lg text-purple-700 dark:text-purple-300 mt-4 mb-2">
                            {text}
                          </div>
                        )
                      }
                      // Regular lines
                      return line.trim() ? (
                        <p key={index} className="mb-2">{line}</p>
                      ) : (
                        <br key={index} />
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      )}

      {/* Mood-Based Suggestions */}
      {detectedEmotion && (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MoodSuggestions emotion={detectedEmotion} />
        </div>
      )}

      {/* How It Works */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">📸</span>
            </div>
            <h3 className="font-semibold">1. Capture</h3>
            <p className="text-sm text-muted-foreground">
              Your webcam captures your facial expression in real-time
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="font-semibold">2. Analyze</h3>
            <p className="text-sm text-muted-foreground">
              AI analyzes your expression to detect your emotional state
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="font-semibold">3. Recommend</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized wellness suggestions based on your mood
            </p>
          </div>
        </div>
      </div>

      {/* Supported Emotions */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Detected Emotions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Happy", emoji: "😊", color: "bg-green-100 dark:bg-green-900" },
            { name: "Sad", emoji: "😢", color: "bg-blue-100 dark:bg-blue-900" },
            { name: "Anxious", emoji: "😰", color: "bg-yellow-100 dark:bg-yellow-900" },
            { name: "Stressed", emoji: "😫", color: "bg-orange-100 dark:bg-orange-900" },
            { name: "Angry", emoji: "😠", color: "bg-red-100 dark:bg-red-900" },
          ].map((emotion) => (
            <div key={emotion.name} className={`${emotion.color} rounded-lg p-4 text-center transition-transform hover:scale-105`}>
              <div className="text-4xl mb-2">{emotion.emoji}</div>
              <div className="font-semibold text-sm">{emotion.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Info */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by face-api.js and TensorFlow.js • Real-time AI emotion detection in your browser
        </p>
      </div>
    </div>
  )
}
