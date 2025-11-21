"use client"
import StressVideo from "./stress-video" // <-- import at top

import { useState } from "react"
import { Menu, X } from "lucide-react"
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
import GradientPicker from "./gradient-picker"
import WaveBackgroundDashboard from "./wave-background-dashboard"
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const getAgeGroup = (age: number) => {
    if (age >= 12 && age <= 18) return "adolescent"
    if (age > 18 && age <= 25) return "young-adult"
    if (age > 25 && age <= 35) return "early-adult"
    if (age > 35 && age <= 50) return "mature-adult"
    return "other"
  }

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {/* Wave Background for Dashboard - Less Transparent */}
      <WaveBackgroundDashboard />
      
      <GradientPicker inDashboard={true} />
      
      {/* Mobile Hamburger Button - Calm Theme */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all border border-teal-200/30 hover:bg-white/90"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-teal-600" />
        ) : (
          <Menu className="w-6 h-6 text-teal-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab)
            setIsSidebarOpen(false) // Close sidebar on mobile after selection
          }} 
          user={user}
          onLogout={onLogout}
        />
      </div>

      <div className="flex-1 overflow-auto relative z-10 bg-linear-to-br from-gray-50/80 to-white/80 backdrop-blur-sm">
        <div className="p-4 md:p-6 lg:p-6 pt-16 lg:pt-4">

          {/* Tab Content */}
          {activeTab === "mood" && (
            <MoodAnalysis ageGroup={getAgeGroup(user.age)} age={user.age} userName={user.name} />
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
