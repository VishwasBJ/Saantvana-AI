"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Sparkles, RefreshCw, Heart } from "lucide-react"
import MoodHero from "./mood-hero"

const STRESS_FACTORS: Record<string, string[]> = {
  adolescent: [
    "Academic pressure",
    "Peer relationships",
    "Family expectations",
    "Social media stress",
    "Body image concerns",
    "Future concerns",
  ],
  "young-adult": [
    "Education/career uncertainty",
    "Financial worries",
    "Independence challenges",
    "Relationship challenges",
    "Mental health (anxiety, depression)",
    "Work-life balance",
  ],
  "early-adult": [
    "Career progression",
    "Job security",
    "Family balancing",
    "Financial planning",
    "Work-life balance",
    "Personal growth",
  ],
  "mature-adult": [
    "Raising children",
    "Job stability",
    "Aging parents",
    "Health concerns",
    "Long-term financial planning",
    "Life purpose",
  ],
}

const EMOTION_RESPONSES: Record<string, string> = {
  happy: "🎉 That's wonderful! Keep nurturing this positive energy.",
  sad: "💙 It's okay to feel down. Remember, this feeling is temporary.",
  anxious: "🌬️ Take a deep breath. You're stronger than you think.",
  stressed: "⚡ Let's work through this together. One step at a time.",
  angry: "🔥 It's valid to feel frustrated. Let's channel this energy positively.",
  calm: "☮️ You're in a great place mentally. Maintain this peace.",
}

const COPING_SUGGESTIONS: Record<string, string[]> = {
  happy: ["Share your joy with others", "Document this positive moment", "Help someone else"],
  sad: ["Reach out to a trusted friend", "Practice self-compassion", "Engage in a favorite activity"],
  anxious: ["Practice deep breathing exercises", "Go for a walk in nature", "Try progressive muscle relaxation"],
  stressed: ["Break tasks into smaller steps", "Take regular breaks", "Practice mindfulness meditation"],
  angry: [
    "Physical exercise (running, yoga)",
    "Express your feelings through journaling",
    "Practice anger management techniques",
  ],
  calm: ["Maintain this peaceful state", "Practice gratitude meditation", "Share your tranquility with others"],
}

interface MoodAnalysisProps {
  ageGroup: string
  age: number
  userName?: string
}

const DAILY_QUOTES = [
  { text: "The only way out is through. Take it one step at a time.", author: "Robert Frost" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.", author: "Akshay Dubey" },
  { text: "Be patient with yourself. You're doing better than you think.", author: "Unknown" },
  { text: "Your mental health is a priority, not a luxury.", author: "Unknown" },
  { text: "Progress is progress, no matter how small.", author: "Unknown" },
]

const WELLNESS_TIPS = [
  { title: "Practice Deep Breathing", description: "Try the 4-7-8 technique: Breathe in for 4 counts, hold for 7, exhale for 8.", emoji: "🫁" },
  { title: "Take a Break", description: "Step away from screens for 10 minutes. Go for a short walk or get some fresh air.", emoji: "🚶" },
  { title: "Practice Gratitude", description: "Write down 3 things you're grateful for today, no matter how small.", emoji: "🙏" },
  { title: "Move Your Body", description: "Do 10 minutes of stretching, yoga, or any physical activity you enjoy.", emoji: "🧘" },
  { title: "Connect with Someone", description: "Text a friend or family member. Reach out to someone you trust.", emoji: "🤝" },
  { title: "Listen to Music", description: "Play your favorite calming or uplifting playlist.", emoji: "🎵" },
]

export default function MoodAnalysis({ ageGroup, age, userName }: MoodAnalysisProps) {
  const [moodInput, setMoodInput] = useState("")
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    setCurrentQuoteIndex(Math.floor(Math.random() * DAILY_QUOTES.length))
    setCurrentTipIndex(Math.floor(Math.random() * WELLNESS_TIPS.length))
  }, [])

  const detectEmotion = (text: string): string => {
    const lowerText = text.toLowerCase()

    const emotionKeywords: Record<string, string[]> = {
      happy: ["happy", "great", "wonderful", "excited", "joy", "amazing", "love"],
      sad: ["sad", "down", "depressed", "lonely", "upset", "unhappy", "blue"],
      anxious: ["anxious", "worried", "nervous", "stressed", "fear", "panic", "overwhelmed"],
      stressed: ["stressed", "pressure", "burden", "exhausted", "tired", "drained"],
      angry: ["angry", "frustrated", "mad", "furious", "irritated", "rage","kill","hate"],
      calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "content","silent"],
    }

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        return emotion
      }
    }
    return "calm"
  }

  const handleAnalyzeMood = async () => {
    if (!moodInput.trim()) return

    setLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const emotion = detectEmotion(moodInput)
    setDetectedEmotion(emotion)
    setResponse(EMOTION_RESPONSES[emotion] || EMOTION_RESPONSES.calm)
    setSuggestions(COPING_SUGGESTIONS[emotion] || COPING_SUGGESTIONS.calm)
    setLoading(false)
  }

  const stressFactors = STRESS_FACTORS[ageGroup] || STRESS_FACTORS["early-adult"]

  return (
    <div className="space-y-6">
      {/* Premium Hero Section */}
      <MoodHero userName={userName} />
      
      {/* Stress Factors for Age Group */}
      <Card className="p-6 border-0 shadow-sm bg-secondary/30">
        <h2 className="text-lg font-semibold text-foreground mb-4">Common Stress Factors for Your Age Group</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stressFactors.map((factor, idx) => (
            <div key={idx} className="bg-background rounded-lg p-3 border border-border text-sm text-foreground">
              {factor}
            </div>
          ))}
        </div>
      </Card>

      {/* Mood Input */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          How are you feeling today?
        </h2>
        <div className="space-y-3">
          <Input
            placeholder="Describe your current emotions or mood..."
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            className="bg-input border-border rounded-xl min-h-20 p-4 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleAnalyzeMood()
              }
            }}
          />
          <Button
            onClick={handleAnalyzeMood}
            disabled={!moodInput.trim() || loading}
            className="gradient-primary hover:opacity-90 text-white rounded-lg w-full md:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze My Mood"}
          </Button>
        </div>
      </Card>

      {/* Emotion Detection Results */}
      {detectedEmotion && (
        <div className="space-y-4">
          <Card className="p-6 border-0 shadow-sm bg-accent/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Detected Emotion</p>
                <h3 className="text-2xl font-bold text-accent capitalize">{detectedEmotion}</h3>
              </div>
              <span className="text-4xl">
                {detectedEmotion === "happy"
                  ? "😊"
                  : detectedEmotion === "sad"
                    ? "😢"
                    : detectedEmotion === "anxious"
                      ? "😰"
                      : detectedEmotion === "stressed"
                        ? "😣"
                        : detectedEmotion === "angry"
                          ? "😠"
                          : "😌"}
              </span>
            </div>
            <p className="text-foreground text-lg">{response}</p>
          </Card>

          {/* Coping Suggestions */}
          <Card className="p-6 border-0 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Coping Suggestions</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-primary">{idx + 1}</span>
                  </div>
                  <p className="text-foreground">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}

      {/* Inspiration Section - Always Visible */}
      <Card className="p-6 border-0 shadow-sm bg-linear-to-br from-primary/10 to-accent/10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Today's Inspiration</h3>
          <Heart className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="mb-6">
          <p className="text-lg italic text-foreground leading-relaxed mb-4">
            "{DAILY_QUOTES[currentQuoteIndex].text}"
          </p>
          <p className="text-sm text-muted-foreground text-right">— {DAILY_QUOTES[currentQuoteIndex].author}</p>
        </div>

        <Button
          onClick={() => setCurrentQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length)}
          variant="outline"
          className="w-full rounded-lg bg-transparent gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Next Inspiration
        </Button>
      </Card>

      {/* Activity Suggestions Section */}
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Wellness Activity Suggestion</h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-3xl">{WELLNESS_TIPS[currentTipIndex].emoji}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">{WELLNESS_TIPS[currentTipIndex].title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {WELLNESS_TIPS[currentTipIndex].description}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setCurrentTipIndex((prev) => (prev + 1) % WELLNESS_TIPS.length)}
          variant="outline"
          className="w-full mt-4 rounded-lg bg-transparent gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Another Activity
        </Button>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-0 shadow-sm bg-secondary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Mental Health Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">🧘</span>
            <span className="text-xs font-medium">Meditate</span>
          </Button>
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">📔</span>
            <span className="text-xs font-medium">Journal</span>
          </Button>
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">🎵</span>
            <span className="text-xs font-medium">Listen</span>
          </Button>
          <Button variant="outline" className="rounded-lg bg-background/80 h-16 flex flex-col gap-1">
            <span className="text-lg">🤝</span>
            <span className="text-xs font-medium">Reach Out</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
