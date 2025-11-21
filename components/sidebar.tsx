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
  LogOut,
} from "lucide-react"
import { Button } from "./ui/button"
import LogoIcon from "./logo-icon"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: any) => void
  user: { name: string; age: number }
  onLogout?: () => void
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
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
    <div className="w-64 bg-white/95 backdrop-blur-md border-r-2 border-gray-200/80 p-6 flex flex-col overflow-y-auto shadow-xl relative z-20">
      <div className="mb-8">
        <div className="w-12 h-12 flex items-center justify-center mb-3">
          <LogoIcon size={48} />
        </div>
        <h2 className="text-xl font-bold gradient-primary-text">Calm Mind</h2>
        <p className="text-sm text-gray-600 mt-1 font-medium">Mental Wellness AI</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "gradient-primary text-white shadow-lg"
                  : "text-gray-700 hover:bg-linear-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="pt-4 border-t-2 border-gray-200 space-y-3">
        <div className="bg-linear-to-br from-teal-50 to-cyan-50 rounded-lg p-3 border border-teal-200/50">
          <p className="text-xs font-bold text-teal-700 mb-1">💡 Tip of the Day</p>
          <p className="text-xs text-gray-700 leading-relaxed">
            Remember, seeking help is a sign of strength, not weakness.
          </p>
        </div>
        
        {/* Logout Button */}
        {onLogout && (
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-3 rounded-lg text-sm font-medium bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        )}
      </div>
    </div>
  )
}
