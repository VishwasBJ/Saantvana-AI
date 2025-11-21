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

const MOOD_QUOTES: Record<string, { text: string; author: string }[]> = {
  happy: [
    { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Happiness is the secret to all beauty. There is no beauty without happiness.", author: "Christian Dior" },
  ],
  sad: [
    { text: "Every storm runs out of rain. This too shall pass.", author: "Maya Angelou" },
    { text: "The sun will rise and we will try again.", author: "Twenty One Pilots" },
    { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  ],
  anxious: [
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "Anxiety does not empty tomorrow of its sorrows, but only empties today of its strength.", author: "Charles Spurgeon" },
    { text: "Nothing can bring you peace but yourself.", author: "Ralph Waldo Emerson" },
  ],
  stressed: [
    { text: "It's not the load that breaks you down, it's the way you carry it.", author: "Lou Holtz" },
    { text: "You must learn to let go. Release the stress. You were never in control anyway.", author: "Steve Maraboli" },
    { text: "Take rest; a field that has rested gives a bountiful crop.", author: "Ovid" },
  ],
  angry: [
    { text: "For every minute you remain angry, you give up sixty seconds of peace of mind.", author: "Ralph Waldo Emerson" },
    { text: "Holding onto anger is like drinking poison and expecting the other person to die.", author: "Buddha" },
    { text: "The best fighter is never angry.", author: "Lao Tzu" },
  ],
  calm: [
    { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
    { text: "Calmness is the cradle of power.", author: "Josiah Gilbert Holland" },
    { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  ],
}

const MOOD_WELLNESS_TIPS: Record<string, { title: string; description: string; emoji: string }[]> = {
  happy: [
    { title: "Share Your Joy", description: "Call a friend or family member and share something positive. Happiness multiplies when shared.", emoji: "😊" },
    { title: "Practice Gratitude", description: "Write down 3 things you're grateful for today. Amplify your positive feelings.", emoji: "🙏" },
    { title: "Help Someone", description: "Do a random act of kindness. Helping others enhances your own happiness.", emoji: "🤝" },
  ],
  sad: [
    { title: "Gentle Movement", description: "Take a slow walk outside. Fresh air and movement can lift your spirits.", emoji: "🚶" },
    { title: "Reach Out", description: "Connect with someone you trust. You don't have to go through this alone.", emoji: "💙" },
    { title: "Self-Compassion", description: "Treat yourself with kindness. It's okay to not be okay sometimes.", emoji: "🫂" },
  ],
  anxious: [
    { title: "Deep Breathing", description: "Try the 4-7-8 technique: Breathe in for 4, hold for 7, exhale for 8. Repeat 3 times.", emoji: "🫁" },
    { title: "Ground Yourself", description: "Use the 5-4-3-2-1 technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.", emoji: "🌿" },
    { title: "Limit Caffeine", description: "Reduce coffee or energy drinks. They can increase anxiety symptoms.", emoji: "☕" },
  ],
  stressed: [
    { title: "Take Breaks", description: "Step away for 5-10 minutes every hour. Short breaks improve productivity and reduce stress.", emoji: "⏸️" },
    { title: "Progressive Relaxation", description: "Tense and release each muscle group from toes to head. Release physical tension.", emoji: "🧘" },
    { title: "Prioritize Tasks", description: "Write down 3 most important tasks. Focus on one at a time.", emoji: "📝" },
  ],
  angry: [
    { title: "Physical Release", description: "Go for a run, hit a punching bag, or do intense exercise. Channel the energy physically.", emoji: "🏃" },
    { title: "Count to 10", description: "Before reacting, take 10 deep breaths. Give yourself time to respond, not react.", emoji: "🔢" },
    { title: "Express Safely", description: "Write down your feelings in a journal. Get it out without hurting anyone.", emoji: "📓" },
  ],
  calm: [
    { title: "Maintain Peace", description: "Practice meditation for 10 minutes. Deepen your sense of calm.", emoji: "🧘" },
    { title: "Mindful Activity", description: "Engage in something creative: draw, paint, or craft. Stay in the present moment.", emoji: "🎨" },
    { title: "Nature Connection", description: "Spend time in nature. Let the natural calm surround you.", emoji: "🌳" },
  ],
}

export default function MoodAnalysis({ ageGroup, age, userName }: MoodAnalysisProps) {
  const [moodInput, setMoodInput] = useState("")
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    setCurrentQuoteIndex(0)
    setCurrentTipIndex(0)
  }, [detectedEmotion])

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

  const handleAnalyzeMood = async (mood?: string) => {
    const selectedMood = mood || moodInput.trim()
    if (!selectedMood) return

    setLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const emotion = mood || detectEmotion(moodInput)
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
      <Card className="p-6 md:p-8 shadow-sm bg-white/5 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-md opacity-80">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-primary-text opacity-90">Common Stress Factors</h2>
            <p className="text-sm text-muted-foreground opacity-70">For your age group</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stressFactors.map((factor, idx) => (
            <div 
              key={idx} 
              className="group bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/50 text-sm text-foreground shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-white/60 cursor-pointer hover:scale-105"
            >
              <div className="flex items-start gap-3">
                <span className="gradient-primary-text font-bold text-lg shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">{idx + 1}</span>
                <span className="font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{factor}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Mood Selection */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          How are you feeling today?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button
            onClick={() => {
              setMoodInput("happy")
              handleAnalyzeMood("happy")
            }}
            disabled={loading}
            className="h-32 flex flex-col gap-3 bg-linear-to-br from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-yellow-200 hover:border-yellow-300 text-gray-800 rounded-2xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-5xl">😊</span>
            <span className="text-base font-semibold">Happy</span>
          </Button>

          <Button
            onClick={() => {
              setMoodInput("sad")
              handleAnalyzeMood("sad")
            }}
            disabled={loading}
            className="h-32 flex flex-col gap-3 bg-linear-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 text-gray-800 rounded-2xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-5xl">😢</span>
            <span className="text-base font-semibold">Sad</span>
          </Button>

          <Button
            onClick={() => {
              setMoodInput("anxious")
              handleAnalyzeMood("anxious")
            }}
            disabled={loading}
            className="h-32 flex flex-col gap-3 bg-linear-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 text-gray-800 rounded-2xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-5xl">😰</span>
            <span className="text-base font-semibold">Anxious</span>
          </Button>

          <Button
            onClick={() => {
              setMoodInput("stressed")
              handleAnalyzeMood("stressed")
            }}
            disabled={loading}
            className="h-32 flex flex-col gap-3 bg-linear-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-2 border-orange-200 hover:border-orange-300 text-gray-800 rounded-2xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-5xl">😣</span>
            <span className="text-base font-semibold">Stressed</span>
          </Button>

          <Button
            onClick={() => {
              setMoodInput("angry")
              handleAnalyzeMood("angry")
            }}
            disabled={loading}
            className="h-32 flex flex-col gap-3 bg-linear-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-2 border-red-200 hover:border-red-300 text-gray-800 rounded-2xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-5xl">😠</span>
            <span className="text-base font-semibold">Angry</span>
          </Button>
        </div>
        {loading && (
          <p className="text-center text-muted-foreground mt-4">Analyzing your mood...</p>
        )}
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

          {/* Three Sections Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Coping Suggestions */}
            <Card className="p-5 border-0 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-3">Coping Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-primary/10 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Inspiration */}
            {MOOD_QUOTES[detectedEmotion] && (
              <Card className="p-5 border-0 shadow-sm bg-linear-to-br from-primary/10 to-accent/10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-foreground">Inspiration for You</h3>
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>

                <div className="mb-4">
                  <p className="text-sm italic text-foreground leading-relaxed mb-3">
                    "{MOOD_QUOTES[detectedEmotion][currentQuoteIndex % MOOD_QUOTES[detectedEmotion].length].text}"
                  </p>
                  <p className="text-xs text-muted-foreground text-right">
                    — {MOOD_QUOTES[detectedEmotion][currentQuoteIndex % MOOD_QUOTES[detectedEmotion].length].author}
                  </p>
                </div>

                <Button
                  onClick={() => setCurrentQuoteIndex((prev) => prev + 1)}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg bg-transparent gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Next Inspiration
                </Button>
              </Card>
            )}

            {/* Recommended Activity */}
            {MOOD_WELLNESS_TIPS[detectedEmotion] && (
              <Card className="p-5 border-0 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-3">Recommended Activity for Your Mood</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{MOOD_WELLNESS_TIPS[detectedEmotion][currentTipIndex % MOOD_WELLNESS_TIPS[detectedEmotion].length].emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1 text-sm">
                        {MOOD_WELLNESS_TIPS[detectedEmotion][currentTipIndex % MOOD_WELLNESS_TIPS[detectedEmotion].length].title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {MOOD_WELLNESS_TIPS[detectedEmotion][currentTipIndex % MOOD_WELLNESS_TIPS[detectedEmotion].length].description}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentTipIndex((prev) => prev + 1)}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg bg-transparent gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Another Activity
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

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
