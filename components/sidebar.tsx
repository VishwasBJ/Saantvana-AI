"use client"

import {
  BarChart3,
  Mic2,
  TrendingUp,
  Sparkles,
  MessageCircle,
  BookOpen,
  AlertTriangle,
  Library,
  Trophy,
} from "lucide-react"
import { Button } from "./ui/button"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: any) => void
  user: { name: string; age: number }
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
 const menuItems = [
  { id: "mood", label: "Mood Analysis", icon: BarChart3 },
  { id: "voice", label: "Voice Comfort", icon: Mic2 },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "quotes", label: "Inspiration", icon: Sparkles },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "chatwithme", label: "Chat With Me", icon: MessageCircle },
  { id: "stress", label: "Stress Detector", icon: AlertTriangle }, // <-- NEW
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "resources", label: "Resources", icon: Library },
  { id: "gamification", label: "Achievements", icon: Trophy },
  { id: "crisis", label: "Crisis Help", icon: AlertTriangle },
]


  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col overflow-y-auto">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/40 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">🧠</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-sidebar-foreground">Calm Mind</h2>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Mental Wellness AI</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 rounded-lg text-sm ${
                activeTab === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-sidebar-border">
        <div className="bg-accent/20 rounded-lg p-3">
          <p className="text-xs font-semibold text-accent mb-1">Tip of the Day</p>
          <p className="text-xs text-foreground/70">
            Remember, seeking help is a sign of strength, not weakness.
          </p>
        </div>
      </div>
    </div>
  )
}
