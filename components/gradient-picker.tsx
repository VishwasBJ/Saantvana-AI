"use client"

import { useState, useEffect } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const GRADIENT_PRESETS = [
  {
    name: "Cyan to Green",
    from: "#00A8D6",
    to: "#7AD68A",
  },
  {
    name: "Red to Pink",
    from: "#FF512F",
    to: "#DD2476",
  },
  {
    name: "Purple to Blue",
    from: "#667eea",
    to: "#764ba2",
  },
  {
    name: "Orange to Pink",
    from: "#f093fb",
    to: "#f5576c",
  },
  {
    name: "Blue to Teal",
    from: "#3D8FD9",
    to: "#00C9D6",
  },
  {
    name: "Sunset",
    from: "#fa709a",
    to: "#fee140",
  },
  {
    name: "Ocean",
    from: "#2E3192",
    to: "#1BFFFF",
  },
  {
    name: "Forest",
    from: "#134E5E",
    to: "#71B280",
  },
]

interface GradientPickerProps {
  inDashboard?: boolean
}

export default function GradientPicker({ inDashboard = false }: GradientPickerProps) {
  const [open, setOpen] = useState(false)

  // Load saved gradient on mount
  useEffect(() => {
    const savedFrom = localStorage.getItem("gradient-from")
    const savedTo = localStorage.getItem("gradient-to")
    
    if (savedFrom && savedTo) {
      document.documentElement.style.setProperty("--gradient-from", savedFrom)
      document.documentElement.style.setProperty("--gradient-to", savedTo)
    }
  }, [])

  const applyGradient = (from: string, to: string) => {
    // Update CSS custom properties
    document.documentElement.style.setProperty("--gradient-from", from)
    document.documentElement.style.setProperty("--gradient-to", to)
    
    // Store in localStorage
    localStorage.setItem("gradient-from", from)
    localStorage.setItem("gradient-to", to)
    
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50 rounded-full w-12 h-12 gradient-primary text-white border-0 shadow-lg hover:opacity-90"
        >
          <Palette className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Choose Theme Gradient</h3>
          <div className="grid grid-cols-2 gap-2">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyGradient(preset.from, preset.to)}
                className="group relative h-16 rounded-lg overflow-hidden border-2 border-border hover:border-foreground transition-all"
                style={{
                  background: `linear-gradient(90deg, ${preset.from} 0%, ${preset.to} 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                    {preset.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
