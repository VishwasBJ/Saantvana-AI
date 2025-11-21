"use client"

import {
  BarChart3,
  TrendingUp,
  MessageCircle,
  BookOpen,
  AlertTriangle,
  Trophy,
  LogOut,
  Stethoscope,
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
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "chatwithme", label: "Therapist", icon: Stethoscope },
  { id: "stress", label: "Stress Detector", icon: AlertTriangle },
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "gamification", label: "Achievements", icon: Trophy },
]


  return (
    <div className="w-72 bg-white/95 backdrop-blur-md border-r-2 border-gray-200/80 px-[26px] py-6 flex flex-col overflow-y-auto shadow-xl relative z-20">
      <div className="mb-8">
        <div className="w-12 h-12 flex items-center justify-center mb-3">
          <LogoIcon size={48} />
        </div>
        <h2 className="text-xl font-bold gradient-primary-text">Calm Mind</h2>
        <p className="text-sm text-gray-600 mt-1 font-medium">Mental Wellness AI</p>
      </div>

      <nav className="space-y-3 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 rounded-lg text-sm font-medium transition-all py-3 ${
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

      {/* User Profile Section */}
      <div className="mb-6 p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-600">Age: {user.age}</p>
          </div>
        </div>
        <div className="text-xs text-gray-700">
          <p className="mb-1">🌟 Keep going strong!</p>
          <p className="text-[10px] text-gray-500">Your wellness journey matters</p>
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="mb-6 bg-linear-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200/50">
        <p className="text-xs font-bold text-teal-700 mb-2">💡 Tip of the Day</p>
        <p className="text-xs text-gray-700 leading-relaxed">
          Remember, seeking help is a sign of strength, not weakness.
        </p>
      </div>

      {/* Spacer to push logout to bottom */}
      <div className="flex-1"></div>

      {/* Logout Button - At Bottom */}
      {onLogout && (
        <div className="pt-6 border-t-2 border-gray-200 mt-5">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-center gap-2 rounded-xl text-sm font-semibold bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border-2 border-gray-200 hover:border-red-300 transition-all py-4 shadow-sm hover:shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  )
}
