"use client"
import StressVideo from "./stress-video" // <-- import at top

import { useState } from "react"
import Sidebar from "./sidebar"
import MoodAnalysis from "./mood-analysis"
import VoiceComfort from "./voice-comfort"
import ProgressTracker from "./progress-tracker"
import QuotesSuggestions from "./quotes-suggestions"
import AIChat from "./ai-chat"
import Journal from "./journal"
import CrisisResources from "./crisis-resources"
import ResourceLibrary from "./resource-library"
import WellnessGamification from "./wellness-gamification"
import ChatWithMe from "./ui/chatwithme"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"


interface DashboardProps {
  user: {
    name: string
    email: string
    phone: string
    age: number
    pronouns?: string
    guardianName?: string
    anonymous?: boolean
  }
  onLogout: () => void
}

type TabType =
  | "mood"
  | "chatwithme"
  | "stress"      // <-- new tab
  | "voice"
  | "progress"
  | "quotes"
  | "chat"
  | "journal"
  | "crisis"
  | "resources"
  | "gamification"

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("mood")

  const getAgeGroup = (age: number) => {
    if (age >= 12 && age <= 18) return "adolescent"
    if (age > 18 && age <= 25) return "young-adult"
    if (age > 25 && age <= 35) return "early-adult"
    if (age > 35 && age <= 50) return "mature-adult"
    return "other"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="rounded-lg gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === "mood" && (
            <MoodAnalysis ageGroup={getAgeGroup(user.age)} age={user.age} />
          )}
          
// Inside your tab content rendering
{activeTab === "stress" && <StressVideo />}

          {activeTab === "chatwithme" && <ChatWithMe age={user.age} />}
          {activeTab === "voice" && <VoiceComfort />}
          {activeTab === "progress" && <ProgressTracker />}
          {activeTab === "quotes" && <QuotesSuggestions ageGroup={getAgeGroup(user.age)} />}
          {activeTab === "chat" && <AIChat age={user.age} selectedCategories={[]} />}
          {activeTab === "journal" && <Journal />}
          {activeTab === "crisis" && <CrisisResources />}
          {activeTab === "resources" && <ResourceLibrary />}
          {activeTab === "gamification" && <WellnessGamification />}
          {activeTab === "stress" && <StressVideo />}

        </div>
      </div>
    </div>
  )
}
