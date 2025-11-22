"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Flame, Star, Award } from "lucide-react"

interface WellnessStats {
  streak: number
  totalCheckIns: number
  badges: string[]
  lastCheckIn: string | null
}

const ACHIEVEMENTS = [
  { id: "first-step", name: "First Step", description: "Complete your first mood check-in", icon: "🎯" },
  { id: "week-warrior", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "⚔️" },
  { id: "month-master", name: "Month Master", description: "Maintain a 30-day streak", icon: "👑" },
  { id: "journal-keeper", name: "Journal Keeper", description: "Write 10 journal entries", icon: "📔" },
  { id: "meditation-pro", name: "Meditation Pro", description: "Complete 10 meditations", icon: "🧘" },
  { id: "helping-hand", name: "Helping Hand", description: "Share support with others", icon: "🤝" },
  { id: "resilience", name: "Resilience", description: "Overcome a challenging mood", icon: "💪" },
  { id: "mindful", name: "Mindful", description: "Complete breathing exercises", icon: "🌿" },
]

export default function WellnessGamification() {
  const [stats, setStats] = useState<WellnessStats>({
    streak: 0,
    totalCheckIns: 0,
    badges: [],
    lastCheckIn: null,
  })
  const [averageMood, setAverageMood] = useState(0)

  useEffect(() => {
    const loadStats = () => {
      const saved = localStorage.getItem("wellness-stats")
      if (saved) {
        setStats(JSON.parse(saved))
      }

      // Calculate average mood from mood history
      const moodHistory = localStorage.getItem("mood-history")
      if (moodHistory) {
        const moods = JSON.parse(moodHistory)
        if (moods.length > 0) {
          const total = moods.reduce((sum: number, entry: any) => sum + entry.mood, 0)
          const avg = total / moods.length
          setAverageMood(avg)
        }
      }
    }

    // Load initially
    loadStats()

    // Reload stats every 2 seconds to sync with mood tracker updates
    const interval = setInterval(loadStats, 2000)

    return () => clearInterval(interval)
  }, [])

  // Check journal entries for journal-keeper badge
  useEffect(() => {
    const checkJournalBadge = () => {
      try {
        const journalEntries = localStorage.getItem("journal-entries")
        if (journalEntries) {
          const entries = JSON.parse(journalEntries)
          if (entries.length >= 10 && !stats.badges.includes("journal-keeper")) {
            const newStats = {
              ...stats,
              badges: [...stats.badges, "journal-keeper"],
            }
            setStats(newStats)
            localStorage.setItem("wellness-stats", JSON.stringify(newStats))
          }
        }
      } catch (error) {
        console.error("Error checking journal badge:", error)
      }
    }

    checkJournalBadge()
  }, [stats])

  const earnedAchievements = ACHIEVEMENTS.filter((a) => stats.badges.includes(a.id))
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !stats.badges.includes(a.id))

  const streakPercentage = Math.min((stats.streak / 30) * 100, 100)
  const checkInPercentage = Math.min((stats.totalCheckIns / 50) * 100, 100)

  const getMoodStars = (value: number) => {
    if (value >= 1 && value <= 2) return 1
    if (value >= 3 && value <= 4) return 2
    if (value >= 5 && value <= 6) return 3
    if (value >= 7 && value <= 9) return 4
    if (value === 10) return 5
    return 0
  }

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= count
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Wellness Journey</h2>
        <p className="text-muted-foreground">Track your progress and earn achievements</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-3xl font-bold text-primary">{stats.streak}</p>
            </div>
            <Flame className="w-10 h-10 text-orange-500" />
          </div>
          <Progress value={streakPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">Goal: 30 days</p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Check-Ins</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-blue-500">{stats.totalCheckIns}</p>
                {averageMood > 0 && renderStars(getMoodStars(averageMood))}
              </div>
              {averageMood > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Avg Mood: {averageMood.toFixed(1)}/10
                </p>
              )}
            </div>
            <Star className="w-10 h-10 text-yellow-500" />
          </div>
          <Progress value={checkInPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">Goal: 50 check-ins</p>
        </Card>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements Earned ({earnedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {earnedAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge className="bg-yellow-500 text-white">Earned</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-400" />
            Locked Achievements ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 opacity-60">
                <div className="flex items-start gap-3">
                  <span className="text-2xl grayscale">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
