"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Star } from "lucide-react"

interface MoodEntry {
  date: string
  mood: number
  timestamp: number
}

export default function ProgressTracker() {
  const [moodScale, setMoodScale] = useState(7)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [weekData, setWeekData] = useState<{ day: string; mood: number }[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load mood history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mood-history")
      if (saved) {
        const parsed = JSON.parse(saved)
        setMoodHistory(parsed)
        
        // Recalculate streak based on actual data
        updateStreakFromHistory(parsed)
      } else {
        // Initialize with sample data for the past 6 days
        const sampleData: MoodEntry[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        for (let i = 6; i >= 1; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          date.setHours(10, 0, 0, 0)
          
          const mood = Math.floor(Math.random() * 5) + 5
          
          sampleData.push({
            date: date.toDateString(),
            mood: mood,
            timestamp: date.getTime(),
          })
        }
        
        setMoodHistory(sampleData)
        localStorage.setItem("mood-history", JSON.stringify(sampleData))
        
        // Calculate streak from sample data
        const streak = calculateStreak(sampleData)
        
        // Determine badges based on streak
        const badges = ["first-step"]
        if (streak >= 7) badges.push("week-warrior")
        if (streak >= 30) badges.push("month-master")
        if (sampleData.length >= 10) badges.push("mindful")
        
        const wellnessStats = {
          streak: streak,
          totalCheckIns: sampleData.length,
          badges: badges,
          lastCheckIn: sampleData[sampleData.length - 1].date,
        }
        localStorage.setItem("wellness-stats", JSON.stringify(wellnessStats))
      }
    } catch (error) {
      console.error("Error loading mood history:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const calculateStreak = (history: MoodEntry[]) => {
    if (history.length === 0) return 0
    
    // Sort by timestamp descending
    const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp)
    
    // Get unique dates
    const uniqueDates = new Set(sorted.map((entry) => entry.date))
    const dates = Array.from(uniqueDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < dates.length; i++) {
      const checkDate = new Date(dates[i])
      checkDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)
      expectedDate.setHours(0, 0, 0, 0)
      
      if (checkDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const updateStreakFromHistory = (history: MoodEntry[]) => {
    try {
      const saved = localStorage.getItem("wellness-stats")
      const stats = saved ? JSON.parse(saved) : { streak: 0, totalCheckIns: 0, badges: [], lastCheckIn: null }
      
      const newStreak = calculateStreak(history)
      
      // Update badges based on streak and check-ins
      const newBadges = [...(stats.badges || [])]
      if (!newBadges.includes("first-step") && history.length > 0) {
        newBadges.push("first-step")
      }
      if (!newBadges.includes("week-warrior") && newStreak >= 7) {
        newBadges.push("week-warrior")
      }
      if (!newBadges.includes("month-master") && newStreak >= 30) {
        newBadges.push("month-master")
      }
      if (!newBadges.includes("mindful") && history.length >= 10) {
        newBadges.push("mindful")
      }
      
      const newStats = {
        ...stats,
        streak: newStreak,
        totalCheckIns: history.length,
        badges: newBadges,
      }
      
      localStorage.setItem("wellness-stats", JSON.stringify(newStats))
    } catch (error) {
      console.error("Error updating streak:", error)
    }
  }

  // Generate last 7 days data whenever mood history changes
  useEffect(() => {
    if (isLoaded) {
      const last7Days = getLast7DaysData()
      setWeekData(last7Days)
    }
  }, [moodHistory, isLoaded])

  // Save mood history to localStorage
  useEffect(() => {
    if (isLoaded && moodHistory.length >= 0) {
      try {
        localStorage.setItem("mood-history", JSON.stringify(moodHistory))
      } catch (error) {
        console.error("Error saving mood history:", error)
      }
    }
  }, [moodHistory, isLoaded])

  const getLast7DaysData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const result = []
    const today = new Date()

    console.log("Generating 7 days data from mood history:", moodHistory)

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toDateString()
      const dayName = days[date.getDay()]

      // Find mood entries for this date
      const dayEntries = moodHistory.filter((entry) => {
        const entryDate = new Date(entry.timestamp).toDateString()
        const matches = entryDate === dateString
        if (matches) {
          console.log(`Match found: ${entryDate} === ${dateString}`)
        }
        return matches
      })

      // Calculate average mood for the day
      const avgMood =
        dayEntries.length > 0
          ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length
          : 0

      console.log(`${dayName} (${dateString}): ${dayEntries.length} entries, avg mood: ${avgMood}`)

      result.push({
        day: dayName,
        mood: Math.round(avgMood * 10) / 10,
      })
    }

    console.log("Final week data:", result)
    return result
  }

  const handleSaveMood = () => {
    const newEntry: MoodEntry = {
      date: new Date().toDateString(),
      mood: moodScale,
      timestamp: Date.now(),
    }

    setMoodHistory((prev) => [...prev, newEntry])

    // Update wellness stats for achievements
    updateWellnessStats()

    // Reset to default
    setMoodScale(7)
  }

  const updateWellnessStats = () => {
    try {
      const saved = localStorage.getItem("wellness-stats")
      const stats = saved
        ? JSON.parse(saved)
        : {
            streak: 0,
            totalCheckIns: 0,
            badges: [],
            lastCheckIn: null,
          }

      const today = new Date().toDateString()
      const lastCheckIn = stats.lastCheckIn

      let newStreak = stats.streak
      if (lastCheckIn !== today) {
        if (lastCheckIn) {
          const lastDate = new Date(lastCheckIn)
          const currentDate = new Date()
          const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            newStreak += 1
          } else if (diffDays > 1) {
            newStreak = 1
          }
        } else {
          newStreak = 1
        }

        const newBadges = [...stats.badges]
        if (!newBadges.includes("first-step")) {
          newBadges.push("first-step")
        }
        if (newStreak >= 7 && !newBadges.includes("week-warrior")) {
          newBadges.push("week-warrior")
        }
        if (newStreak >= 30 && !newBadges.includes("month-master")) {
          newBadges.push("month-master")
        }
        if (stats.totalCheckIns + 1 >= 10 && !newBadges.includes("mindful")) {
          newBadges.push("mindful")
        }

        const newStats = {
          streak: newStreak,
          totalCheckIns: stats.totalCheckIns + 1,
          badges: newBadges,
          lastCheckIn: today,
        }

        localStorage.setItem("wellness-stats", JSON.stringify(newStats))
      }
    } catch (error) {
      console.error("Error updating wellness stats:", error)
    }
  }

  const averageMood =
    weekData.length > 0
      ? (weekData.reduce((sum, item) => sum + item.mood, 0) / weekData.filter((d) => d.mood > 0).length || 0).toFixed(
          1,
        )
      : "0.0"

  const getMoodLabel = (value: number) => {
    if (value <= 3) return "Very Low"
    if (value <= 5) return "Low"
    if (value <= 7) return "Moderate"
    if (value <= 9) return "Good"
    return "Excellent"
  }

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
            className={`w-5 h-5 ${
              star <= count
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    )
  }

  const getBestDay = () => {
    if (weekData.length === 0) return null
    const best = weekData.reduce((max, day) => (day.mood > max.mood ? day : max), weekData[0])
    return best.mood > 0 ? best : null
  }

  const getMoodTrend = () => {
    const validDays = weekData.filter((d) => d.mood > 0)
    if (validDays.length < 2) return 0
    const firstMood = validDays[0].mood
    const lastMood = validDays[validDays.length - 1].mood
    return lastMood - firstMood
  }

  const bestDay = getBestDay()
  const moodTrend = getMoodTrend()

  return (
    <div className="space-y-6">
      {/* Daily Mood Rating */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Rate Your Current Mood</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground block mb-1">
                Mood Level: {getMoodLabel(moodScale)}
              </span>
              {renderStars(getMoodStars(moodScale))}
            </div>
            <span className="text-2xl font-bold text-accent">{moodScale}/10</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={moodScale}
            onChange={(e) => setMoodScale(Number.parseInt(e.target.value))}
            className="w-full h-2 rounded-lg bg-secondary/30 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Very Low</span>
            <span>Excellent</span>
          </div>
          <Button
            onClick={handleSaveMood}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            Save Today's Mood
          </Button>
        </div>
      </Card>

      {/* Weekly Chart */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Weekly Mood Trend (Last 7 Days)</h2>
          <p className="text-xs text-muted-foreground">
            {moodHistory.length} total entries
          </p>
        </div>
        {weekData.filter((d) => d.mood > 0).length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props
                    if (payload.mood === 0) return null
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill="var(--color-accent)"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                      />
                    )
                  }}
                  activeDot={{ r: 7 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Average Mood: </span>
                <span className="text-accent font-bold">{averageMood}/10</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {moodTrend > 0
                  ? `Your mood has improved by ${moodTrend.toFixed(1)} points this week. Keep up the great work!`
                  : moodTrend < 0
                    ? `Your mood has decreased by ${Math.abs(moodTrend).toFixed(1)} points. Remember to take care of yourself.`
                    : "Your mood has been stable this week. Keep maintaining your wellness routine!"}
              </p>
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No mood data yet. Start tracking your mood to see your weekly trend!</p>
          </div>
        )}
      </Card>

      {/* Insights */}
      {weekData.filter((d) => d.mood > 0).length > 0 && (
        <Card className="p-6 border-0 shadow-sm bg-accent/10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Insights</h2>
          <div className="space-y-3">
            {moodTrend !== 0 && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">{moodTrend > 0 ? "📈" : "📉"}</span>
                <div>
                  <p className="font-medium text-foreground">
                    {moodTrend > 0 ? "Positive Trend" : "Needs Attention"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your mood has {moodTrend > 0 ? "improved" : "decreased"} by{" "}
                    {Math.abs(moodTrend).toFixed(1)} points this week.
                  </p>
                </div>
              </div>
            )}
            {bestDay && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-medium text-foreground">Best Day</p>
                  <p className="text-sm text-muted-foreground">
                    {bestDay.day} was your best day with a mood rating of {bestDay.mood}/10.
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <p className="font-medium text-foreground">Keep Going</p>
                <p className="text-sm text-muted-foreground">
                  You've tracked {moodHistory.length} mood check-in{moodHistory.length !== 1 ? "s" : ""}. Keep it up!
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
